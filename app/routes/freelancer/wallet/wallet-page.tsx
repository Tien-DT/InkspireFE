import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { WithdrawRequestForm } from '~/components/freelancer/withdraw-request-form'
import { PaymentMethods } from '~/components/freelancer/payment-methods'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Wallet, Clock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { withdrawApi } from '~/apis/withdraw.api'
import { walletApi } from '~/apis/wallet.api'
import { getProfileFromLS } from '~/utils/auth'
import { UserRole } from '~/types/user.type'

interface WalletData {
  id: string
  userId: string
  balance: number
  balanceFreeze: number
  currency: string
  status: number
}

interface WithdrawRequest {
  id: string
  amount: number
  bankName?: string
  bankAccountNumber?: string
  requestType: number
  status: number
  createdAt: string
  approvedAt?: string
  completedAt?: string
  adminNotes?: string
}

export default function WalletPage() {
  const queryClient = useQueryClient()
  const profile = getProfileFromLS()
  const userId = profile?.id || ''
  // Role 1 = CLIENT: có rút tiền
  // Role 2 = FREELANCER: chỉ có phương thức thanh toán
  const isClient = profile?.role === UserRole.CLIENT
  const isFreelancer = profile?.role === UserRole.FREELANCER

  // Fetch wallet with React Query
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: async () => {
      const response = await walletApi.getWalletByUserId(userId)
      return response.data
    },
    enabled: !!userId
  })

  const wallet = walletData as WalletData | null

  // Fetch withdraw requests (only for CLIENT - role 1)
  const { data: withdrawRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['withdraw-requests', userId],
    queryFn: () => withdrawApi.getWithdrawRequests(userId),
    enabled: !!userId && isClient
  })

  const loading = walletLoading || requestsLoading

  const handleWithdrawSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['wallet'] })
    queryClient.invalidateQueries({ queryKey: ['withdraw-requests'] })
  }

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN')
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
        return <Badge variant="default">Tự động</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 md:p-8 lg:p-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-12">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-sky-700">Ví của tôi</h1>
          <p className="text-sm text-slate-600">Quản lý số dư và yêu cầu rút tiền</p>
        </div>

        {wallet && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Số dư đóng băng</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(wallet.balanceFreeze, wallet.currency)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số dư</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(wallet.balance + wallet.balanceFreeze, wallet.currency)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue={isFreelancer ? "payment-methods" : "withdraw"} className="w-full">
          <TabsList className={isFreelancer ? "w-full" : "grid w-full grid-cols-3"}>
            {isClient && <TabsTrigger value="withdraw">Rút tiền</TabsTrigger>}
            <TabsTrigger value="payment-methods">Phương thức thanh toán</TabsTrigger>
            {isClient && <TabsTrigger value="history">Lịch sử</TabsTrigger>}
          </TabsList>
          
          {isClient && (
          <TabsContent value="withdraw" className="grid gap-8 lg:grid-cols-2">
            {wallet && (
              <WithdrawRequestForm 
                userId={userId}
                walletBalance={wallet.balance}
                currency={wallet.currency}
                onSuccess={handleWithdrawSuccess}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Lịch sử yêu cầu rút tiền</CardTitle>
                <CardDescription>Các yêu cầu rút tiền gần đây của bạn</CardDescription>
              </CardHeader>
            <CardContent>
              {withdrawRequests.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có yêu cầu rút tiền nào</p>
              ) : (
                <div className="space-y-4">
                  {withdrawRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatCurrency(request.amount, wallet?.currency)}
                          </span>
                          {getRequestTypeBadge(request.requestType)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </div>
                        {request.bankName && (
                          <div className="text-xs text-gray-400">
                            {request.bankName} - {request.bankAccountNumber}
                          </div>
                        )}
                        {request.adminNotes && request.status === 2 && (
                          <div className="text-xs text-red-600">
                            Lý do: {request.adminNotes}
                          </div>
                        )}
                      </div>
                      <div>{getStatusBadge(request.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </TabsContent>
          )}
          
          <TabsContent value="payment-methods">
            <PaymentMethods />
          </TabsContent>
          
          {isClient && (
          <TabsContent value="history">
            {withdrawRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Chưa có yêu cầu rút tiền nào</p>
                </CardContent>
              </Card>
            ) : (
          <Card>
            <CardHeader>
              <CardTitle>Tất cả yêu cầu rút tiền</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Ngân hàng</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(request.amount, wallet?.currency)}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
            )}
          </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
