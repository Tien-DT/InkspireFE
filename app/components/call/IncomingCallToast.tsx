import { Button } from '~/components/ui/button'
import { useVideoCall } from '~/contexts/VideoCallContext'
import { CallStatus } from '~/types/call.type'
import { useAuth } from '~/contexts/AuthContext'
import { Phone, PhoneOff, Video, X } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { useEffect, useRef } from 'react'

export function IncomingCallToast() {
  const { callState, acceptCall, rejectCall } = useVideoCall()
  const { profile } = useAuth()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Show incoming call notification only if:
  // 1. Status is Ringing
  // 2. Current user is the RECEIVER (not the caller)
  const isReceiver = callState.receiver?.userId === profile?.id
  const isRinging = callState.status === CallStatus.Ringing && isReceiver
  const isVideoCall = callState.callType === 'video'
  const caller = callState.caller

  // Play ringtone when call is ringing
  useEffect(() => {
    if (isRinging) {
      // Create audio element for ringtone
      const audio = new Audio('/ringtone.mp3')
      audio.loop = true
      audio.volume = 0.5
      audioRef.current = audio

      // Play ringtone
      audio.play().catch((error) => {
        console.warn('[IncomingCallToast] Failed to play ringtone:', error)
        // Fallback: system notification sound
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Cuộc gọi đến', {
            body: `${caller?.userName} đang gọi cho bạn`,
            icon: '/favicon.ico',
            tag: 'incoming-call',
            requireInteraction: true
          })
        }
      })

      return () => {
        // Stop ringtone when component unmounts or call ends
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          audioRef.current = null
        }
      }
    }
  }, [isRinging, caller])

  if (!isRinging || !caller) return null

  // Stop ringtone helper
  const stopRingtone = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // Handle accept with ringtone stop
  const handleAccept = () => {
    stopRingtone()
    acceptCall()
  }

  // Handle reject with ringtone stop
  const handleReject = (reason?: string) => {
    stopRingtone()
    rejectCall(reason)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 duration-300">
      <Card className="w-80 bg-white shadow-2xl border-2 border-teal-500 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isVideoCall ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <Phone className="w-5 h-5 text-white animate-pulse" />
            )}
            <span className="text-white font-semibold text-sm">
              {isVideoCall ? 'Cuộc gọi video đến' : 'Cuộc gọi thoại đến'}
            </span>
          </div>
          <button
            onClick={() => handleReject('Đóng thông báo')}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            {/* Caller Avatar */}
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {caller.userName.charAt(0).toUpperCase()}
              </div>
              {/* Pulse effect */}
              <div className="absolute inset-0 w-14 h-14 rounded-full bg-teal-500/30 animate-ping" />
            </div>

            {/* Caller Info */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg">{caller.userName}</h4>
              <p className="text-sm text-gray-600">
                {isVideoCall ? 'Muốn gọi video với bạn' : 'Đang gọi cho bạn'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Reject Button */}
            <Button
              variant="destructive"
              size="lg"
              className="flex-1 bg-red-500 hover:bg-red-600 gap-2"
              onClick={() => handleReject('Từ chối')}
            >
              <PhoneOff className="w-5 h-5" />
              Từ chối
            </Button>

            {/* Accept Button */}
            <Button
              size="lg"
              className="flex-1 bg-green-500 hover:bg-green-600 gap-2"
              onClick={handleAccept}
            >
              <Phone className="w-5 h-5" />
              Trả lời
            </Button>
          </div>
        </div>

        {/* Animated border effect */}
        <div className="h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-teal-500 animate-pulse" />
      </Card>
    </div>
  )
}
