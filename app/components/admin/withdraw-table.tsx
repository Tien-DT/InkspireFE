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
import { Check, X, Eye, DollarSign, RefreshCw } from 'lucide-react'
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
  }
  walletId: string
  amount: number
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
  const [triggeringMonthly, setTriggeringMonthly] = useState(false)

  useEffect(() => {
    fetchWithdrawRequests()
  }, [])

  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/WithdrawRequests?$expand=user,wallet&$orderby=createdAt desc`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        console.log('Withdraw requests data:', data)
        // Check if data is wrapped in 'value' property (OData response) or is direct array
        const requests = Array.isArray(data) ? data : (data.value || [])
        setWithdrawRequests(requests)
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
          body: JSON.stringify({ adminNotes })
        }
      )
      
      if (response.ok) {
        toast.success('Đã duyệt yêu cầu rút tiền')
        fetchWithdrawRequests()
        setActionDialog({ open: false, type: null, request: null })
        setAdminNotes('')
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
        fetchWithdrawRequests()
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
        fetchWithdrawRequests()
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
        toast.success(
          `Đã tạo ${result.created} lệnh rút tiền mới${result.skipped > 0 ? `, bỏ qua ${result.skipped} tài khoản đã có lệnh` : ''}`
        )
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
    return new Date(date).toLocaleString('vi-VN')
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách yêu cầu rút tiền</CardTitle>
              <CardDescription>
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
        <CardContent>
          <Table>
            <TableCaption>Danh sách yêu cầu rút tiền gần đây</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {request.user?.firstName} {request.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{request.user?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(request.amount)}</TableCell>
                  <TableCell>
                    {request.bankName && (
                      <div className="text-sm">
                        <div>{request.bankName}</div>
                        <div className="text-gray-500">{request.bankAccountNumber}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getRequestTypeBadge(request.requestType)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActionDialog({ open: true, type: 'view', request })}
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
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setActionDialog({ open: true, type: 'reject', request })}
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
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={actionDialog.open} onOpenChange={(open) => {
        if (!open) {
          setActionDialog({ open: false, type: null, request: null })
          setAdminNotes('')
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
                  <p><strong>Người dùng:</strong> {actionDialog.request.user?.firstName} {actionDialog.request.user?.lastName}</p>
                  <p><strong>Email:</strong> {actionDialog.request.user?.email}</p>
                  <p><strong>Số tiền:</strong> {formatCurrency(actionDialog.request.amount)}</p>
                  {actionDialog.request.bankName && (
                    <>
                      <p><strong>Ngân hàng:</strong> {actionDialog.request.bankName}</p>
                      <p><strong>Số tài khoản:</strong> {actionDialog.request.bankAccountNumber}</p>
                      <p><strong>Tên tài khoản:</strong> {actionDialog.request.bankAccountName}</p>
                    </>
                  )}
                  <p><strong>Loại yêu cầu:</strong> {actionDialog.request.requestType === 1 ? 'Thủ công' : 'Tự động hàng tháng'}</p>
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
                <div>
                  <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                  <Textarea
                    placeholder="Nhập ghi chú cho yêu cầu này..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
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
