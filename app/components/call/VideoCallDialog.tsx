import { useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { useVideoCall } from '~/contexts/VideoCallContext'
import { CallStatus } from '~/types/call.type'
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react'

export function VideoCallDialog() {
  const {
    callState,
    endCall,
    toggleAudio,
    toggleVideo,
    isInCall
  } = useVideoCall()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && callState.localStream) {
      console.log('[VideoCallDialog] Attaching local stream:', {
        tracks: callState.localStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState }))
      })
      localVideoRef.current.srcObject = callState.localStream
    }
  }, [callState.localStream])

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && callState.remoteStream) {
      console.log('[VideoCallDialog] Attaching remote stream:', {
        tracks: callState.remoteStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState }))
      })
      remoteVideoRef.current.srcObject = callState.remoteStream
    } else {
      console.log('[VideoCallDialog] No remote stream:', {
        hasRef: !!remoteVideoRef.current,
        hasStream: !!callState.remoteStream
      })
    }
  }, [callState.remoteStream])

  // Calculate call duration
  const getDuration = () => {
    if (!callState.startTime) return '00:00'
    const now = Date.now()
    const diff = Math.floor((now - callState.startTime) / 1000)
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const isVideoCall = callState.callType === 'video'
  const otherParticipant = callState.caller?.isCaller ? callState.receiver : callState.caller

  return (
    <Dialog open={isInCall} onOpenChange={() => endCall()}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-gray-900 border-gray-800">
        <DialogTitle className="sr-only">
          {isVideoCall ? 'Cuộc gọi video' : 'Cuộc gọi thoại'} với {otherParticipant?.userName || 'Unknown'}
        </DialogTitle>
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/70 to-transparent">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-semibold">
                  {otherParticipant?.userName || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-300">
                  {callState.status === CallStatus.Connecting && 'Đang kết nối...'}
                  {callState.status === CallStatus.Ringing && 'Đang gọi...'}
                  {callState.status === CallStatus.Connected && getDuration()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isVideoCall ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <Phone className="w-5 h-5" />
                )}
                <span className="text-sm uppercase tracking-wider">
                  {isVideoCall ? 'Video Call' : 'Voice Call'}
                </span>
              </div>
            </div>
          </div>

          {/* Video Streams */}
          <div className="relative flex-1">
            {/* Remote Video (Main) */}
            {isVideoCall ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover bg-gray-800"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-6xl font-bold">
                      {otherParticipant?.userName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-semibold">{otherParticipant?.userName}</h3>
                </div>
              </div>
            )}

            {/* Local Video (PiP) */}
            {isVideoCall && (
              <div className="absolute top-20 right-6 w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover bg-gray-700 mirror"
                />
                {callState.isVideoMuted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <VideoOff className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            )}

            {/* Connection Status Overlay */}
            {(callState.status === CallStatus.Connecting || callState.status === CallStatus.Ringing) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <p className="text-xl">
                    {callState.status === CallStatus.Ringing ? 'Đang gọi...' : 'Đang kết nối...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center justify-center space-x-4">
              {/* Mute Audio */}
              <Button
                size="lg"
                variant={callState.isAudioMuted ? 'destructive' : 'secondary'}
                className="w-14 h-14 rounded-full"
                onClick={toggleAudio}
              >
                {callState.isAudioMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>

              {/* Toggle Video (only for video calls) */}
              {isVideoCall && (
                <Button
                  size="lg"
                  variant={callState.isVideoMuted ? 'destructive' : 'secondary'}
                  className="w-14 h-14 rounded-full"
                  onClick={toggleVideo}
                >
                  {callState.isVideoMuted ? (
                    <VideoOff className="w-6 h-6" />
                  ) : (
                    <Video className="w-6 h-6" />
                  )}
                </Button>
              )}

              {/* End Call */}
              <Button
                size="lg"
                variant="destructive"
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
                onClick={endCall}
              >
                <PhoneOff className="w-7 h-7" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
