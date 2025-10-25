import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { settingsApi, type ApiSettingsResponse } from '~/apis/settings.api'
import { Eye, EyeOff, Key, Mail, TestTube, Copy, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Separator } from '~/components/ui/separator'

export default function SettingsPage() {
  const [settings, setSettings] = useState<ApiSettingsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGmailToken, setShowGmailToken] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  
  const [gmailRefreshToken, setGmailRefreshToken] = useState('')
  const [geminiApiKey, setGeminiApiKey] = useState('')
  
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<'gmail' | 'gemini' | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [oauthResult, setOauthResult] = useState<{ refreshToken: string; timestamp: string } | null>(null)
  
  // Test dialogs
  const [showTestGmailDialog, setShowTestGmailDialog] = useState(false)
  const [showTestGeminiDialog, setShowTestGeminiDialog] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testPrompt, setTestPrompt] = useState('Hello, how are you?')
  const [geminiResponse, setGeminiResponse] = useState('')

  useEffect(() => {
    loadSettings()
    
    // Check URL params for OAuth result (from backend redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const oauthSuccess = urlParams.get('oauth_success')
    const tokenPreview = urlParams.get('token_preview')
    const oauthError = urlParams.get('oauth_error')
    
    if (oauthSuccess === 'true') {
      toast.success('Gmail Refresh Token đã được lấy và lưu thành công!')
      setOauthResult({
        refreshToken: tokenPreview || 'Token đã được lưu vào database',
        timestamp: new Date().toISOString()
      })
      setShowSuccessDialog(true)
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
    
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        'no_code': 'Không nhận được authorization code từ Google',
        'not_configured': 'Gmail OAuth credentials chưa được cấu hình',
        'no_refresh_token': 'Google không trả về refresh token. Hãy revoke access tại https://myaccount.google.com/permissions và thử lại',
      }
      toast.error(`OAuth thất bại: ${errorMessages[oauthError] || oauthError}`)
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const result = await settingsApi.getSettings()
      setSettings(result.data)
    } catch (error: any) {
      console.error('Failed to load settings:', error)
      toast.error('Không thể tải cài đặt')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGmailToken = async () => {
    if (!gmailRefreshToken.trim()) {
      toast.error('Vui lòng nhập Gmail Refresh Token')
      return
    }

    try {
      setSaving(true)
      await settingsApi.updateGmailRefreshToken(gmailRefreshToken)
      toast.success('Cập nhật Gmail Refresh Token thành công! (Tạm thời)')
      setGmailRefreshToken('')
      loadSettings()
    } catch (error: any) {
      console.error('Failed to update Gmail token:', error)
      toast.error(error?.response?.data?.message || 'Không thể cập nhật Gmail Refresh Token')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateGeminiKey = async () => {
    if (!geminiApiKey.trim()) {
      toast.error('Vui lòng nhập Gemini API Key')
      return
    }

    try {
      setSaving(true)
      await settingsApi.updateGeminiApiKey(geminiApiKey)
      toast.success('Cập nhật Gemini API Key thành công! (Tạm thời)')
      setGeminiApiKey('')
      loadSettings()
    } catch (error: any) {
      console.error('Failed to update Gemini key:', error)
      toast.error(error?.response?.data?.message || 'Không thể cập nhật Gemini API Key')
    } finally {
      setSaving(false)
    }
  }

  const handleTestGmail = async () => {
    if (!testEmail.trim()) {
      toast.error('Vui lòng nhập email để test')
      return
    }

    try {
      setTesting('gmail')
      const result = await settingsApi.testGmailConnection(testEmail)
      toast.success(result.data.message)
      setShowTestGmailDialog(false)
      setTestEmail('')
    } catch (error: any) {
      console.error('Gmail test failed:', error)
      toast.error(error?.response?.data?.message || 'Test Gmail API thất bại')
    } finally {
      setTesting(null)
    }
  }

  const handleTestGemini = async () => {
    if (!testPrompt.trim()) {
      toast.error('Vui lòng nhập prompt để test')
      return
    }

    try {
      setTesting('gemini')
      const result = await settingsApi.testGeminiConnection(testPrompt)
      setGeminiResponse(result.data.response)
      toast.success('Test Gemini API thành công!')
    } catch (error: any) {
      console.error('Gemini test failed:', error)
      toast.error(error?.response?.data?.message || 'Test Gemini API thất bại')
      setGeminiResponse('')
    } finally {
      setTesting(null)
    }
  }

  const handleGetGmailRefreshToken = async () => {
    try {
      setSaving(true)
      
      // Check if OAuth credentials are configured
      if (!settings?.gmailClientIdSet || !settings?.gmailClientSecretSet) {
        toast.error('Gmail OAuth credentials chưa được cấu hình trong appsettings.json')
        setSaving(false)
        return
      }

      const result = await settingsApi.getGmailOAuthUrl()

      // Open OAuth URL in current window - backend will handle everything
      window.location.href = result.data.authorizationUrl
    } catch (error: any) {
      console.error('Failed to get OAuth URL:', error)
      toast.error(error?.response?.data?.message || 'Không thể khởi tạo OAuth flow')
      setSaving(false)
    }
  }

  const handleCopyToken = () => {
    if (oauthResult?.refreshToken) {
      navigator.clipboard.writeText(oauthResult.refreshToken)
      toast.success('Đã copy refresh token!')
    }
  }

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false)
    setOauthResult(null)
    // Reload settings to show updated token status
    loadSettings()
  }

  const copyGmailConfig = () => {
    const config = `"GmailApiOptions": {
  "RefreshToken": "${gmailRefreshToken || 'YOUR_REFRESH_TOKEN_HERE'}"
}`
    navigator.clipboard.writeText(config)
    toast.success('Đã copy config vào clipboard!')
  }

  const copyGeminiConfig = () => {
    const config = `"Gemini": {
  "ApiKey": "${geminiApiKey || 'YOUR_API_KEY_HERE'}"
}`
    navigator.clipboard.writeText(config)
    toast.success('Đã copy config vào clipboard!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cài đặt API</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý Gmail API Refresh Token và Gemini API Key
        </p>
      </div>

      <Alert className="mb-6 bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          ✅ <strong>Lưu vĩnh viễn:</strong> Tất cả thay đổi qua UI này sẽ được <strong>lưu vào database</strong> và không mất khi restart server!
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="gmail" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gmail" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Gmail API
          </TabsTrigger>
          <TabsTrigger value="gemini" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Gemini API
          </TabsTrigger>
        </TabsList>

        {/* Gmail Tab */}
        <TabsContent value="gmail" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Gmail API Refresh Token
              </CardTitle>
              <CardDescription>
                Refresh Token được sử dụng để gửi email qua Gmail API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="space-y-2">
                <Label>Trạng thái hiện tại</Label>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {settings?.gmailRefreshTokenSet ? '✅ Đã cấu hình' : '❌ Chưa cấu hình'}
                    </p>
                    {settings?.gmailRefreshToken && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {showGmailToken ? settings.gmailRefreshToken : settings.gmailRefreshToken}
                      </p>
                    )}
                  </div>
                  {settings?.gmailRefreshTokenSet && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowGmailToken(!showGmailToken)}
                      >
                        {showGmailToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTestGmailDialog(true)}
                        disabled={!settings?.gmailRefreshTokenSet}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Test gửi email
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* OAuth Button */}
              <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  🚀 Cách nhanh nhất: Lấy token qua OAuth
                </h4>
                <p className="text-sm text-blue-800">
                  Click nút bên dưới để authorize với Google. 
                  Backend sẽ tự động nhận token và lưu vào database.
                </p>
                <Button
                  onClick={handleGetGmailRefreshToken}
                  disabled={saving || !settings?.gmailClientIdSet || !settings?.gmailClientSecretSet}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Đang khởi tạo...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Lấy Gmail Refresh Token qua OAuth
                    </>
                  )}
                </Button>
                {!settings?.gmailClientIdSet && (
                  <p className="text-xs text-red-600">
                    ⚠️ Cần cấu hình Gmail ClientId và ClientSecret trong appsettings.json trước
                  </p>
                )}
              </div>

              <Separator />

              {/* Manual Update Token */}
              <div className="space-y-4">
                <Label htmlFor="gmail-token">Hoặc nhập Refresh Token thủ công</Label>
                <div className="flex gap-2">
                  <Input
                    id="gmail-token"
                    type="password"
                    value={gmailRefreshToken}
                    onChange={(e) => setGmailRefreshToken(e.target.value)}
                    placeholder="Nhập Gmail Refresh Token mới..."
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleUpdateGmailToken}
                    disabled={saving || !gmailRefreshToken.trim()}
                  >
                    {saving ? 'Đang lưu...' : 'Cập nhật'}
                  </Button>
                </div>
                
                {gmailRefreshToken && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyGmailConfig}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy config để paste vào appsettings.json
                  </Button>
                )}
              </div>

              <Separator />

              {/* Get Refresh Token Guide */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Cách lấy Gmail Refresh Token
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>
                    Truy cập{' '}
                    <a
                      href="https://developers.google.com/oauthplayground"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      Google OAuth Playground
                    </a>
                  </li>
                  <li>Nhấn Settings icon (⚙️) ở góc trên bên phải</li>
                  <li>Check ☑️ "Use your own OAuth credentials"</li>
                  <li>Nhập OAuth Client ID và Client Secret của bạn</li>
                  <li>Chọn scope: <code className="bg-blue-100 px-1 rounded">https://mail.google.com/</code></li>
                  <li>Click "Authorize APIs" và đăng nhập Gmail</li>
                  <li>Click "Exchange authorization code for tokens"</li>
                  <li>Copy giá trị của "Refresh token"</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gemini Tab */}
        <TabsContent value="gemini" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gemini API Key
              </CardTitle>
              <CardDescription>
                API Key được sử dụng để đánh giá file bằng Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="space-y-2">
                <Label>Trạng thái hiện tại</Label>
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {settings?.geminiApiKeySet ? '✅ Đã cấu hình' : '❌ Chưa cấu hình'}
                    </p>
                    {settings?.geminiApiKey && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {showGeminiKey ? settings.geminiApiKey : settings.geminiApiKey}
                      </p>
                    )}
                  </div>
                  {settings?.geminiApiKeySet && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                      >
                        {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTestGeminiDialog(true)}
                        disabled={!settings?.geminiApiKeySet}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Gemini
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Update API Key */}
              <div className="space-y-4">
                <Label htmlFor="gemini-key">API Key mới</Label>
                <div className="flex gap-2">
                  <Input
                    id="gemini-key"
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Nhập Gemini API Key mới..."
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleUpdateGeminiKey}
                    disabled={saving || !geminiApiKey.trim()}
                  >
                    {saving ? 'Đang lưu...' : 'Cập nhật'}
                  </Button>
                </div>
                
                {geminiApiKey && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyGeminiConfig}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy config để paste vào appsettings.json
                  </Button>
                )}
              </div>

              <Separator />

              {/* Get API Key Guide */}
              <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Cách lấy Gemini API Key
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
                  <li>
                    Truy cập{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      Google AI Studio
                    </a>
                  </li>
                  <li>Đăng nhập bằng Google Account</li>
                  <li>Click "Create API Key" hoặc "Get API Key"</li>
                  <li>Chọn hoặc tạo Google Cloud Project</li>
                  <li>Copy API Key được tạo</li>
                  <li>Lưu ý: API Key có giới hạn request miễn phí, nâng cấp nếu cần</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Gmail Dialog */}
      <Dialog open={showTestGmailDialog} onOpenChange={setShowTestGmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Gmail API</DialogTitle>
            <DialogDescription>
              Nhập email để gửi email test
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email nhận:</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="example@gmail.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowTestGmailDialog(false)}
                disabled={testing === 'gmail'}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleTestGmail}
                disabled={testing === 'gmail' || !testEmail.trim()}
              >
                {testing === 'gmail' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi email test'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Gemini Dialog */}
      <Dialog open={showTestGeminiDialog} onOpenChange={setShowTestGeminiDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Test Gemini API</DialogTitle>
            <DialogDescription>
              Nhập prompt để test phản hồi từ Gemini
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="test-prompt">Prompt:</Label>
              <Input
                id="test-prompt"
                type="text"
                placeholder="Hello, how are you?"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
              />
            </div>

            {geminiResponse && (
              <div className="space-y-2">
                <Label>Phản hồi từ Gemini:</Label>
                <div className="p-3 bg-muted rounded-md text-sm max-h-48 overflow-y-auto">
                  {geminiResponse}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowTestGeminiDialog(false)
                  setGeminiResponse('')
                }}
                disabled={testing === 'gemini'}
              >
                Đóng
              </Button>
              <Button 
                onClick={handleTestGemini}
                disabled={testing === 'gemini' || !testPrompt.trim()}
              >
                {testing === 'gemini' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Đang test...
                  </>
                ) : (
                  'Gửi prompt'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Gmail Refresh Token đã được lấy thành công!
            </DialogTitle>
            <DialogDescription>
              Token đã được lưu vào database và sẵn sàng sử dụng
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✅ Gmail Refresh Token đã được lưu thành công vào database!
                <br />
                Backend đã tự động lưu token, bạn có thể sử dụng Gmail API ngay.
              </AlertDescription>
            </Alert>

            {oauthResult?.refreshToken && (
              <div className="space-y-2">
                <Label>Token Preview:</Label>
                <div className="p-3 bg-muted rounded-md font-mono text-xs">
                  {oauthResult.refreshToken}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lấy lúc: {new Date(oauthResult.timestamp).toLocaleString('vi-VN')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Token đầy đủ đã được lưu trong database. Không cần copy.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button onClick={handleCloseSuccessDialog}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
