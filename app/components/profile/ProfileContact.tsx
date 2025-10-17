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
    <div className='p-4'>
      <h2 className='mb-3 text-sm font-semibold text-foreground uppercase tracking-wide'>Thông tin liên hệ</h2>
      <div className='space-y-3 text-sm text-muted-foreground'>
        {contactItems(location, email, phone).map(({ icon: Icon, label, value }) => (
          <div key={label} className='flex items-start gap-3'>
            <span className='flex h-8 w-8 items-center justify-center text-muted-foreground/60'>
              <Icon className='h-4 w-4' />
            </span>
            <div className='min-w-0 flex-1'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground/60'>{label}</p>
              <p className='truncate text-sm text-foreground'>{value || 'Đang cập nhật'}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-4 space-y-2'>
        <Button className='w-full' variant='shine' size='sm' onClick={onSendMessage} disabled={isSendingMessage}>
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
        <Button className='w-full' variant='outline' size='sm' onClick={onViewFullProfile}>
          Xem hồ sơ đầy đủ
        </Button>
      </div>
    </div>
  )
}
