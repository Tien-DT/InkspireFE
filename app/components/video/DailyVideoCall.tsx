import { useEffect, useRef, useState } from 'react'
import DailyIframe from '@daily-co/daily-js'
import { X, Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react'

interface DailyVideoCallProps {
  roomUrl: string
  onLeave: () => void
  userName: string
  isVideoCall?: boolean
}

export function DailyVideoCall({ roomUrl, onLeave, userName, isVideoCall = true }: DailyVideoCallProps) {
  const callFrameRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(!isVideoCall)
  const [isJoining, setIsJoining] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !roomUrl) {
      console.error('[Daily] Missing room URL or container')
      return
    }

    // Prevent duplicate creation
    if (isInitializedRef.current || callFrameRef.current) {
      console.log('[Daily] Already initialized, skipping...')
      return
    }

    isInitializedRef.current = true
    console.log('[Daily] Creating call frame for room:', roomUrl)

    // Create Daily call frame
    const callFrame = DailyIframe.createFrame(containerRef.current, {
      showLeaveButton: false,
      showFullscreenButton: true,
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '8px'
      }
    })

    callFrameRef.current = callFrame

    // Join room
    callFrame
      .join({
        url: roomUrl,
        userName: userName,
        // For audio-only calls, start with video off
        startVideoOff: !isVideoCall
      })
      .then(() => {
        console.log('[Daily] Successfully joined room')
        setIsJoining(false)
      })
      .catch((err: any) => {
        console.error('[Daily] Failed to join room:', err)
        setError('Không thể kết nối cuộc gọi')
        setIsJoining(false)
      })

    // Event listeners
    callFrame.on('joined-meeting', () => {
      console.log('[Daily] Joined meeting')
      setIsJoining(false)
    })

    callFrame.on('left-meeting', () => {
      console.log('[Daily] Left meeting')
      onLeave()
    })

    callFrame.on('error', (error: any) => {
      console.error('[Daily] Error:', error)
      setError('Đã xảy ra lỗi trong cuộc gọi')
    })

    callFrame.on('participant-joined', (event: any) => {
      console.log('[Daily] Participant joined:', event.participant.user_name)
    })

    callFrame.on('participant-left', (event: any) => {
      console.log('[Daily] Participant left:', event.participant.user_name)
    })

    // Cleanup
    return () => {
      console.log('[Daily] Cleaning up call frame')
      isInitializedRef.current = false
      if (callFrame) {
        try {
          callFrame.destroy()
        } catch (e) {
          console.error('[Daily] Error destroying frame:', e)
        }
      }
    }
  }, [roomUrl, userName, isVideoCall])

  const toggleMute = () => {
    if (!callFrameRef.current) return
    callFrameRef.current.setLocalAudio(!isMuted)
    setIsMuted(!isMuted)
    console.log('[Daily] Mute toggled:', !isMuted)
  }

  const toggleVideo = () => {
    if (!callFrameRef.current) return
    callFrameRef.current.setLocalVideo(!isVideoOff)
    setIsVideoOff(!isVideoOff)
    console.log('[Daily] Video toggled:', !isVideoOff)
  }

  const endCall = () => {
    console.log('[Daily] Ending call')
    if (callFrameRef.current) {
      callFrameRef.current.leave()
    }
    onLeave()
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={onLeave}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Joining Overlay */}
      {isJoining && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Đang kết nối...</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      {!isJoining && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-600' : 'bg-gray-700'
            } hover:bg-opacity-80 transition shadow-lg`}
            title={isMuted ? 'Bật micro' : 'Tắt micro'}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          {isVideoCall && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-600' : 'bg-gray-700'
              } hover:bg-opacity-80 transition shadow-lg`}
              title={isVideoOff ? 'Bật camera' : 'Tắt camera'}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
          )}

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition shadow-lg"
            title="Kết thúc cuộc gọi"
          >
            <Phone className="w-6 h-6 text-white transform rotate-135" />
          </button>
        </div>
      )}
    </div>
  )
}
