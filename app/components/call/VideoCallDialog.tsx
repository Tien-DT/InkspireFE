import { useEffect, useRef, useState } from 'react'
import { useVideoCall } from '~/contexts/VideoCallContext'
import { CallStatus } from '~/types/call.type'
import { useAuth } from '~/contexts/AuthContext'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react'

export function VideoCallDialog() {
  const { callState, endCall, toggleAudio, toggleVideo } = useVideoCall()
  const { profile } = useAuth()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [duration, setDuration] = useState('00:00')

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && callState.localStream) {
      console.log('[VideoCallDialog] Attaching local stream')
      localVideoRef.current.srcObject = callState.localStream
    }
  }, [callState.localStream])

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && callState.remoteStream) {
      console.log('[VideoCallDialog] Attaching remote stream')
      remoteVideoRef.current.srcObject = callState.remoteStream
    }
  }, [callState.remoteStream])

  // Calculate call duration
  useEffect(() => {
    if (callState.status !== CallStatus.Connected || !callState.startTime) {
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.floor((now - callState.startTime!) / 1000)
      const minutes = Math.floor(diff / 60)
      const seconds = diff % 60
      setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [callState.status, callState.startTime])

  // Only show dialog when in active call
  const isActiveCall = [
    CallStatus.Initiating,
    CallStatus.Ringing,
    CallStatus.Connecting,
    CallStatus.Connected
  ].includes(callState.status)

  if (!isActiveCall) {
    return null
  }

  const isCaller = callState.caller?.userId === profile?.id
  const otherParticipant = isCaller ? callState.receiver : callState.caller

  return (
    <Dialog open={isActiveCall}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
          {/* Remote Video (Main) */}
          <div className="absolute inset-0">
            {callState.remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl mb-4">
                  {otherParticipant?.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="text-xl">{otherParticipant?.userName}</div>
                <div className="text-sm text-gray-400 mt-2">
                  {callState.status === CallStatus.Initiating && 'Initiating call...'}
                  {callState.status === CallStatus.Ringing && 'Ringing...'}
                  {callState.status === CallStatus.Connecting && 'Connecting...'}
                  {callState.status === CallStatus.Connected && 'Connected'}
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          {callState.localStream && (
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Call Info Overlay */}
          <div className="absolute top-4 left-4 bg-black/50 rounded-lg px-4 py-2 text-white">
            <div className="font-semibold">{otherParticipant?.userName}</div>
            {callState.status === CallStatus.Connected && (
              <div className="text-sm text-gray-300">{duration}</div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            {/* Toggle Audio */}
            <Button
              onClick={toggleAudio}
              variant={callState.isAudioMuted ? 'destructive' : 'secondary'}
              size="lg"
              className="rounded-full w-14 h-14"
            >
              {callState.isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            {/* Toggle Video (only for video calls) */}
            {callState.callType === 'video' && (
              <Button
                onClick={toggleVideo}
                variant={callState.isVideoMuted ? 'destructive' : 'secondary'}
                size="lg"
                className="rounded-full w-14 h-14"
              >
                {callState.isVideoMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </Button>
            )}

            {/* End Call */}
            <Button
              onClick={endCall}
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
