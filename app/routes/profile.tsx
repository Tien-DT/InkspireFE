import { useState } from 'react'
import { Mail, Phone, MapPin, Star, DollarSign, Clock, Edit, Plus, Image, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

// Mock data
const mockUserProfile = {
  name: 'Nguyễn Văn An',
  title: 'Senior Logo & Brand Identity Designer',
  avatar: '',
  rating: 4.8,
  reviewCount: 127,
  location: 'Hà Nội, Việt Nam',
  email: 'nguyenvanan@gmail.com',
  phone: '0912345678',
  bio: 'Tôi là một designer chuyên nghiệp với hơn 5 năm kinh nghiệm trong lĩnh vực thiết kế logo và brand identity. Đã từng làm việc với nhiều startup cũng như các thương hiệu lớn. Tôi tin vào việc truyền tải thông điệp thương hiệu mạnh mẽ thông qua những thiết kế đơn giản nhưng ấn tượng và ghi nhớ. Chuyên môn của tôi bao gồm thiết kế logo, xây dựng bộ nhận diện thương hiệu và các tài liệu marketing.',
  priceRange: '500.000 - 800.000 VND',
  status: '6 dự án đã nhận',
  skills: [
    'Logo Design',
    'Brand Identity',
    'Adobe Illustrator',
    'Figma',
    'Photoshop',
    'Typography',
    'Color Theory',
    'Vector Graphics'
  ],
  portfolio: [
    {
      id: 1,
      title: 'Logo thiết kế cho startup AI',
      category: 'Logo Design',
      description: 'Thiết kế logo hiện đại cho các công ty công nghệ AI',
      image: ''
    },
    {
      id: 2,
      title: 'Brand identity cho chuỗi cafe',
      category: 'Brand Identity',
      description: 'Hệ thống nhận diện thương hiệu hoàn chỉnh cho chuỗi cafe',
      image: ''
    },
    {
      id: 3,
      title: 'Logo cho ứng dụng fintech',
      category: 'Logo Design',
      description: 'Logo tối giản cho ứng dụng tài chính',
      image: ''
    },
    {
      id: 4,
      title: 'Thiết kế logo thương mại điện tử',
      category: 'Logo Design',
      description: 'Logo năng động cho nền tảng thương mại điện tử',
      image: ''
    }
  ]
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'intro' | 'portfolio' | 'reviews'>('intro')
  const [hasProfile, setHasProfile] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [profileData, setProfileData] = useState(mockUserProfile)
  const [portfolioItems, setPortfolioItems] = useState(mockUserProfile.portfolio)
  const [editingTab, setEditingTab] = useState<'profile' | 'portfolio'>('profile')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditDialogOpen(false)
    setHasProfile(true)
  }

  const handleAddPortfolio = () => {
    setPortfolioItems([...portfolioItems, { id: Date.now(), title: '', category: '', description: '', image: '' }])
  }

  const handleRemovePortfolio = (id: number) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
  }

  const handleUpdatePortfolio = (id: number, field: string, value: string) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSavePortfolio = () => {
    setProfileData({ ...profileData, portfolio: portfolioItems })
    setIsEditDialogOpen(false)
  }

  if (!hasProfile) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
        <div className='container mx-auto px-4 py-8'>
          <Card className='max-w-2xl mx-auto'>
            <CardContent className='py-16 text-center'>
              <div className='mb-6'>
                <div className='h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto flex items-center justify-center'>
                  <Plus className='h-12 w-12 text-white' />
                </div>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>Chưa có profile</h2>
              <p className='text-gray-600 mb-8 max-w-md mx-auto'>
                Hãy tạo profile để giới thiệu bản thân, kỹ năng và portfolio của bạn với khách hàng tiềm năng.
              </p>
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                size='lg'
              >
                <Plus className='h-5 w-5 mr-2' />
                Tạo profile ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-end mb-4'>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
          >
            <Edit className='h-4 w-4 mr-2' />
            Chỉnh sửa profile
          </Button>
        </div>

        <div className='grid lg:grid-cols-[350px_1fr] gap-6'>
          <div className='space-y-6'>
            <Card className='overflow-hidden'>
              <CardContent className='p-0'>
                <div className='bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-8 text-center'>
                  <div className='flex justify-center mb-4'>
                    <Avatar className='h-32 w-32 border-4 border-white shadow-xl'>
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-600 text-white text-4xl font-bold'>
                        {profileData.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h1 className='text-2xl font-bold text-white mb-1'>{profileData.name}</h1>
                  <p className='text-blue-100 text-sm'>{profileData.title}</p>
                  <div className='flex items-center justify-center gap-1 mt-3'>
                    <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    <span className='text-white font-bold text-lg'>{profileData.rating}</span>
                    <span className='text-blue-100 text-sm'>({profileData.reviewCount} đánh giá)</span>
                  </div>
                </div>
                <div className='p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin liên hệ</h2>
                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <MapPin className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm text-gray-500'>Địa điểm</p>
                        <p className='text-gray-900 font-medium'>{profileData.location}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Mail className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm text-gray-500'>Email</p>
                        <p className='text-gray-900 font-medium'>{profileData.email}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Phone className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm text-gray-500'>Số điện thoại</p>
                        <p className='text-gray-900 font-medium'>{profileData.phone}</p>
                      </div>
                    </div>
                  </div>
                  <Button className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white mt-6'>
                    <Mail className='h-4 w-4 mr-2' />
                    Gửi tin nhắn
                  </Button>
                  <Button variant='outline' className='w-full border-2'>
                    Xem hồ sơ đầy đủ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900'>Mức giá & Sẵn sàng</h3>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <DollarSign className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-sm text-gray-500'>Mức giá theo giờ</p>
                    <p className='text-gray-900 font-bold text-lg'>{profileData.priceRange}</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Clock className='h-5 w-5 text-blue-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-sm text-gray-500'>Tình trạng</p>
                    <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-1'>
                      {profileData.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900'>Kỹ năng</h3>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {profileData.skills.map((skill, index) => {
                    const colors = [
                      'bg-blue-100 text-blue-700',
                      'bg-purple-100 text-purple-700',
                      'bg-orange-100 text-orange-700',
                      'bg-pink-100 text-pink-700',
                      'bg-green-100 text-green-700',
                      'bg-yellow-100 text-yellow-700',
                      'bg-red-100 text-red-700',
                      'bg-indigo-100 text-indigo-700'
                    ]
                    return (
                      <Badge key={skill} className={`${colors[index % colors.length]} hover:opacity-80 font-medium`}>
                        {skill}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardContent className='p-0'>
                <div className='flex border-b'>
                  {['intro', 'portfolio', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                      {tab === 'intro' ? 'Giới thiệu' : tab === 'portfolio' ? 'Portfolio' : 'Lịch sử & Đánh giá'}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {activeTab === 'intro' && (
              <Card>
                <CardHeader>
                  <h2 className='text-2xl font-bold text-gray-900'>Giới thiệu</h2>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-line'>{profileData.bio}</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'portfolio' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-900'>Portfolio</h2>
                </div>
                <div className='grid md:grid-cols-2 gap-6'>
                  {profileData.portfolio.map((item) => (
                    <Card key={item.id} className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'>
                      <div className='aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center'>
                        <div className='text-center p-8'>
                          <div className='text-6xl mb-2'>���</div>
                          <p className='text-sm text-gray-500'>{item.category}</p>
                        </div>
                      </div>
                      <CardContent className='p-4'>
                        <div className='flex items-start justify-between mb-2'>
                          <h3 className='font-bold text-gray-900'>{item.title}</h3>
                          <Badge variant='outline' className='text-xs'>
                            {item.category}
                          </Badge>
                        </div>
                        <p className='text-sm text-gray-600'>{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <Card>
                <CardHeader>
                  <h2 className='text-2xl font-bold text-gray-900'>Lịch sử làm việc</h2>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12'>
                    <Clock className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có lịch sử</h3>
                    <p className='text-gray-600'>Lịch sử dự án và đánh giá sẽ được hiển thị tại đây.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='!max-w-[85vw] !w-[85vw] h-[90vh] bg-white flex flex-col p-0 gap-0 overflow-hidden'>
            <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0 bg-white'>
              <DialogTitle className='text-2xl'>{hasProfile ? 'Chỉnh sửa profile' : 'Tạo profile mới'}</DialogTitle>
              <DialogDescription>
                {hasProfile
                  ? 'Cập nhật thông tin cá nhân, chuyên môn và portfolio của bạn'
                  : 'Điền thông tin để tạo profile chuyên nghiệp'}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={editingTab}
              onValueChange={(v) => setEditingTab(v as any)}
              className='flex-1 flex flex-col min-h-0 overflow-hidden'
            >
              <div className='px-6 pt-4 pb-2 shrink-0 bg-white border-b'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='profile'>Thông tin Profile</TabsTrigger>
                  <TabsTrigger value='portfolio'>Portfolio</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='profile' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
                <form onSubmit={handleSaveProfile} className='space-y-6'>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Thông tin cơ bản</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='name'>Họ và tên *</Label>
                        <Input
                          id='name'
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor='title'>Chức danh *</Label>
                        <Input
                          id='title'
                          value={profileData.title}
                          onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor='bio'>Giới thiệu bản thân *</Label>
                      <Textarea
                        id='bio'
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Thông tin liên hệ</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='email'>Email *</Label>
                        <Input
                          id='email'
                          type='email'
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor='phone'>Số điện thoại</Label>
                        <Input
                          id='phone'
                          type='tel'
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor='location'>Địa điểm</Label>
                      <Input
                        id='location'
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Mức giá & Trạng thái</h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='price'>Mức giá theo giờ</Label>
                        <Input
                          id='price'
                          value={profileData.priceRange}
                          onChange={(e) => setProfileData({ ...profileData, priceRange: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor='status'>Tình trạng công việc</Label>
                        <Input
                          id='status'
                          value={profileData.status}
                          onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold'>Kỹ năng</h3>
                    <div>
                      <Label htmlFor='skills'>Danh sách kỹ năng (phân cách bằng dấu phẩy)</Label>
                      <Textarea
                        id='skills'
                        value={profileData.skills.join(', ')}
                        onChange={(e) =>
                          setProfileData({ ...profileData, skills: e.target.value.split(',').map((s) => s.trim()) })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className='flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white'>
                    <Button type='button' variant='outline' onClick={() => setIsEditDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button
                      type='submit'
                      className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    >
                      {hasProfile ? 'Lưu thay đổi' : 'Tạo profile'}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value='portfolio' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
                <div className='space-y-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900'>Portfolio của bạn</h3>
                      <p className='text-sm text-gray-600 mt-1'>Thêm và quản lý các dự án của bạn</p>
                    </div>
                    <Button
                      onClick={handleAddPortfolio}
                      className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Thêm dự án mới
                    </Button>
                  </div>
                  {portfolioItems.length === 0 ? (
                    <div className='text-center py-12 border-2 border-dashed border-gray-300 rounded-lg'>
                      <Image className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có dự án nào</h3>
                      <p className='text-gray-600 mb-4'>Thêm dự án đầu tiên để showcase portfolio của bạn</p>
                      <Button onClick={handleAddPortfolio} variant='outline' className='border-2'>
                        <Plus className='h-4 w-4 mr-2' />
                        Thêm dự án mới
                      </Button>
                    </div>
                  ) : (
                    <div className='grid md:grid-cols-2 gap-6'>
                      {portfolioItems.map((item) => (
                        <Card key={item.id} className='overflow-hidden'>
                          <div className='aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative group'>
                            <Image className='h-12 w-12 text-gray-400' />
                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                              <Button size='sm' variant='secondary'>
                                <Eye className='h-4 w-4 mr-1' />
                                Xem
                              </Button>
                            </div>
                          </div>
                          <CardContent className='p-4 space-y-3'>
                            <div>
                              <Label htmlFor={`title-${item.id}`} className='text-xs'>
                                Tên dự án
                              </Label>
                              <Input
                                id={`title-${item.id}`}
                                value={item.title}
                                onChange={(e) => handleUpdatePortfolio(item.id, 'title', e.target.value)}
                                placeholder='Nhập tên dự án'
                                className='mt-1'
                              />
                            </div>
                            <div>
                              <Label htmlFor={`category-${item.id}`} className='text-xs'>
                                Danh mục
                              </Label>
                              <Input
                                id={`category-${item.id}`}
                                value={item.category}
                                onChange={(e) => handleUpdatePortfolio(item.id, 'category', e.target.value)}
                                placeholder='e.g. Logo Design'
                                className='mt-1'
                              />
                            </div>
                            <div>
                              <Label htmlFor={`description-${item.id}`} className='text-xs'>
                                Mô tả
                              </Label>
                              <Textarea
                                id={`description-${item.id}`}
                                value={item.description}
                                onChange={(e) => handleUpdatePortfolio(item.id, 'description', e.target.value)}
                                placeholder='Mô tả ngắn về dự án'
                                rows={2}
                                className='mt-1'
                              />
                            </div>
                            <div className='flex gap-2 pt-2'>
                              <Button variant='outline' size='sm' className='flex-1'>
                                <Image className='h-4 w-4 mr-1' />
                                Upload ảnh
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                onClick={() => handleRemovePortfolio(item.id)}
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <div className='flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white'>
                    <Button type='button' variant='outline' onClick={() => setIsEditDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSavePortfolio}
                      className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    >
                      Lưu Portfolio
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
