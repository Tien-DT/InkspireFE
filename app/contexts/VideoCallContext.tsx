import { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { CallState, CallType, CallOffer, CallAnswer, CallIceCandidate } from '~/types/call.type'
import { CallStatus as CallStatusEnum } from '~/types/call.type'
import { signalRChatService } from '~/lib/signalr'
import { useAuth } from './AuthContext'

// ===== WebRTC Configuration =====
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    // Google STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    
    // Free TURN servers from Open Relay Project
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    
    // Backup TURN server from Twilio's public STUN/TURN (no auth required for testing)
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
  iceTransportPolicy: 'all', // Try all paths: host, srflx, and relay
  iceCandidatePoolSize: 10 // Generate more ICE candidates
}

// ===== Context Interface =====
interface VideoCallContextInterface {
  callState: CallState
  initiateCall: (
    conversationId: string,
    receiverUserId: string,
    receiverName: string,
    callType: CallType
  ) => Promise<void>
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

  const createPeerConnection = useCallback((currentCallId: string, currentCaller: any, currentReceiver: any) => {
    const pc = new RTCPeerConnection(ICE_SERVERS)

    // Handle ICE candidates with passed parameters to avoid stale closure
    pc.onicecandidate = (event) => {
      console.log('[WebRTC] onicecandidate event:', {
        hasCandidate: !!event.candidate,
        candidate: event.candidate?.candidate,
        callId: currentCallId
      })

      if (event.candidate && currentCallId) {
        // Determine target user (the other participant)
        // If I'm the caller, send to receiver; if I'm receiver, send to caller
        const iAmCaller = currentCaller?.userId === profile?.id
        const targetUserId = iAmCaller ? currentReceiver?.userId : currentCaller?.userId

        console.log('[WebRTC] Sending ICE candidate:', {
          callId: currentCallId,
          iAmCaller,
          myId: profile?.id,
          targetUserId,
          candidateType: event.candidate.type
        })

        if (targetUserId) {
          signalRChatService.sendCallIceCandidate({
            callId: currentCallId,
            targetUserId,
            candidate: event.candidate.toJSON()
          })
          console.log('[WebRTC] ICE candidate sent to SignalR')
        } else {
          console.error('[WebRTC] Cannot send ICE candidate - no target user!')
        }
      } else if (!event.candidate) {
        console.log('[WebRTC] ICE gathering completed (null candidate)')
      } else if (!currentCallId) {
        console.error('[WebRTC] Cannot send ICE candidate - callId is null!')
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
        console.log(
          '[WebRTC] Stream tracks:',
          event.streams[0].getTracks().map((t) => ({ kind: t.kind, id: t.id }))
        )

        remoteStreamRef.current = event.streams[0]
        setCallState((prev) => ({
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
        setCallState((prev) => ({
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
  }, [profile?.id])

  const getLocalStream = useCallback(async (callType: CallType): Promise<MediaStream> => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video:
          callType === 'video'
            ? {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
              }
            : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream

      setCallState((prev) => ({
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
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }

    // Clear remote stream
    remoteStreamRef.current = null

    setCallState((prev) => ({
      ...prev,
      localStream: null,
      remoteStream: null
    }))
  }, [])

  // ===== Call Actions =====

  const initiateCall = useCallback(
    async (conversationId: string, receiverUserId: string, receiverName: string, callType: CallType) => {
      console.log('[VideoCallContext] initiateCall called:', { conversationId, receiverUserId, receiverName, callType })
      try {
        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        console.log('[VideoCallContext] Generated callId:', callId)

        setCallState((prev) => ({
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

        // Create peer connection with current call details
        const caller = {
          userId: profile?.id || '',
          userName: `${profile?.first_name} ${profile?.last_name}`,
          isCaller: true
        }
        const receiver = {
          userId: receiverUserId,
          userName: receiverName,
          isCaller: false
        }
        const pc = createPeerConnection(callId, caller, receiver)

        // Add local tracks to peer connection with explicit logging
        console.log('[WebRTC] Adding local tracks to peer connection (CALLER)...')
        stream.getTracks().forEach((track) => {
          console.log('[WebRTC] Adding track:', track.kind, track.id, 'enabled:', track.enabled)
          const sender = pc.addTrack(track, stream)
          console.log('[WebRTC] Track added, sender:', sender.track?.kind)
        })
        console.log('[WebRTC] All local tracks added')

        // Create offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        console.log('[WebRTC] Offer created, waiting for ICE gathering...')

        // Wait for ICE gathering to complete (or timeout after 3 seconds)
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.log('[WebRTC] ICE gathering timeout - proceeding anyway')
            resolve()
          }, 3000)

          if (pc.iceGatheringState === 'complete') {
            clearTimeout(timeout)
            resolve()
          } else {
            pc.onicegatheringstatechange = () => {
              console.log('[WebRTC] ICE gathering state:', pc.iceGatheringState)
              if (pc.iceGatheringState === 'complete') {
                clearTimeout(timeout)
                resolve()
              }
            }
          }
        })

        console.log('[WebRTC] ICE gathering completed, sending offer...')

        // Send offer via SignalR with potentially updated SDP (includes ICE candidates)
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
          sdp: pc.localDescription! // Use the final local description with ICE candidates
        }

        await signalRChatService.sendCallOffer(callOffer)

        setCallState((prev) => ({
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
        setCallState((prev) => ({
          ...prev,
          status: CallStatusEnum.Failed
        }))
        cleanupStreams()
      }
    },
    [profile, getLocalStream, createPeerConnection, cleanupStreams]
  )

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

      setCallState((prev) => ({
        ...prev,
        status: CallStatusEnum.Connecting
      }))

      // Get local stream
      const stream = await getLocalStream(callState.callType)

      // Use EXISTING peer connection (created in handleCallOffer)
      const pc = peerConnection.current

      // Add local tracks to existing peer connection with explicit logging
      console.log('[WebRTC] Adding local tracks to peer connection (RECEIVER)...')
      console.log('[WebRTC] Current PC state:', pc.signalingState)
      console.log('[WebRTC] Current transceivers:', pc.getTransceivers().length)
      
      stream.getTracks().forEach((track) => {
        console.log('[WebRTC] Adding track:', track.kind, track.id, 'enabled:', track.enabled)
        const sender = pc.addTrack(track, stream)
        console.log('[WebRTC] Track added, sender:', sender.track?.kind)
      })
      
      console.log('[WebRTC] All local tracks added')
      console.log('[WebRTC] Transceivers after adding:', pc.getTransceivers().map(t => ({
        mid: t.mid,
        direction: t.direction,
        currentDirection: t.currentDirection
      })))

      // Create answer (remote description already set in handleCallOffer)
      console.log('[WebRTC] Creating answer...')
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      console.log('[WebRTC] Local description set:', answer.type)

      // Wait for ICE gathering to complete (or timeout after 3 seconds)
      console.log('[WebRTC] Waiting for ICE gathering...')
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.log('[WebRTC] ICE gathering timeout - proceeding anyway')
          resolve()
        }, 3000)

        if (pc.iceGatheringState === 'complete') {
          clearTimeout(timeout)
          resolve()
        } else {
          pc.onicegatheringstatechange = () => {
            console.log('[WebRTC] ICE gathering state:', pc.iceGatheringState)
            if (pc.iceGatheringState === 'complete') {
              clearTimeout(timeout)
              resolve()
            }
          }
        }
      })

      console.log('[WebRTC] ICE gathering completed, sending answer...')

      // Send answer via SignalR with final SDP (includes ICE candidates)
      const callAnswer: CallAnswer = {
        callId: callState.callId,
        callerId: callState.caller?.userId || '', // ID of the person who initiated the call
        sdp: pc.localDescription! // Use final local description with ICE candidates
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
      setCallState((prev) => ({
        ...prev,
        status: CallStatusEnum.Failed
      }))
      cleanupStreams()
    }
  }, [callState.callId, callState.callType, getLocalStream, cleanupStreams])

  const rejectCall = useCallback(
    (reason?: string) => {
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
    },
    [callState.callId, cleanupStreams]
  )

  const endCall = useCallback(() => {
    if (!callState.callId) return

    const duration = callState.startTime ? Date.now() - callState.startTime : 0

    // Determine target user (the other participant)
    const targetUserId = callState.caller?.isCaller ? callState.receiver?.userId : callState.caller?.userId

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
      setCallState((prev) => ({
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
      setCallState((prev) => ({
        ...prev,
        isVideoMuted: !videoTrack.enabled
      }))
    }
  }, [])

  // ===== SignalR Event Handlers =====

  const handleCallOffer = useCallback(
    async (offer: CallOffer) => {
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

      // Create peer connection for incoming call with call details
      console.log('[WebRTC] Creating peer connection with callId:', offer.callId)
      const pc = createPeerConnection(offer.callId, offer.caller, offer.receiver)

      // Set remote description from offer
      await pc.setRemoteDescription(new RTCSessionDescription(offer.sdp))
    },
    [createPeerConnection]
  )

  const handleCallAnswer = useCallback(async (answer: CallAnswer) => {
    console.log('[WebRTC] ===== RECEIVED CALL ANSWER =====')
    console.log('[WebRTC] Answer CallId:', answer.callId)
    console.log('[WebRTC] Answer SDP type:', answer.sdp.type)
    console.log('[WebRTC] Answer SDP:', answer.sdp.sdp)

    if (!peerConnection.current) {
      console.error('[WebRTC] No peer connection found for answer')
      return
    }

    try {
      const pc = peerConnection.current
      
      console.log('[WebRTC] Setting remote description (answer)...')
      console.log('[WebRTC] Peer connection state before:', pc.signalingState)
      console.log('[WebRTC] Transceivers before answer:', pc.getTransceivers().map(t => ({
        mid: t.mid,
        direction: t.direction,
        currentDirection: t.currentDirection,
        sender: t.sender?.track?.kind,
        receiver: t.receiver?.track?.kind
      })))

      await pc.setRemoteDescription(new RTCSessionDescription(answer.sdp))

      console.log('[WebRTC] Peer connection state after:', pc.signalingState)
      console.log('[WebRTC] Connection state:', pc.connectionState)
      console.log('[WebRTC] ICE connection state:', pc.iceConnectionState)
      console.log('[WebRTC] Transceivers after answer:', pc.getTransceivers().map(t => ({
        mid: t.mid,
        direction: t.direction,
        currentDirection: t.currentDirection,
        sender: t.sender?.track?.kind,
        receiver: t.receiver?.track?.kind
      })))

      // Check remote tracks
      const receivers = pc.getReceivers()
      console.log('[WebRTC] Remote receivers:', receivers.length)
      receivers.forEach((receiver, idx) => {
        console.log(`[WebRTC] Receiver ${idx}:`, {
          trackKind: receiver.track?.kind,
          trackId: receiver.track?.id,
          trackEnabled: receiver.track?.enabled,
          trackReadyState: receiver.track?.readyState
        })
      })

      // Answer received successfully - connection should now be establishing
      setCallState((prev) => ({
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
    console.log('[WebRTC] ===== RECEIVED ICE CANDIDATE =====')
    console.log('[WebRTC] CallId:', data.callId)
    console.log('[WebRTC] Candidate type:', data.candidate.candidate ? 'valid' : 'null')

    if (!peerConnection.current) {
      console.error('[WebRTC] No peer connection found for ICE candidate - discarding')
      return
    }

    console.log('[WebRTC] Peer connection state:', {
      connectionState: peerConnection.current.connectionState,
      iceConnectionState: peerConnection.current.iceConnectionState,
      signalingState: peerConnection.current.signalingState
    })

    try {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
      console.log('[WebRTC] ===== ICE CANDIDATE ADDED SUCCESSFULLY =====')
    } catch (error) {
      console.error('[WebRTC] ===== FAILED TO ADD ICE CANDIDATE =====')
      console.error('[WebRTC] Error:', error)
    }
  }, [])

  const handleCallRejected = useCallback(() => {
    console.log('[WebRTC] Call rejected')

    setCallState((prev) => ({
      ...prev,
      status: CallStatusEnum.Rejected,
      endTime: Date.now()
    }))

    cleanupStreams()
  }, [cleanupStreams])

  const handleCallEnded = useCallback(() => {
    console.log('[WebRTC] Call ended')

    setCallState((prev) => ({
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
      console.log(
        '[VideoCallContext] Ringing - isCaller:',
        isCaller,
        'callerId:',
        callState.caller?.userId,
        'myId:',
        profile?.id
      )
      return isCaller
    }

    // For other active statuses, show for both
    const inCall =
      callState.status === CallStatusEnum.Connected ||
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
