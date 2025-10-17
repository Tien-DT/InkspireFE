import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { useAuth } from '~/contexts/AuthContext'
import { getFcmTokenFromLS } from '~/utils/fcmToken'
import { notificationApi } from '~/apis/notificationApi'
import { getAccessTokenFromLS } from '~/utils/auth'

/**
 * Debug component to check FCM token status
 * Remove this in production
 */
export function DebugNotifications() {
  const { isAuthenticated, profile } = useAuth()
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [backendToken, setBackendToken] = useState<{
    hasFcmToken: boolean
    token: string | null
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    // Check localStorage
    const localToken = getFcmTokenFromLS()
    setFcmToken(localToken)

    // Check backend
    if (isAuthenticated) {
      setLoading(true)
      try {
        const response = await notificationApi.getMyNotifications(1, 1)
        // Try to get FCM status from backend
        const statusResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notifications/test/my-fcm-token`,
          {
            headers: {
              Authorization: `Bearer ${getAccessTokenFromLS()}`
            }
          }
        )
        if (statusResponse.ok) {
          const data = await statusResponse.json()
          setBackendToken({
            hasFcmToken: data.data?.hasFcmToken || false,
            token: data.data?.fcmToken || null
          })
        }
      } catch (error) {
        console.error('Error checking backend status:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    checkStatus()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm">🔍 Notification Debug</CardTitle>
          <CardDescription>Not authenticated</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">🔍 FCM Token Debug</CardTitle>
        <CardDescription>For development only</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* User Info */}
        <div>
          <p className="text-xs text-muted-foreground">User ID</p>
          <code className="text-xs bg-muted p-1 rounded">{profile?.id}</code>
        </div>

        {/* LocalStorage Token */}
        <div>
          <p className="text-xs text-muted-foreground">LocalStorage</p>
          {fcmToken ? (
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">✅ Has Token</Badge>
              <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                {fcmToken.substring(0, 20)}...
              </code>
            </div>
          ) : (
            <Badge variant="destructive" className="text-xs">❌ No Token</Badge>
          )}
        </div>

        {/* Backend Token */}
        <div>
          <p className="text-xs text-muted-foreground">Database</p>
          {loading ? (
            <Badge variant="outline" className="text-xs">Loading...</Badge>
          ) : backendToken ? (
            backendToken.hasFcmToken ? (
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">✅ Registered</Badge>
                <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                  {backendToken.token?.substring(0, 20)}...
                </code>
              </div>
            ) : (
              <Badge variant="destructive" className="text-xs">❌ Not in DB</Badge>
            )
          ) : (
            <Badge variant="outline" className="text-xs">Unknown</Badge>
          )}
        </div>

        {/* Match Status */}
        <div>
          <p className="text-xs text-muted-foreground">Status</p>
          {fcmToken && backendToken?.hasFcmToken ? (
            fcmToken === backendToken.token ? (
              <Badge variant="success" className="text-xs">✅ Tokens Match</Badge>
            ) : (
              <Badge variant="warning" className="text-xs">⚠️ Token Mismatch</Badge>
            )
          ) : (
            <Badge variant="outline" className="text-xs">N/A</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={checkStatus} className="text-xs">
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              console.log('LocalStorage Token:', fcmToken)
              console.log('Backend Token:', backendToken)
            }}
            className="text-xs"
          >
            Log to Console
          </Button>
        </div>

        {/* VAPID Key Check */}
        <div>
          <p className="text-xs text-muted-foreground">VAPID Key</p>
          {import.meta.env.VITE_FIREBASE_VAPID_KEY ? (
            import.meta.env.VITE_FIREBASE_VAPID_KEY === 'YOUR_VAPID_KEY_HERE' ? (
              <Badge variant="destructive" className="text-xs">❌ Not Configured</Badge>
            ) : (
              <Badge variant="success" className="text-xs">✅ Configured</Badge>
            )
          ) : (
            <Badge variant="destructive" className="text-xs">❌ Missing</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
