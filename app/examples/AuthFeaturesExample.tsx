// Example usage of the new authentication features

import { useProfile, useUpdateProfile } from '~/hooks/useProfile'
import { useTokenExpiration, useTokenInfo } from '~/hooks/useTokenExpiration'
import { useSessionManager, useSessionWarning } from '~/hooks/useSessionManager'

/**
 * Example component showing how to use the new auth features
 */
export function AuthFeaturesExample() {
  // Profile management
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile()
  const updateProfile = useUpdateProfile()

  // Token expiration handling
  const { isExpired, expiresAt, timeUntilExpiry } = useTokenInfo()
  useTokenExpiration({
    onTokenExpired: () => {
      console.log('Token expired!')
      // Handle token expiration
    }
  })

  // Session management
  const { showWarning } = useSessionWarning()
  useSessionManager({
    timeout: 30 * 60 * 1000, // 30 minutes
    onWarning: (timeLeft) => {
      showWarning(timeLeft)
    },
    onTimeout: () => {
      console.log('Session timeout!')
      // Handle session timeout
    }
  })

  const handleUpdateProfile = () => {
    updateProfile.mutate({
      first_name: 'Updated Name',
      phone_number: '0123456789'
    })
  }

  if (profileLoading) return <div>Loading profile...</div>
  if (profileError) return <div>Error loading profile</div>

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Auth Features Example</h2>
      
      {/* Profile Info */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Profile Information</h3>
        <p>Name: {profile?.first_name} {profile?.last_name}</p>
        <p>Email: {profile?.email}</p>
        <p>Phone: {profile?.phone_number}</p>
        <button 
          onClick={handleUpdateProfile}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update Profile
        </button>
      </div>

      {/* Token Info */}
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Token Information</h3>
        <p>Is Expired: {isExpired ? 'Yes' : 'No'}</p>
        <p>Expires At: {expiresAt?.toLocaleString()}</p>
        <p>Time Until Expiry: {Math.floor(timeUntilExpiry / 60)} minutes</p>
      </div>
    </div>
  )
}

