import { useState } from 'react'
import { Settings, Shield, Database, Mail, Bell, Globe, Users, CreditCard, Code, Palette, Upload, Save, RotateCcw, AlertTriangle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import { Separator } from '~/components/ui/separator'
import { Badge } from '~/components/ui/badge'

export default function AdminSystemSettings() {
  const [hasChanges, setHasChanges] = useState(false)

  // Mock settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Inkspire Platform',
    siteTagline: 'Nền tảng kết nối freelancer và khách hàng',
    adminEmail: 'admin@inkspire.com',
    supportEmail: 'support@inkspire.com',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    
    // Feature Toggles
    maintenanceMode: false,
    userRegistration: true,
    freelancerVerification: true,
    paymentProcessing: true,
    notificationSystem: true,
    chatSystem: true,
    reviewSystem: true,
    
    // Payment Settings
    commissionRate: 10,
    minWithdrawAmount: 100000,
    maxProjectBudget: 100000000,
    paymentMethods: ['momo', 'banking', 'vnpay'],
    
    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    ipWhitelist: '',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailSignature: 'Best regards,\nInkspire Team',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: true,
    
    // Content Settings
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx'],
    contentModeration: true,
    autoApproveProjects: false,
    
    // API Settings
    apiRateLimit: 1000,
    apiKeyExpiry: 365,
    webhookRetries: 3,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  const handleResetSettings = () => {
    // Reset to default logic here
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-1">Quản lý các cài đặt và cấu hình của nền tảng</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Có thay đổi chưa lưu
            </Badge>
          )}
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Khôi phục
          </Button>
          <Button onClick={handleSaveSettings} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="features">Tính năng</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Cài đặt chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên website</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Bangkok (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                      <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteTagline">Tagline website</Label>
                <Textarea
                  id="siteTagline"
                  value={settings.siteTagline}
                  onChange={(e) => handleSettingChange('siteTagline', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email quản trị</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email hỗ trợ</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Toggles */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Bật/tắt tính năng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Chế độ bảo trì</Label>
                    <p className="text-sm text-gray-600">Tạm thời đóng website để bảo trì</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(value) => handleSettingChange('maintenanceMode', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Đăng ký người dùng</Label>
                    <p className="text-sm text-gray-600">Cho phép người dùng mới đăng ký tài khoản</p>
                  </div>
                  <Switch
                    checked={settings.userRegistration}
                    onCheckedChange={(value) => handleSettingChange('userRegistration', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Xác minh freelancer</Label>
                    <p className="text-sm text-gray-600">Yêu cầu xác minh danh tính freelancer</p>
                  </div>
                  <Switch
                    checked={settings.freelancerVerification}
                    onCheckedChange={(value) => handleSettingChange('freelancerVerification', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Xử lý thanh toán</Label>
                    <p className="text-sm text-gray-600">Kích hoạt hệ thống thanh toán</p>
                  </div>
                  <Switch
                    checked={settings.paymentProcessing}
                    onCheckedChange={(value) => handleSettingChange('paymentProcessing', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Hệ thống chat</Label>
                    <p className="text-sm text-gray-600">Cho phép chat giữa khách hàng và freelancer</p>
                  </div>
                  <Switch
                    checked={settings.chatSystem}
                    onCheckedChange={(value) => handleSettingChange('chatSystem', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Hệ thống đánh giá</Label>
                    <p className="text-sm text-gray-600">Cho phép đánh giá và phản hồi</p>
                  </div>
                  <Switch
                    checked={settings.reviewSystem}
                    onCheckedChange={(value) => handleSettingChange('reviewSystem', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Cài đặt thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Tỷ lệ hoa hồng (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleSettingChange('commissionRate', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600">Phần trăm hoa hồng từ mỗi giao dịch</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minWithdrawAmount">Số tiền rút tối thiểu (VNĐ)</Label>
                  <Input
                    id="minWithdrawAmount"
                    type="number"
                    value={settings.minWithdrawAmount}
                    onChange={(e) => handleSettingChange('minWithdrawAmount', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxProjectBudget">Ngân sách dự án tối đa (VNĐ)</Label>
                <Input
                  id="maxProjectBudget"
                  type="number"
                  value={settings.maxProjectBudget}
                  onChange={(e) => handleSettingChange('maxProjectBudget', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Phương thức thanh toán</Label>
                <div className="space-y-2">
                  {[
                    { id: 'momo', label: 'MoMo' },
                    { id: 'banking', label: 'Chuyển khoản ngân hàng' },
                    { id: 'vnpay', label: 'VNPay' },
                    { id: 'zalopay', label: 'ZaloPay' },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={method.id}
                        checked={settings.paymentMethods.includes(method.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSettingChange('paymentMethods', [...settings.paymentMethods, method.id])
                          } else {
                            handleSettingChange('paymentMethods', settings.paymentMethods.filter(m => m !== method.id))
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={method.id}>{method.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Cài đặt bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Độ dài mật khẩu tối thiểu</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Thời gian session (phút)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Xác thực hai bước</Label>
                  <p className="text-sm text-gray-600">Yêu cầu xác thực qua SMS/Email khi đăng nhập</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(value) => handleSettingChange('twoFactorAuth', value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  value={settings.ipWhitelist}
                  onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                  placeholder="Nhập địa chỉ IP được phép truy cập admin, mỗi IP một dòng"
                  rows={4}
                />
                <p className="text-sm text-gray-600">Để trống để cho phép tất cả IP</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Cài đặt email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailSignature">Chữ ký email</Label>
                <Textarea
                  id="emailSignature"
                  value={settings.emailSignature}
                  onChange={(e) => handleSettingChange('emailSignature', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Thông báo email</Label>
                    <p className="text-sm text-gray-600">Gửi thông báo qua email cho người dùng</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Thông báo SMS</Label>
                    <p className="text-sm text-gray-600">Gửi thông báo qua tin nhắn SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(value) => handleSettingChange('smsNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Push notifications</Label>
                    <p className="text-sm text-gray-600">Gửi thông báo đẩy trên trình duyệt</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Email marketing</Label>
                    <p className="text-sm text-gray-600">Gửi email quảng cáo và khuyến mãi</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(value) => handleSettingChange('marketingEmails', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Settings */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Cài đặt nội dung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Kích thước file tối đa (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại file được phép</Label>
                  <div className="flex flex-wrap gap-2">
                    {['jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'].map((type) => (
                      <div key={type} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          id={type}
                          checked={settings.allowedFileTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleSettingChange('allowedFileTypes', [...settings.allowedFileTypes, type])
                            } else {
                              handleSettingChange('allowedFileTypes', settings.allowedFileTypes.filter(t => t !== type))
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={type} className="text-sm">{type.toUpperCase()}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Kiểm duyệt nội dung</Label>
                  <p className="text-sm text-gray-600">Tự động kiểm tra nội dung không phù hợp</p>
                </div>
                <Switch
                  checked={settings.contentModeration}
                  onCheckedChange={(value) => handleSettingChange('contentModeration', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Tự động duyệt dự án</Label>
                  <p className="text-sm text-gray-600">Tự động phê duyệt dự án mới</p>
                </div>
                <Switch
                  checked={settings.autoApproveProjects}
                  onCheckedChange={(value) => handleSettingChange('autoApproveProjects', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Cài đặt API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">Giới hạn API (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => handleSettingChange('apiRateLimit', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKeyExpiry">Thời hạn API key (ngày)</Label>
                  <Input
                    id="apiKeyExpiry"
                    type="number"
                    value={settings.apiKeyExpiry}
                    onChange={(e) => handleSettingChange('apiKeyExpiry', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookRetries">Số lần thử lại webhook</Label>
                  <Input
                    id="webhookRetries"
                    type="number"
                    value={settings.webhookRetries}
                    onChange={(e) => handleSettingChange('webhookRetries', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Keys</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-gray-600">••••••••••••••••••••••••••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-gray-600">••••••••••••••••••••••••••••••••</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}