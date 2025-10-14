import { Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface ProfileContactProps {
  location: string
  email: string
  phone: string
  onSendMessage?: () => void
  onViewFullProfile?: () => void
  isSendingMessage?: boolean
}

const contactItems = (location: string, email: string, phone: string) => [
  { icon: MapPin, label: 'Địa điểm', value: location },
  { icon: Mail, label: 'Email', value: email },
  { icon: Phone, label: 'Số điện thoại', value: phone }
]

export function ProfileContact({
  location,
  email,
  phone,
  onSendMessage,
  onViewFullProfile,
  isSendingMessage
}: ProfileContactProps) {
  return (
    <div className='rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm transition hover:shadow-md backdrop-blur-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-foreground'>Thông tin liên hệ</h2>
        <span className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary'>
          Đã xác thực
        </span>
      </div>
      <div className='space-y-4 text-sm text-muted-foreground'>
        {contactItems(location, email, phone).map(({ icon: Icon, label, value }) => (
          <div key={label} className='flex items-start gap-3'>
            <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <Icon className='h-4 w-4' />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground/80'>{label}</p>
              <p className='truncate text-sm font-semibold text-foreground'>{value || 'Đang cập nhật'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-6 space-y-3'>
        <Button className='w-full' variant='shine' size='lg' onClick={onSendMessage} disabled={isSendingMessage}>
          {isSendingMessage ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang xử lý...
            </>
          ) : (
            <>
              <Mail className='mr-2 h-4 w-4' />
              Gửi tin nhắn
            </>
          )}
        </Button>
        <Button className='w-full' variant='outline' size='lg' onClick={onViewFullProfile}>
          Xem hồ sơ đầy đủ
        </Button>
      </div>
    </div>
  )
}
