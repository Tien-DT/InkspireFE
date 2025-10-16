import { CreditCard, Wallet, ArrowRight, TrendingUp, History, AlertCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Spinner } from '~/components/ui/spinner'
import { useAuth } from '~/contexts/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useWallet } from '~/hooks/useWallet'

export default function Payment() {
  const navigate = useNavigate()
  const { profile, isAuthenticated } = useAuth()
  const { data: wallet, isLoading: walletLoading } = useWallet(profile?.id, isAuthenticated)
  const [amount, setAmount] = useState<number>(0)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  // Get wallet data from API
  const totalBalance = wallet?.balance || 0 // Tổng số dư trong ví
  const balanceFreeze = wallet?.balanceFreeze || 0 // Số đang giữ (escrow)
  const availableBalance = totalBalance - balanceFreeze // Số dư khả dụng = tổng - đang giữ

  // Quick amount options
  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

  const handleQuickAmount = (value: number) => {
    setAmount(value)
  }

  const handleTopUp = () => {
    if (amount <= 0) {
      setShowErrorDialog(true)
      return
    }

    // Navigate to banking-qr with amount
    navigate(`/banking-qr?amount=${amount}&orderInfo=Nạp tiền vào ví InkPay`)
  }

  return (
    <>
      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                <AlertCircle className='h-10 w-10 text-orange-600' />
              </div>
              <DialogTitle className='text-2xl font-bold text-gray-900 mb-2'>Số tiền không hợp lệ</DialogTitle>
              <DialogDescription className='text-gray-600'>
                Vui lòng nhập số tiền nạp hợp lệ (tối thiểu 10.000đ)
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className='sm:justify-center'>
            <Button
              onClick={() => setShowErrorDialog(false)}
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background mt-20'>
        <div className='mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Nạp tiền vào ví</h1>
            <p className='text-gray-600'>Nạp tiền vào ví InkPay để thực hiện giao dịch dễ dàng hơn</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-5 gap-15'>
            {/* Left Section - Top Up Form */}
            <div className='lg:col-span-3 space-y-6'>
              {/* Current Balance Card */}
              <Card className='bg-gradient-to-br from-blue-600 to-blue-700 border-none shadow-xl'>
                <CardContent className='p-8'>
                  {walletLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <Spinner size='lg' variant='blast' />
                    </div>
                  ) : (
                    <>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-blue-100 text-sm mb-2'>Số dư khả dụng</p>
                          <h2 className='text-4xl font-bold text-white'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              availableBalance
                            )}
                          </h2>
                        </div>
                        <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center'>
                          <Wallet className='h-8 w-8 text-white' />
                        </div>
                      </div>
                      <div className='mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-white/20'>
                        <div>
                          <p className='text-blue-200 text-xs mb-1'>Tổng số dư</p>
                          <p className='text-white font-semibold'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              totalBalance
                            )}
                          </p>
                        </div>
                        <div>
                          <p className='text-blue-200 text-xs mb-1'>Đang giữ</p>
                          <p className='text-white font-semibold'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                              balanceFreeze
                            )}
                          </p>
                        </div>
                      </div>
                      <div className='mt-4 flex items-center text-blue-100 text-sm'>
                        <TrendingUp className='h-4 w-4 mr-2' />
                        <span>Tài khoản: {profile?.email || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Top Up Amount */}
              <Card>
                <CardContent className='p-8'>
                  <h3 className='text-xl font-bold text-gray-900 mb-6'>Nhập số tiền nạp</h3>

                  <div className='mb-6'>
                    <Label htmlFor='amount' className='text-sm font-semibold text-gray-700 mb-2'>
                      Số tiền (VNĐ) <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative mt-2'>
                      <Input
                        id='amount'
                        type='number'
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder='Nhập số tiền cần nạp'
                        className='h-14 text-lg pr-16 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      />
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium'>VNĐ</span>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <Label className='text-sm font-semibold text-gray-700 mb-3 block'>Chọn nhanh</Label>
                    <div className='grid grid-cols-3 gap-3'>
                      {quickAmounts.map((value) => (
                        <Button
                          key={value}
                          variant='outline'
                          onClick={() => handleQuickAmount(value)}
                          className={`h-12 font-semibold transition-all ${
                            amount === value
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {(value / 1000).toLocaleString('vi-VN')}K
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleTopUp}
                    className='w-full h-14 mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold shadow-lg'
                  >
                    <CreditCard className='h-5 w-5 mr-2' />
                    Nạp tiền ngay
                    <ArrowRight className='h-5 w-5 ml-2' />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Section - Info & History */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Payment Methods Info */}
              <Card>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-bold text-gray-900 mb-4'>Phương thức nạp tiền</h3>
                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <CreditCard className='h-5 w-5 text-green-600' />
                      </div>
                      <div>
                        <p className='font-semibold text-gray-900'>Chuyển khoản ngân hàng</p>
                        <p className='text-sm text-gray-600'>Qua mã QR - Nhanh chóng & An toàn</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-bold text-gray-900'>Lịch sử giao dịch</h3>
                    <Button variant='ghost' size='sm'>
                      <History className='h-4 w-4 mr-1' />
                      Xem tất cả
                    </Button>
                  </div>
                  <div className='text-center py-8 text-gray-500'>
                    <p className='text-sm'>Chưa có giao dịch nào</p>
                  </div>
                </CardContent>
              </Card>

              {/* Note Card */}
              <Card className='border-orange-200 bg-orange-50'>
                <CardContent className='p-6'>
                  <h4 className='font-semibold text-orange-900 mb-3'>Lưu ý quan trọng</h4>
                  <ul className='space-y-2 text-sm text-orange-800'>
                    <li>• Số tiền tối thiểu: 10.000đ</li>
                    <li>• Thời gian xử lý: 1-5 phút</li>
                    <li>• Kiểm tra kỹ nội dung chuyển khoản</li>
                    <li>• Liên hệ hỗ trợ nếu quá 15 phút</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
