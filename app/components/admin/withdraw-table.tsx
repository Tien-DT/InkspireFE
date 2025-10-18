import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Check, X, Eye, DollarSign, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'
import { Input } from '~/components/ui/input'
import { toast } from 'sonner'

interface WithdrawRequest {
  id: string
  userId: string
  user?: {
    firstName?: string
    lastName?: string
    email?: string
    role?: number
  }
  walletId: string
  amount: number
  netAmount?: number // Amount freelancer receives (80%)
  platformFeeAmount?: number // Platform commission (20%)
  platformFeePercentage?: number // Fee percentage at time of creation
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
  requestType: number
  status: number
  adminNotes?: string
  createdAt: string
  approvedAt?: string
  completedAt?: string
}

// Helper function to normalize PascalCase to camelCase
const normalizeWithdrawRequest = (data: any): WithdrawRequest => {
  return {
    id: data.Id || data.id,
    userId: data.UserId || data.userId,
    user: data.User ? {
      firstName: data.User.FirstName || data.User.firstName,
      lastName: data.User.LastName || data.User.lastName,
      email: data.User.Email || data.User.email,
      role: data.User.Role ?? data.User.role
    } : data.user,
    walletId: data.WalletId || data.walletId,
    amount: data.Amount ?? data.amount ?? 0,
    netAmount: data.NetAmount ?? data.netAmount,
    platformFeeAmount: data.PlatformFeeAmount ?? data.platformFeeAmount,
    platformFeePercentage: data.PlatformFeePercentage ?? data.platformFeePercentage,
    bankName: data.BankName || data.bankName,
    bankAccountNumber: data.BankAccountNumber || data.bankAccountNumber,
    bankAccountName: data.BankAccountName || data.bankAccountName,
    requestType: data.RequestType ?? data.requestType ?? 0,
    status: data.Status ?? data.status ?? 0,
    adminNotes: data.AdminNotes || data.adminNotes,
    createdAt: data.CreatedAt || data.createdAt,
    approvedAt: data.ApprovedAt || data.approvedAt,
    completedAt: data.CompletedAt || data.completedAt
  }
}

export function WithdrawRequestTable() {
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: 'approve' | 'reject' | 'complete' | 'view' | null
    request: WithdrawRequest | null
  }>({ open: false, type: null, request: null })
  const [adminNotes, setAdminNotes] = useState('')
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: ''
  })
  const [triggeringMonthly, setTriggeringMonthly] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(20)

  useEffect(() => {
    fetchWithdrawRequests()
  }, [currentPage])

  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // OData pagination parameters
      const skip = (currentPage - 1) * pageSize
      const odataParams = [
        `$expand=user,wallet`,
        `$orderby=createdAt desc`,
        `$top=${pageSize}`,
        `$skip=${skip}`,
        `$count=true`
      ].join('&')
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests?${odataParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        
        let rawRequests: any[] = []
        let count = 0
        
        // OData returns data in 'value' property with @odata.count for total
        if (data['@odata.count'] !== undefined) {
          count = data['@odata.count']
          rawRequests = data.value || []
        } else if (Array.isArray(data)) {
          // Direct array response (non-OData or OData without count)
          rawRequests = data
          count = data.length
        } else if (data.value) {
          // OData format without count
          rawRequests = data.value
          count = data.value.length
        } else {
          rawRequests = []
          count = 0
        }
        
        // Normalize all requests from PascalCase to camelCase
        const normalizedRequests = rawRequests.map(normalizeWithdrawRequest)
        
        setWithdrawRequests(normalizedRequests)
        setTotalCount(count)
      }
    } catch (error) {
      console.error('Error fetching withdraw requests:', error)
      toast.error('Không thể tải danh sách yêu cầu rút tiền')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!actionDialog.request) return
    
    // Check if bank info is missing and require it
    if (!actionDialog.request.bankName && !bankInfo.bankName) {
      toast.error('Vui lòng nhập thông tin ngân hàng')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests/${actionDialog.request.id}/approve`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            adminNotes,
            bankName: bankInfo.bankName || undefined,
            bankAccountNumber: bankInfo.bankAccountNumber || undefined,
            bankAccountName: bankInfo.bankAccountName || undefined
          })
        }
      )
      
      if (response.ok) {
        toast.success('Đã duyệt yêu cầu rút tiền')
        await fetchWithdrawRequests()
        setActionDialog({ open: false, type: null, request: null })
        setAdminNotes('')
        setBankInfo({ bankName: '', bankAccountNumber: '', bankAccountName: '' })
      } else {
        const error = await response.text()
        toast.error(`Không thể duyệt yêu cầu: ${error}`)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi duyệt yêu cầu')
    }
  }

  const handleReject = async () => {
    if (!actionDialog.request || !adminNotes) {
      toast.error('Vui lòng nhập lý do từ chối')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests/${actionDialog.request.id}/reject`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: adminNotes })
        }
      )
      
      if (response.ok) {
        toast.success('Đã từ chối yêu cầu rút tiền')
        await fetchWithdrawRequests()
        setActionDialog({ open: false, type: null, request: null })
        setAdminNotes('')
      } else {
        const error = await response.text()
        toast.error(`Không thể từ chối yêu cầu: ${error}`)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi từ chối yêu cầu')
    }
  }

  const handleComplete = async () => {
    if (!actionDialog.request) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests/${actionDialog.request.id}/complete`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ transactionReference: adminNotes })
        }
      )
      
      if (response.ok) {
        toast.success('Đã hoàn thành yêu cầu rút tiền')
        await fetchWithdrawRequests()
        setActionDialog({ open: false, type: null, request: null })
        setAdminNotes('')
      } else {
        const error = await response.text()
        toast.error(`Không thể hoàn thành yêu cầu: ${error}`)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi hoàn thành yêu cầu')
    }
  }

  const handleTriggerMonthly = async () => {
    if (!confirm('Bạn có chắc chắn muốn tạo lệnh rút tiền hàng tháng cho tất cả freelancer?')) {
      return
    }

    setTriggeringMonthly(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests/trigger-monthly`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.ok) {
        const result = await response.json()
        const created = result.created || 0
        const skipped = result.skipped || 0
        
        if (created > 0) {
          toast.success(
            `Đã tạo ${created} lệnh rút tiền mới${skipped > 0 ? `, bỏ qua ${skipped} tài khoản` : ''}`
          )
        } else if (skipped > 0) {
          toast.warning(`Không có lệnh mới được tạo. Bỏ qua ${skipped} tài khoản (đã có lệnh hoặc không có thông tin ngân hàng)`)
        } else {
          toast.info('Không có tài khoản nào đủ điều kiện để tạo lệnh rút tiền')
        }
        
        setCurrentPage(1) // Reset to first page
        fetchWithdrawRequests()
      } else {
        const error = await response.text()
        toast.error(`Không thể tạo lệnh rút tiền: ${error}`)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tạo lệnh rút tiền hàng tháng')
    } finally {
      setTriggeringMonthly(false)
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Chờ xử lý</Badge>
      case 1:
        return <Badge variant="outline" className="border-green-500 text-green-700">Đã duyệt</Badge>
      case 2:
        return <Badge variant="outline" className="border-red-500 text-red-700">Từ chối</Badge>
      case 3:
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Hoàn thành</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const getRequestTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return <Badge variant="secondary">Thủ công</Badge>
      case 2:
        return <Badge variant="default">Tự động hàng tháng</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    if (!date) return '-'
    try {
      return new Date(date).toLocaleString('vi-VN')
    } catch (error) {
      return '-'
    }
  }

  if (loading) {
    return (
      <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
        <CardHeader className='pb-3'>
          <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card className='border-0 bg-white dark:bg-slate-950 shadow-none'>
        <CardHeader className='pb-3'>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className='text-base sm:text-lg'>Danh sách yêu cầu rút tiền</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                Quản lý và xử lý các yêu cầu rút tiền từ người dùng
              </CardDescription>
            </div>
            <Button 
              onClick={handleTriggerMonthly}
              disabled={triggeringMonthly}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {triggeringMonthly ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tạo lệnh rút tiền tháng
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className='p-3 sm:p-4'>
          <Table className='text-xs sm:text-sm'>
            <TableCaption>Danh sách yêu cầu rút tiền gần đây</TableCaption>
            <TableHeader>
              <TableRow className='text-xs sm:text-sm'>
                <TableHead>Người dùng</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Người nhận</TableHead>
                <TableHead>Hoa hồng</TableHead>
                <TableHead>Số tài khoản</TableHead>
                <TableHead>Tên ngân hàng</TableHead>
                <TableHead>Tên người nhận</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    Không có yêu cầu rút tiền nào
                  </TableCell>
                </TableRow>
              ) : (
                withdrawRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {request.user?.firstName || ''} {request.user?.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500">{request.user?.email || ''}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.user?.role === 1 ? (
                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                          CLIENT
                        </Badge>
                      ) : request.user?.role === 2 ? (
                        <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
                          FREELANCER
                        </Badge>
                      ) : (
                        <Badge variant="secondary">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.amount ? formatCurrency(request.amount) : '0 ₫'}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(request.netAmount ?? request.amount * 0.8)}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {formatCurrency(request.platformFeeAmount ?? request.amount * 0.2)}
                      {request.platformFeePercentage !== undefined && request.platformFeePercentage !== null && (
                        <div className="text-xs text-gray-500">({request.platformFeePercentage}%)</div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {request.bankAccountNumber || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {request.bankName || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {request.bankAccountName || '-'}
                    </TableCell>
                    <TableCell>{request.requestType !== undefined ? getRequestTypeBadge(request.requestType) : '-'}</TableCell>
                    <TableCell>{request.status !== undefined ? getStatusBadge(request.status) : '-'}</TableCell>
                    <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActionDialog({ open: true, type: 'view', request })}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 0 && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => setActionDialog({ open: true, type: 'approve', request })}
                              title="Duyệt yêu cầu"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => setActionDialog({ open: true, type: 'reject', request })}
                              title="Từ chối"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {request.status === 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => setActionDialog({ open: true, type: 'complete', request })}
                            title="Đánh dấu hoàn thành"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalCount > pageSize && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalCount)} trong tổng số {totalCount} yêu cầu
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <div className="text-sm">
                  Trang {currentPage} / {Math.ceil(totalCount / pageSize)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                  disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={actionDialog.open} onOpenChange={(open) => {
        if (!open) {
          setActionDialog({ open: false, type: null, request: null })
          setAdminNotes('')
          setBankInfo({ bankName: '', bankAccountNumber: '', bankAccountName: '' })
        } else if (actionDialog.request) {
          // Pre-fill bank info if exists
          setBankInfo({
            bankName: actionDialog.request.bankName || '',
            bankAccountNumber: actionDialog.request.bankAccountNumber || '',
            bankAccountName: actionDialog.request.bankAccountName || ''
          })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' && 'Duyệt yêu cầu rút tiền'}
              {actionDialog.type === 'reject' && 'Từ chối yêu cầu rút tiền'}
              {actionDialog.type === 'complete' && 'Hoàn thành rút tiền'}
              {actionDialog.type === 'view' && 'Chi tiết yêu cầu'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.request && (
                <div className="space-y-2 mt-4">
                  <p><strong>Người dùng:</strong> {actionDialog.request.user?.firstName || ''} {actionDialog.request.user?.lastName || ''}</p>
                  <p><strong>Email:</strong> {actionDialog.request.user?.email || '-'}</p>
                  <p><strong>Tổng tiền rút:</strong> {actionDialog.request.amount ? formatCurrency(actionDialog.request.amount) : '0 ₫'}</p>
                  <div className="p-3 bg-gray-50 rounded-md space-y-1">
                    <p className="text-green-600">
                      <strong>Người dùng nhận:</strong> {formatCurrency(actionDialog.request.netAmount ?? actionDialog.request.amount * 0.8)}
                    </p>
                    <p className="text-orange-600">
                      <strong>Hoa hồng platform:</strong> {formatCurrency(actionDialog.request.platformFeeAmount ?? actionDialog.request.amount * 0.2)}
                      {actionDialog.request.platformFeePercentage !== undefined && actionDialog.request.platformFeePercentage !== null && ` (${actionDialog.request.platformFeePercentage}%)`}
                    </p>
                  </div>
                  <div className="border-t pt-2">
                    <p><strong>Ngân hàng:</strong> {actionDialog.request.bankName || '-'}</p>
                    <p><strong>Số tài khoản:</strong> {actionDialog.request.bankAccountNumber || '-'}</p>
                    <p><strong>Tên tài khoản:</strong> {actionDialog.request.bankAccountName || '-'}</p>
                  </div>
                  <p><strong>Loại yêu cầu:</strong> {actionDialog.request.requestType === 1 ? 'Thủ công' : actionDialog.request.requestType === 2 ? 'Tự động hàng tháng' : '-'}</p>
                  <p><strong>Ngày tạo:</strong> {formatDate(actionDialog.request.createdAt)}</p>
                  {actionDialog.request.adminNotes && (
                    <p><strong>Ghi chú admin:</strong> {actionDialog.request.adminNotes}</p>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {actionDialog.type !== 'view' && (
            <div className="space-y-4">
              {actionDialog.type === 'approve' && (
                <>
                  {!actionDialog.request?.bankName && (
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Yêu cầu này chưa có thông tin ngân hàng. Vui lòng nhập thông tin bên dưới.
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Tên ngân hàng *</label>
                        <Input
                          placeholder="VD: Vietcombank, ACB, Techcombank..."
                          value={bankInfo.bankName}
                          onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Số tài khoản *</label>
                        <Input
                          placeholder="Nhập số tài khoản ngân hàng"
                          value={bankInfo.bankAccountNumber}
                          onChange={(e) => setBankInfo({...bankInfo, bankAccountNumber: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Tên chủ tài khoản *</label>
                        <Input
                          placeholder="Nhập tên chủ tài khoản"
                          value={bankInfo.bankAccountName}
                          onChange={(e) => setBankInfo({...bankInfo, bankAccountName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                    <Textarea
                      placeholder="Nhập ghi chú cho yêu cầu này..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>
                </>
              )}
              {actionDialog.type === 'reject' && (
                <div>
                  <label className="text-sm font-medium">Lý do từ chối *</label>
                  <Textarea
                    placeholder="Nhập lý do từ chối yêu cầu..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    required
                  />
                </div>
              )}
              {actionDialog.type === 'complete' && (
                <div>
                  <label className="text-sm font-medium">Mã giao dịch chuyển khoản</label>
                  <Input
                    placeholder="Nhập mã giao dịch..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {actionDialog.type === 'view' && (
              <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, request: null })}>
                Đóng
              </Button>
            )}
            {actionDialog.type === 'approve' && (
              <>
                <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, request: null })}>
                  Hủy
                </Button>
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                  Duyệt yêu cầu
                </Button>
              </>
            )}
            {actionDialog.type === 'reject' && (
              <>
                <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, request: null })}>
                  Hủy
                </Button>
                <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                  Từ chối yêu cầu
                </Button>
              </>
            )}
            {actionDialog.type === 'complete' && (
              <>
                <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null, request: null })}>
                  Hủy
                </Button>
                <Button onClick={handleComplete} className="bg-blue-600 hover:bg-blue-700">
                  Đánh dấu hoàn thành
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
