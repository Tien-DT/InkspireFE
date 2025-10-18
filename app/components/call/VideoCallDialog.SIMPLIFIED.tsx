import { useVideoCall, CallStatusEnum } from '~/contexts/VideoCallContext'
import { DailyVideoCall } from '~/components/video/DailyVideoCall'
import { useAuth } from '~/contexts/AuthContext'

export function VideoCallDialog() {
  const { callState, endCall } = useVideoCall()
  const { profile } = useAuth()

  // Only show Daily iframe when connected and we have a room URL
  const isInCall = callState.status === CallStatusEnum.Connected && callState.dailyRoomUrl

  if (!isInCall || !callState.dailyRoomUrl) {
    return null
  }

  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : 'User'

  return (
    <DailyVideoCall
      roomUrl={callState.dailyRoomUrl}
      onLeave={endCall}
      userName={userName}
      isVideoCall={callState.callType === 'video'}
    />
  )
}
