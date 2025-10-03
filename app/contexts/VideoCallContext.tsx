import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type ReactNode
} from 'react'
import { toast } from 'sonner'
import type {
  CallState,
  CallType,
  CallStatus,
  CallParticipant,
  CallOffer,
  CallAnswer,
  CallIceCandidate
} from '~/types/call.type'
import { CallStatus as CallStatusEnum } from '~/types/call.type'
import { signalRChatService } from '~/lib/signalr'
import { useAuth } from './AuthContext'

// ===== WebRTC Configuration =====
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
}

// ===== Context Interface =====
interface VideoCallContextInterface {
  callState: CallState
  initiateCall: (conversationId: string, receiverUserId: string, receiverName: string, callType: CallType) => Promise<void>
  acceptCall: () => Promise<void>
  rejectCall: (reason?: string) => void
  endCall: () => void
  toggleAudio: () => void
  toggleVideo: () => void
  isInCall: boolean
}

const VideoCallContext = createContext<VideoCallContextInterface | undefined>(undefined)

export const useVideoCall = () => {
  const ctx = useContext(VideoCallContext)
  if (!ctx) throw new Error('useVideoCall must be used within VideoCallProvider')
  return ctx
}

// ===== Provider =====
interface VideoCallProviderProps {
  children: ReactNode
}

export const VideoCallProvider = ({ children }: VideoCallProviderProps) => {
  const { profile } = useAuth()
  
  // State
  const [callState, setCallState] = useState<CallState>({
    callId: null,
    conversationId: null,
    callType: null,
    status: CallStatusEnum.Idle,
    caller: null,
    receiver: null,
    localStream: null,
    remoteStream: null,
    startTime: null,
    endTime: null,
    isAudioMuted: false,
    isVideoMuted: false
  })

  // Refs
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)

  // ===== WebRTC Setup =====
  
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS)

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && callState.callId) {
        // Determine target user (the other participant)
        // If I'm the caller, send to receiver; if I'm receiver, send to caller
        const iAmCaller = callState.caller?.userId === profile?.id
        const targetUserId = iAmCaller 
          ? callState.receiver?.userId 
          : callState.caller?.userId
        
        console.log('[WebRTC] ICE candidate generated:', {
          callId: callState.callId,
          iAmCaller,
          myId: profile?.id,
          targetUserId,
          candidateType: event.candidate.type
        })
        
        if (targetUserId) {
          signalRChatService.sendCallIceCandidate({
            callId: callState.callId,
            targetUserId,
            candidate: event.candidate.toJSON()
          })
        } else {
          console.error('[WebRTC] Cannot send ICE candidate - no target user!')
        }
      }
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('[WebRTC] ===== RECEIVED REMOTE TRACK =====')
      console.log('[WebRTC] Track kind:', event.track.kind)
      console.log('[WebRTC] Track id:', event.track.id)
      console.log('[WebRTC] Track enabled:', event.track.enabled)
      console.log('[WebRTC] Track readyState:', event.track.readyState)
      console.log('[WebRTC] Streams count:', event.streams?.length)
      
      if (event.streams && event.streams[0]) {
        console.log('[WebRTC] Stream id:', event.streams[0].id)
        console.log('[WebRTC] Stream tracks:', event.streams[0].getTracks().map(t => ({ kind: t.kind, id: t.id })))
        
        remoteStreamRef.current = event.streams[0]
        setCallState(prev => ({
          ...prev,
          remoteStream: event.streams[0]
        }))
        console.log('[WebRTC] ===== REMOTE STREAM SET =====')
      } else {
        console.error('[WebRTC] No streams in track event!')
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] ===== CONNECTION STATE CHANGED =====')
      console.log('[WebRTC] Connection state:', pc.connectionState)
      console.log('[WebRTC] ICE connection state:', pc.iceConnectionState)
      console.log('[WebRTC] ICE gathering state:', pc.iceGatheringState)
      console.log('[WebRTC] Signaling state:', pc.signalingState)
      
      if (pc.connectionState === 'connected') {
        console.log('[WebRTC] ===== CONNECTION ESTABLISHED =====')
        setCallState(prev => ({
          ...prev,
          status: CallStatusEnum.Connected,
          startTime: Date.now()
        }))
      } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.error('[WebRTC] ===== CONNECTION FAILED/DISCONNECTED =====')
        endCall()
      }
    }

    peerConnection.current = pc
    return pc
  }, [callState.callId, callState.caller?.userId, callState.receiver?.userId, profile?.id])

  const getLocalStream = useCallback(async (callType: CallType): Promise<MediaStream> => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream
      
      setCallState(prev => ({
        ...prev,
        localStream: stream
      }))

      return stream
    } catch (error) {
      console.error('[WebRTC] Failed to get local stream:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Không thể truy cập camera/microphone', {
        description: 'Vui lòng kiểm tra quyền truy cập của trình duyệt và đảm bảo thiết bị được kết nối.'
      })
      throw new Error('Không thể truy cập camera/microphone: ' + errorMessage)
    }
  }, [])

  const cleanupStreams = useCallback(() => {
    // Stop all tracks in local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }

    // Clear remote stream
    remoteStreamRef.current = null

    setCallState(prev => ({
      ...prev,
      localStream: null,
      remoteStream: null
    }))
  }, [])

  // ===== Call Actions =====

  const initiateCall = useCallback(async (
    conversationId: string,
    receiverUserId: string,
    receiverName: string,
    callType: CallType
  ) => {
    console.log('[VideoCallContext] initiateCall called:', { conversationId, receiverUserId, receiverName, callType })
    try {
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('[VideoCallContext] Generated callId:', callId)
      
      setCallState(prev => ({
        ...prev,
        callId,
        conversationId,
        callType,
        status: CallStatusEnum.Initiating,
        caller: {
          userId: profile?.id || '',
          userName: `${profile?.first_name} ${profile?.last_name}`,
          isCaller: true
        },
        receiver: {
          userId: receiverUserId,
          userName: receiverName,
          isCaller: false
        }
      }))

      // Get local stream
      const stream = await getLocalStream(callType)

      // Create peer connection
      const pc = createPeerConnection()

      // Add local tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })

      // Create offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // Send offer via SignalR
      const callOffer: CallOffer = {
        callId,
        conversationId,
        callType,
        caller: {
          userId: profile?.id || '',
          userName: `${profile?.first_name} ${profile?.last_name}`,
          isCaller: true
        },
        receiver: {
          userId: receiverUserId,
          userName: receiverName,
          isCaller: false
        },
        sdp: offer
      }

      await signalRChatService.sendCallOffer(callOffer)

      setCallState(prev => ({
        ...prev,
        status: CallStatusEnum.Ringing
      }))

      console.log('[WebRTC] Call initiated:', callId)
    } catch (error) {
      console.error('[WebRTC] Failed to initiate call:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Không thể bắt đầu cuộc gọi', {
        description: errorMessage
      })
      setCallState(prev => ({
        ...prev,
        status: CallStatusEnum.Failed
      }))
      cleanupStreams()
    }
  }, [profile, getLocalStream, createPeerConnection, cleanupStreams])

  const acceptCall = useCallback(async () => {
    try {
      if (!callState.callId || !callState.callType) {
        throw new Error('No active call to accept')
      }

      if (!peerConnection.current) {
        throw new Error('No peer connection found - call offer was not received properly')
      }

      console.log('[WebRTC] ===== ACCEPTING CALL =====')
      console.log('[WebRTC] Call ID:', callState.callId)
      console.log('[WebRTC] Call Type:', callState.callType)
      console.log('[WebRTC] Peer connection state:', peerConnection.current.signalingState)

      setCallState(prev => ({
        ...prev,
        status: CallStatusEnum.Connecting
      }))

      // Get local stream
      const stream = await getLocalStream(callState.callType)

      // Use EXISTING peer connection (created in handleCallOffer)
      const pc = peerConnection.current

      // Add local tracks to existing peer connection
      stream.getTracks().forEach(track => {
        console.log('[WebRTC] Adding local track:', track.kind)
        pc.addTrack(track, stream)
      })

      // Create answer (remote description already set in handleCallOffer)
      console.log('[WebRTC] Creating answer...')
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      console.log('[WebRTC] Local description set:', answer.type)

      // Send answer via SignalR
      const callAnswer: CallAnswer = {
        callId: callState.callId,
        callerId: callState.caller?.userId || '',  // ID of the person who initiated the call
        sdp: answer
      }

      console.log('[WebRTC] Sending answer to caller:', callState.caller?.userId)
      await signalRChatService.sendCallAnswer(callAnswer)

      console.log('[WebRTC] ===== CALL ACCEPTED SUCCESSFULLY =====')
    } catch (error) {
      console.error('[WebRTC] ===== FAILED TO ACCEPT CALL =====')
      console.error('[WebRTC] Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Không thể chấp nhận cuộc gọi', {
        description: errorMessage
      })
      setCallState(prev => ({
        ...prev,
        status: CallStatusEnum.Failed
      }))
      cleanupStreams()
    }
  }, [callState.callId, callState.callType, getLocalStream, cleanupStreams])

  const rejectCall = useCallback((reason?: string) => {
    if (!callState.callId || !callState.caller?.userId) return

    signalRChatService.sendCallRejection({
      callId: callState.callId,
      callerId: callState.caller.userId,
      reason
    })

    setCallState({
      callId: null,
      conversationId: null,
      callType: null,
      status: CallStatusEnum.Rejected,
      caller: null,
      receiver: null,
      localStream: null,
      remoteStream: null,
      startTime: null,
      endTime: Date.now(),
      isAudioMuted: false,
      isVideoMuted: false
    })

    cleanupStreams()
  }, [callState.callId, cleanupStreams])

  const endCall = useCallback(() => {
    if (!callState.callId) return

    const duration = callState.startTime ? Date.now() - callState.startTime : 0
    
    // Determine target user (the other participant)
    const targetUserId = callState.caller?.isCaller 
      ? callState.receiver?.userId 
      : callState.caller?.userId

    if (targetUserId) {
      signalRChatService.sendCallEnd({
        callId: callState.callId,
        targetUserId,
        endTime: Date.now(),
        duration
      })
    }

    setCallState({
      callId: null,
      conversationId: null,
      callType: null,
      status: CallStatusEnum.Ended,
      caller: null,
      receiver: null,
      localStream: null,
      remoteStream: null,
      startTime: null,
      endTime: Date.now(),
      isAudioMuted: false,
      isVideoMuted: false
    })

    cleanupStreams()
  }, [callState.callId, callState.startTime, cleanupStreams])

  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return

    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setCallState(prev => ({
        ...prev,
        isAudioMuted: !audioTrack.enabled
      }))
    }
  }, [])

  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return

    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setCallState(prev => ({
        ...prev,
        isVideoMuted: !videoTrack.enabled
      }))
    }
  }, [])

  // ===== SignalR Event Handlers =====

  const handleCallOffer = useCallback(async (offer: CallOffer) => {
    console.log('[WebRTC] ===== RECEIVED CALL OFFER =====')
    console.log('[WebRTC] Offer details:', JSON.stringify(offer, null, 2))
    console.log('[WebRTC] Call ID:', offer.callId)
    console.log('[WebRTC] Call Type:', offer.callType)
    console.log('[WebRTC] Caller:', offer.caller)
    console.log('[WebRTC] Receiver:', offer.receiver)

    setCallState({
      callId: offer.callId,
      conversationId: offer.conversationId,
      callType: offer.callType,
      status: CallStatusEnum.Ringing,
      caller: offer.caller,
      receiver: offer.receiver,
      localStream: null,
      remoteStream: null,
      startTime: null,
      endTime: null,
      isAudioMuted: false,
      isVideoMuted: false
    })

    // Create peer connection for incoming call
    const pc = createPeerConnection()
    
    // Set remote description from offer
    await pc.setRemoteDescription(new RTCSessionDescription(offer.sdp))
  }, [createPeerConnection])

  const handleCallAnswer = useCallback(async (answer: CallAnswer) => {
    console.log('[WebRTC] ===== RECEIVED CALL ANSWER =====')
    console.log('[WebRTC] Answer CallId:', answer.callId)
    console.log('[WebRTC] Answer SDP type:', answer.sdp.type)

    if (!peerConnection.current) {
      console.error('[WebRTC] No peer connection found for answer')
      return
    }

    try {
      console.log('[WebRTC] Setting remote description (answer)...')
      console.log('[WebRTC] Peer connection state before:', peerConnection.current.signalingState)
      
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer.sdp))
      
      console.log('[WebRTC] Peer connection state after:', peerConnection.current.signalingState)
      console.log('[WebRTC] Connection state:', peerConnection.current.connectionState)

      // Answer received successfully - connection should now be establishing
      setCallState(prev => ({
        ...prev,
        status: CallStatusEnum.Connecting
      }))

      console.log('[WebRTC] ===== ANSWER PROCESSED - WAITING FOR CONNECTION =====')
    } catch (error) {
      console.error('[WebRTC] ===== FAILED TO PROCESS ANSWER =====')
      console.error('[WebRTC] Error:', error)
    }
  }, [])

  const handleCallIceCandidate = useCallback(async (data: CallIceCandidate) => {
    if (!peerConnection.current) {
      console.error('[WebRTC] No peer connection found for ICE candidate')
      return
    }

    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
      console.log('[WebRTC] Added ICE candidate')
    } catch (error) {
      console.error('[WebRTC] Failed to add ICE candidate:', error)
    }
  }, [])

  const handleCallRejected = useCallback(() => {
    console.log('[WebRTC] Call rejected')
    
    setCallState(prev => ({
      ...prev,
      status: CallStatusEnum.Rejected,
      endTime: Date.now()
    }))

    cleanupStreams()
  }, [cleanupStreams])

  const handleCallEnded = useCallback(() => {
    console.log('[WebRTC] Call ended')
    
    setCallState(prev => ({
      ...prev,
      status: CallStatusEnum.Ended,
      endTime: Date.now()
    }))

    cleanupStreams()
  }, [cleanupStreams])

  // ===== Register SignalR Handlers =====
  useEffect(() => {
    signalRChatService.onCallOffer = handleCallOffer
    signalRChatService.onCallAnswer = handleCallAnswer
    signalRChatService.onCallIceCandidate = handleCallIceCandidate
    signalRChatService.onCallRejected = handleCallRejected
    signalRChatService.onCallEnded = handleCallEnded

    return () => {
      signalRChatService.onCallOffer = undefined
      signalRChatService.onCallAnswer = undefined
      signalRChatService.onCallIceCandidate = undefined
      signalRChatService.onCallRejected = undefined
      signalRChatService.onCallEnded = undefined
    }
  }, [handleCallOffer, handleCallAnswer, handleCallIceCandidate, handleCallRejected, handleCallEnded])

  // ===== Computed Values =====
  // isInCall: Show VideoCallDialog for:
  // - Caller: during Initiating, Ringing, Connecting, Connected
  // - Receiver: only during Connecting, Connected (NOT Ringing - they see IncomingCallDialog)
  const isInCall = useMemo(() => {
    if (callState.status === CallStatusEnum.Idle) return false
    
    // For Ringing status, only show VideoCallDialog for the CALLER
    if (callState.status === CallStatusEnum.Ringing) {
      const isCaller = callState.caller?.userId === profile?.id
      console.log('[VideoCallContext] Ringing - isCaller:', isCaller, 'callerId:', callState.caller?.userId, 'myId:', profile?.id)
      return isCaller
    }
    
    // For other active statuses, show for both
    const inCall = callState.status === CallStatusEnum.Connected || 
                   callState.status === CallStatusEnum.Connecting ||
                   callState.status === CallStatusEnum.Initiating
    
    console.log('[VideoCallContext] isInCall:', inCall, 'status:', callState.status)
    return inCall
  }, [callState.status, callState.caller?.userId, profile?.id])

  // ===== Context Value =====
  const value = useMemo<VideoCallContextInterface>(
    () => ({
      callState,
      initiateCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleAudio,
      toggleVideo,
      isInCall
    }),
    [callState, initiateCall, acceptCall, rejectCall, endCall, toggleAudio, toggleVideo, isInCall]
  )

  return <VideoCallContext.Provider value={value}>{children}</VideoCallContext.Provider>
}

export default VideoCallProvider
