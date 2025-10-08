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

export function ProfileContact({
  location,
  email,
  phone,
  onSendMessage,
  onViewFullProfile,
  isSendingMessage
}: ProfileContactProps) {
  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin liên hệ</h2>
      <div className='space-y-3'>
        <div className='flex items-start gap-3'>
          <MapPin className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
          <div>
            <p className='text-sm text-gray-500'>Địa điểm</p>
            <p className='text-gray-900 font-medium'>{location}</p>
          </div>
        </div>
        <div className='flex items-start gap-3'>
          <Mail className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
          <div>
            <p className='text-sm text-gray-500'>Email</p>
            <p className='text-gray-900 font-medium'>{email}</p>
          </div>
        </div>
        <div className='flex items-start gap-3'>
          <Phone className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
          <div>
            <p className='text-sm text-gray-500'>Số điện thoại</p>
            <p className='text-gray-900 font-medium'>{phone}</p>
          </div>
        </div>
      </div>
      <Button className='w-full btn-submit mt-6' onClick={onSendMessage} disabled={isSendingMessage}>
        {isSendingMessage ? (
          <>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            Đang xử lý...
          </>
        ) : (
          <>
            <Mail className='h-4 w-4 mr-2' />
            Gửi tin nhắn
          </>
        )}
      </Button>
      <Button className='w-full btn-cancel' onClick={onViewFullProfile}>
        Xem hồ sơ đầy đủ
      </Button>
    </div>
  )
}
