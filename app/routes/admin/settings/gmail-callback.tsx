import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { settingsApi } from '~/apis/settings.api'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2, Copy } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'

export default function GmailCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      // Save error to sessionStorage and redirect
      sessionStorage.setItem('gmailOAuthError', error)
      toast.error('Gmail authorization was denied')
      setTimeout(() => navigate('/admin/settings'), 1500)
      return
    }

    if (!code) {
      sessionStorage.setItem('gmailOAuthError', 'No authorization code received')
      setTimeout(() => navigate('/admin/settings'), 1500)
      return
    }

    // Exchange code for refresh token
    const exchangeCode = async () => {
      try {
        const result = await settingsApi.exchangeGmailCode(code)
        
        // Save success result to sessionStorage
        sessionStorage.setItem('gmailOAuthSuccess', JSON.stringify({
          refreshToken: result.data.refreshToken,
          timestamp: new Date().toISOString()
        }))
        
        toast.success('Gmail Refresh Token đã được lưu vào database!')
        
        // Redirect to settings page after short delay
        setTimeout(() => navigate('/admin/settings'), 1000)
      } catch (err: any) {
        console.error('Failed to exchange code:', err)
        const errorMsg = err?.response?.data?.message || 'Không thể lấy refresh token'
        sessionStorage.setItem('gmailOAuthError', errorMsg)
        toast.error(errorMsg)
        setTimeout(() => navigate('/admin/settings'), 2000)
      }
    }

    exchangeCode()
  }, [searchParams, navigate])

  return (
    <div className="container mx-auto p-6 max-w-3xl min-h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            Đang xử lý OAuth...
          </CardTitle>
          <CardDescription>
            Đang lấy Gmail Refresh Token từ Google và lưu vào database...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Vui lòng đợi, bạn sẽ được chuyển về trang Settings...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
