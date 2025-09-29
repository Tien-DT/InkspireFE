import { useState } from 'react'
import { Calendar, Facebook, Github, Linkedin, MapPin, Star } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Progress } from '~/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'

export default function FreelancerProfile() {
  const [profileCompletion] = useState(100)

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Profile Header Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Avatar and basic info */}
            <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
              <Avatar className="w-[80px] h-[80px] mb-4">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="text-2xl">NA</AvatarFallback>
              </Avatar>
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Nguyễn Văn An</h1>
                <p className="text-gray-600 mb-2">Content Writer | 5 năm kinh nghiệm</p>
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>TP. Hồ Chí Minh, Vietnam</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Tham gia từ tháng 3, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile completion */}
            <div className="flex-1 lg:ml-auto lg:max-w-[140px]">
              <div className="text-center lg:text-right">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Hoàn thiện hồ sơ</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Progress value={profileCompletion} className="flex-1" />
                  <span className="text-sm text-gray-600 font-medium">100%</span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <span>Chỉnh sửa</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4">
          <Tabs defaultValue="info" className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:flex lg:space-x-2">
              <TabsTrigger value="info" className="text-center">Thông tin</TabsTrigger>
              <TabsTrigger value="security">Bảo mật</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
              <TabsTrigger value="privacy">Quyền riêng tư</TabsTrigger>
              <TabsTrigger value="account">Tài khoản</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                    <p className="text-sm text-gray-600 mb-6">Cập nhật thông tin cơ bản của bạn</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Họ</Label>
                          <Input id="firstName" defaultValue="Nguyễn" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Tên</Label>
                          <Input id="lastName" defaultValue="Văn An" className="mt-1" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="nguyen.van.an@gmail.com" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" defaultValue="+84 123 456 789" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Giới thiệu</Label>
                        <Textarea 
                          id="bio" 
                          defaultValue="Tôi là một Content Writer có 5 năm kinh nghiệm trong lĩnh vực sáng tạo nội dung..."
                          className="mt-1 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công việc</h3>
                    <p className="text-sm text-gray-600 mb-6">Thông tin về công ty và vị trí làm việc</p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company">Công ty</Label>
                        <Input id="company" defaultValue="Freelancer" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="position">Vị trí</Label>
                        <Input id="position" defaultValue="Content Writer" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://nguyenvanan.portfolio.com" className="mt-1" />
                      </div>
                      
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input id="linkedin" defaultValue="https://linkedin.com/in/nguyenvanan" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Address Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ</h3>
                  <p className="text-sm text-gray-600 mb-6">Thông tin địa chỉ liên hệ</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input id="address" defaultValue="123 Đường ABC, Quận 1" className="mt-1" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Thành phố</Label>
                        <Input id="city" defaultValue="TP. Hồ Chí Minh" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="country">Quốc gia</Label>
                        <Select defaultValue="vietnam">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vietnam">Vietnam</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài khoản liên kết</h3>
                  <p className="text-sm text-gray-600 mb-6">Quản lý các tài khoản mạng xã hội đã liên kết</p>
                  
                  <div className="space-y-4">
                    {/* Google Account */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <Github className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-gray-600">nguyen.van.an@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Đã liên kết
                        </Badge>
                        <Button variant="outline" size="sm">Hủy liên kết</Button>
                      </div>
                    </div>

                    {/* Facebook Account */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <Facebook className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Liên kết</Button>
                    </div>

                    {/* LinkedIn Account */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">LinkedIn</p>
                          <p className="text-sm text-gray-600">nguyen.van.an@company.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Đã liên kết
                        </Badge>
                        <Button variant="outline" size="sm">Hủy liên kết</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt bảo mật</h3>
                  <p className="text-sm text-gray-600 mb-6">Quản lý mật khẩu và bảo mật tài khoản</p>
                  {/* Security settings content would go here */}
                  <div className="text-center py-8 text-gray-500">
                    Nội dung cài đặt bảo mật sẽ được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs placeholders */}
            <TabsContent value="notifications">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt thông báo</h3>
                  <div className="text-center py-8 text-gray-500">
                    Nội dung cài đặt thông báo sẽ được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt quyền riêng tư</h3>
                  <div className="text-center py-8 text-gray-500">
                    Nội dung cài đặt quyền riêng tư sẽ được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt tài khoản</h3>
                  <div className="text-center py-8 text-gray-500">
                    Nội dung cài đặt tài khoản sẽ được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử hoạt động</h3>
                  <div className="text-center py-8 text-gray-500">
                    Nội dung lịch sử hoạt động sẽ được phát triển...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}