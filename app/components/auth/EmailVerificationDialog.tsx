import { useState } from 'react'
import { Mail, AlertCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '~/components/ui/dialog'
import { toast } from 'sonner'
import { ButtonSpinner } from '~/components/ui/button-spinner'

interface EmailVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export function EmailVerificationDialog({ open, onOpenChange, email }: EmailVerificationDialogProps) {
  const [isSending, setIsSending] = useState(false)

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Không tìm thấy email')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Email xác thực đã được gửi!', {
          description: 'Vui lòng kiểm tra hộp thư của bạn.'
        })
      } else if (response.status === 429) {
        toast.error('Vui lòng đợi một chút', {
          description: data.message || 'Email xác thực vừa mới được gửi.'
        })
      } else {
        toast.error(data.message || 'Không thể gửi email. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-3 mb-2'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-amber-100'>
              <AlertCircle className='h-6 w-6 text-amber-600' />
            </div>
            <DialogTitle className='text-xl'>Email chưa được xác thực</DialogTitle>
          </div>
          <DialogDescription className='text-base'>
            Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email{' '}
            <span className='font-semibold text-foreground'>{email}</span> và nhấn vào link xác thực.
          </DialogDescription>
        </DialogHeader>

        <div className='rounded-lg bg-muted/50 p-4'>
          <p className='text-sm text-muted-foreground mb-2'>
            <strong className='text-foreground'>Không nhận được email?</strong>
          </p>
          <ul className='list-disc list-inside text-sm text-muted-foreground space-y-1'>
            <li>Kiểm tra thư mục Spam/Junk</li>
            <li>Đợi vài phút để email được gửi đến</li>
            <li>Hoặc gửi lại email xác thực bên dưới</li>
          </ul>
        </div>

        <DialogFooter className='flex-col sm:flex-row gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto'
          >
            Đóng
          </Button>
          <Button
            type='button'
            onClick={handleResendEmail}
            disabled={isSending}
            className='w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600'
          >
            {isSending ? (
              <>
                <ButtonSpinner className='mr-2' />
                Đang gửi...
              </>
            ) : (
              <>
                <Mail className='mr-2 h-4 w-4' />
                Gửi lại email xác thực
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
