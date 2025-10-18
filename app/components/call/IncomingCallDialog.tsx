import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { useVideoCall } from '~/contexts/VideoCallContext'
import { CallStatus } from '~/types/call.type'
import { useAuth } from '~/contexts/AuthContext'
import { Phone, PhoneOff, Video } from 'lucide-react'

export function IncomingCallDialog() {
  const { callState, acceptCall, rejectCall } = useVideoCall()
  const { profile } = useAuth()

  // Show incoming call dialog only if:
  // 1. Status is Ringing
  // 2. Current user is the RECEIVER (not the caller)
  const isReceiver = callState.receiver?.userId === profile?.id
  const isRinging = callState.status === CallStatus.Ringing && isReceiver
  const isVideoCall = callState.callType === 'video'
  const caller = callState.caller

  console.log('[IncomingCallDialog] Debug:', {
    status: callState.status,
    currentUserId: profile?.id,
    receiverId: callState.receiver?.userId,
    callerId: callState.caller?.userId,
    isReceiver,
    isRinging
  })

  if (!isRinging || !caller) return null

  return (
    <Dialog open={isRinging} onOpenChange={() => rejectCall()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl'>
            {isVideoCall ? 'Cuộc gọi video đến' : 'Cuộc gọi thoại đến'}
          </DialogTitle>
        </DialogHeader>

        <div className='py-8'>
          {/* Caller Avatar */}
          <div className='flex flex-col items-center space-y-4'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
              {caller.userName.charAt(0).toUpperCase()}
            </div>

            <div className='text-center'>
              <h3 className='text-2xl font-semibold text-gray-900'>{caller.userName}</h3>
              <p className='text-sm text-gray-500 mt-1'>
                {isVideoCall ? 'Muốn gọi video với bạn...' : 'Đang gọi cho bạn...'}
              </p>
            </div>

            {/* Ringing Animation */}
            <div className='relative'>
              <div className='w-16 h-16 rounded-full bg-teal-500/20 animate-ping absolute' />
              <div className='w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center relative'>
                {isVideoCall ? (
                  <Video className='w-8 h-8 text-white' />
                ) : (
                  <Phone className='w-8 h-8 text-white animate-bounce' />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-center space-x-4 pb-4'>
          {/* Reject */}
          <Button
            size='lg'
            variant='destructive'
            className='w-16 h-16 rounded-full bg-red-500 hover:bg-red-600'
            onClick={() => rejectCall('Từ chối')}
          >
            <PhoneOff className='w-7 h-7' />
          </Button>

          {/* Accept */}
          <Button size='lg' className='w-16 h-16 rounded-full bg-green-500 hover:bg-green-600' onClick={acceptCall}>
            <Phone className='w-7 h-7 text-white' />
          </Button>
        </div>

        <p className='text-center text-xs text-gray-400'>Nhấn nút xanh để trả lời hoặc nút đỏ để từ chối</p>
      </DialogContent>
    </Dialog>
  )
}
