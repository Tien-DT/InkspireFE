import { useState } from 'react'
import { Save, RefreshCw, Upload, Download } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface SystemSettings {
  siteName: string
  siteTagline: string
  contactEmail: string
  supportPhone: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  freelancerVerification: boolean
  autoApproveProjects: boolean
  commissionRate: number
  minWithdrawal: number
  maxUploadSize: number
  allowedFileTypes: string
  emailNotifications: boolean
  smsNotifications: boolean
  chatEnabled: boolean
  reviewSystem: boolean
  currency: string
  timezone: string
  language: string
}

interface SettingsFormProps {
  initialSettings: SystemSettings
  onSave?: (settings: SystemSettings) => void
  onReset?: () => void
  onExport?: () => void
  onImport?: (file: File) => void
  isLoading?: boolean
}

export function SettingsForm({ 
  initialSettings, 
  onSave, 
  onReset, 
  onExport, 
  onImport,
  isLoading = false 
}: SettingsFormProps) {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave?.(settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(initialSettings)
    setHasChanges(false)
    onReset?.()
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImport?.(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h2>
          <p className="text-gray-600">Quản lý cấu hình và tùy chọn hệ thống</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Xuất cài đặt
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Nhập cài đặt
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Tên website</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="Tên website của bạn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteTagline">Slogan</Label>
              <Input
                id="siteTagline"
                value={settings.siteTagline}
                onChange={(e) => handleChange('siteTagline', e.target.value)}
                placeholder="Mô tả ngắn về website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email liên hệ</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Số điện thoại hỗ trợ</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                placeholder="+84 xxx xxx xxx"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tính năng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Chế độ bảo trì</Label>
                <p className="text-sm text-gray-600">Tạm thời tắt website để bảo trì</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(value) => handleChange('maintenanceMode', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Cho phép đăng ký</Label>
                <p className="text-sm text-gray-600">Người dùng mới có thể đăng ký tài khoản</p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={(value) => handleChange('registrationEnabled', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Xác minh freelancer</Label>
                <p className="text-sm text-gray-600">Yêu cầu xác minh danh tính freelancer</p>
              </div>
              <Switch
                checked={settings.freelancerVerification}
                onCheckedChange={(value) => handleChange('freelancerVerification', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Tự động duyệt dự án</Label>
                <p className="text-sm text-gray-600">Dự án được duyệt tự động khi đăng</p>
              </div>
              <Switch
                checked={settings.autoApproveProjects}
                onCheckedChange={(value) => handleChange('autoApproveProjects', value)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Chat trực tuyến</Label>
                <p className="text-sm text-gray-600">Cho phép chat giữa khách hàng và freelancer</p>
              </div>
              <Switch
                checked={settings.chatEnabled}
                onCheckedChange={(value) => handleChange('chatEnabled', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt tài chính</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Tỷ lệ hoa hồng (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minWithdrawal">Số tiền rút tối thiểu (VND)</Label>
              <Input
                id="minWithdrawal"
                type="number"
                min="0"
                value={settings.minWithdrawal}
                onChange={(e) => handleChange('minWithdrawal', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Đơn vị tiền tệ</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">Việt Nam Đồng (VND)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Technical Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">Kích thước file tối đa (MB)</Label>
              <Input
                id="maxUploadSize"
                type="number"
                min="1"
                value={settings.maxUploadSize}
                onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedFileTypes">Định dạng file cho phép</Label>
              <Textarea
                id="allowedFileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => handleChange('allowedFileTypes', e.target.value)}
                placeholder="pdf,doc,docx,jpg,png,gif"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Múi giờ</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                  <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="text-sm text-gray-600">
          {hasChanges ? 'Có thay đổi chưa được lưu' : 'Tất cả thay đổi đã được lưu'}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Khôi phục
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>
    </div>
  )
}