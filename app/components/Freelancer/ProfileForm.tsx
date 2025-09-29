import { useState } from 'react'
import { Save, Upload, Plus, X, Eye, Star } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface Portfolio {
  id: string
  title: string
  description: string
  imageUrl: string
  projectUrl?: string
  technologies: string[]
}

interface Experience {
  id: string
  title: string
  company: string
  duration: string
  description: string
  current: boolean
}

interface FreelancerProfile {
  id: string
  fullName: string
  title: string
  bio: string
  avatar?: string
  location: string
  hourlyRate: number
  currency: string
  availability: 'available' | 'busy' | 'unavailable'
  phone: string
  email: string
  skills: Skill[]
  portfolio: Portfolio[]
  experience: Experience[]
  languages: string[]
  categories: string[]
}

interface ProfileFormProps {
  profile: FreelancerProfile
  onSave?: (profile: FreelancerProfile) => void
  onPreview?: () => void
  isLoading?: boolean
}

export function ProfileForm({ profile, onSave, onPreview, isLoading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<FreelancerProfile>(profile)
  const [newSkill, setNewSkill] = useState<{ name: string; level: Skill['level'] }>({ name: '', level: 'beginner' })
  const [newLanguage, setNewLanguage] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: keyof FreelancerProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave?.(formData)
    setHasChanges(false)
  }

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        level: newSkill.level
      }
      handleChange('skills', [...formData.skills, skill])
      setNewSkill({ name: '', level: 'beginner' })
    }
  }

  const removeSkill = (skillId: string) => {
    handleChange('skills', formData.skills.filter(s => s.id !== skillId))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      handleChange('languages', [...formData.languages, newLanguage.trim()])
      setNewLanguage('')
    }
  }

  const removeLanguage = (language: string) => {
    handleChange('languages', formData.languages.filter(l => l !== language))
  }

  const getSkillLevelLabel = (level: Skill['level']) => {
    switch (level) {
      case 'beginner': return 'Mới bắt đầu'
      case 'intermediate': return 'Trung bình'
      case 'advanced': return 'Nâng cao'
      case 'expert': return 'Chuyên gia'
      default: return level
    }
  }

  const getSkillLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'beginner': return 'bg-gray-100 text-gray-800'
      case 'intermediate': return 'bg-blue-100 text-blue-800'
      case 'advanced': return 'bg-green-100 text-green-800'
      case 'expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityLabel = (availability: FreelancerProfile['availability']) => {
    switch (availability) {
      case 'available': return 'Sẵn sàng nhận việc'
      case 'busy': return 'Đang bận'
      case 'unavailable': return 'Không nhận việc'
      default: return availability
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
          <p className="text-gray-600">Cập nhật thông tin cá nhân và kỹ năng của bạn</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="text-xl">
                      {formData.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Tải ảnh
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề chuyên môn</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Ví dụ: Web Developer, Designer..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu bản thân</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Mô tả kinh nghiệm, kỹ năng và sở thích của bạn..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Work Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ & làm việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+84 xxx xxx xxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Thành phố, Quốc gia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Trạng thái làm việc</Label>
                  <Select 
                    value={formData.availability} 
                    onValueChange={(value) => handleChange('availability', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Sẵn sàng nhận việc</SelectItem>
                      <SelectItem value="busy">Đang bận</SelectItem>
                      <SelectItem value="unavailable">Không nhận việc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Mức lương theo giờ (VND)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleChange('hourlyRate', parseInt(e.target.value))}
                    placeholder="50000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Kỹ năng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-1 bg-gray-50 rounded-lg p-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <Badge className={getSkillLevelColor(skill.level)}>
                      {getSkillLevelLabel(skill.level)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-red-100"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="newSkill">Thêm kỹ năng mới</Label>
                  <Input
                    id="newSkill"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tên kỹ năng"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                </div>
                <Select 
                  value={newSkill.level} 
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, level: value as Skill['level'] }))}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Mới bắt đầu</SelectItem>
                    <SelectItem value="intermediate">Trung bình</SelectItem>
                    <SelectItem value="advanced">Nâng cao</SelectItem>
                    <SelectItem value="expert">Chuyên gia</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addSkill} disabled={!newSkill.name.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Ngôn ngữ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((language, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-blue-50 rounded-lg p-2">
                    <span className="text-sm">{language}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-red-100"
                      onClick={() => removeLanguage(language)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label htmlFor="newLanguage">Thêm ngôn ngữ</Label>
                  <Input
                    id="newLanguage"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Ví dụ: Tiếng Anh, Tiếng Nhật..."
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  />
                </div>
                <Button onClick={addLanguage} disabled={!newLanguage.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Xem trước hồ sơ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <Avatar className="h-16 w-16 mx-auto">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback>
                    {formData.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{formData.fullName || 'Tên của bạn'}</h3>
                  <p className="text-sm text-gray-600">{formData.title || 'Tiêu đề chuyên môn'}</p>
                </div>
                <Badge className={`${
                  formData.availability === 'available' ? 'bg-green-100 text-green-800' :
                  formData.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getAvailabilityLabel(formData.availability)}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Vị trí:</strong> {formData.location || 'Chưa cập nhật'}</p>
                <p><strong>Mức lương:</strong> {formData.hourlyRate.toLocaleString('vi-VN')} VND/giờ</p>
                <p><strong>Kỹ năng:</strong> {formData.skills.length} kỹ năng</p>
                <p><strong>Ngôn ngữ:</strong> {formData.languages.length} ngôn ngữ</p>
              </div>
              
              {formData.bio && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Giới thiệu:</p>
                  <p className="text-xs text-gray-600 line-clamp-4">{formData.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Mẹo cải thiện hồ sơ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-600">
              <p>• Sử dụng ảnh đại diện chuyên nghiệp</p>
              <p>• Viết mô tả chi tiết về kinh nghiệm</p>
              <p>• Thêm các kỹ năng liên quan</p>
              <p>• Cập nhật thường xuyên</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}