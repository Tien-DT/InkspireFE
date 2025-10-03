// ===== WebRTC Call Types =====

export enum CallType {
  Audio = 'audio',
  Video = 'video'
}

export enum CallStatus {
  Idle = 'idle',
  Initiating = 'initiating',
  Ringing = 'ringing',
  Connecting = 'connecting',
  Connected = 'connected',
  Ended = 'ended',
  Rejected = 'rejected',
  Busy = 'busy',
  NoAnswer = 'no_answer',
  Failed = 'failed'
}

export interface CallParticipant {
  userId: string
  userName: string
  isCaller: boolean
}

export interface CallState {
  callId: string | null
  conversationId: string | null
  callType: CallType | null
  status: CallStatus
  caller: CallParticipant | null
  receiver: CallParticipant | null
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  startTime: number | null
  endTime: number | null
  isAudioMuted: boolean
  isVideoMuted: boolean
}

// ===== WebRTC Signaling Messages =====

export interface CallOffer {
  callId: string
  conversationId: string
  callType: CallType
  caller: CallParticipant
  receiver: CallParticipant
  sdp: RTCSessionDescriptionInit
}

export interface CallAnswer {
  callId: string
  callerId: string  // ID of the caller (person who initiated the call)
  sdp: RTCSessionDescriptionInit
}

export interface CallIceCandidate {
  callId: string
  targetUserId: string
  candidate: RTCIceCandidateInit
}

export interface CallRejection {
  callId: string
  callerId: string
  reason?: string
}

export interface CallEnd {
  callId: string
  targetUserId: string
  endTime: number
  duration?: number
}

export interface CallBusy {
  callId: string
  userId: string
}
