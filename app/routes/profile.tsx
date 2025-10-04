import { useState } from 'react'
import { Mail, Phone, MapPin, Star, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'

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
      image: '/portfolio/ai-startup.jpg'
    },
    {
      id: 2,
      title: 'Brand identity cho chuỗi cafe',
      category: 'Brand Identity',
      description: 'Hệ thống nhận diện thương hiệu hoàn chỉnh cho chuỗi cafe',
      image: '/portfolio/cafe-brand.jpg'
    },
    {
      id: 3,
      title: 'Logo cho ứng dụng fintech',
      category: 'Logo Design',
      description: 'Logo tối giản cho ứng dụng tài chính',
      image: '/portfolio/fintech-logo.jpg'
    },
    {
      id: 4,
      title: 'Thiết kế logo thương mại điện tử',
      category: 'Logo Design',
      description: 'Logo năng động cho nền tảng thương mại điện tử',
      image: '/portfolio/ecommerce-logo.jpg'
    }
  ]
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'intro' | 'portfolio' | 'reviews'>('intro')

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-[350px_1fr] gap-6'>
          {/* Left Sidebar - User Info Card */}
          <div className='space-y-6'>
            <Card className='overflow-hidden'>
              <CardContent className='p-0'>
                {/* Avatar Section */}
                <div className='bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-8 text-center'>
                  <div className='flex justify-center mb-4'>
                    <Avatar className='h-32 w-32 border-4 border-white shadow-xl'>
                      <AvatarImage src={mockUserProfile.avatar} alt={mockUserProfile.name} />
                      <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-600 text-white text-4xl font-bold'>
                        {mockUserProfile.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h1 className='text-2xl font-bold text-white mb-1'>{mockUserProfile.name}</h1>
                  <p className='text-blue-100 text-sm'>{mockUserProfile.title}</p>
                  <div className='flex items-center justify-center gap-1 mt-3'>
                    <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    <span className='text-white font-bold text-lg'>{mockUserProfile.rating}</span>
                    <span className='text-blue-100 text-sm'>({mockUserProfile.reviewCount} đánh giá)</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className='p-6 space-y-4'>
                  <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin liên hệ</h2>

                  <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                      <MapPin className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm text-gray-500'>Địa điểm</p>
                        <p className='text-gray-900 font-medium'>{mockUserProfile.location}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <Mail className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm text-gray-500'>Email</p>
                        <p className='text-gray-900 font-medium'>{mockUserProfile.email}</p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <Phone className='h-5 w-5 text-gray-400 mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm text-gray-500'>Số điện thoại</p>
                        <p className='text-gray-900 font-medium'>{mockUserProfile.phone}</p>
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

            {/* Pricing & Stats Card */}
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900'>Mức giá & Sẵn sàng</h3>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <DollarSign className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-sm text-gray-500'>Mức giá theo giờ</p>
                    <p className='text-gray-900 font-bold text-lg'>{mockUserProfile.priceRange}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Clock className='h-5 w-5 text-blue-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-sm text-gray-500'>Tình trạng</p>
                    <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-1'>
                      {mockUserProfile.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold text-gray-900'>Kỹ năng</h3>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {mockUserProfile.skills.map((skill, index) => {
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

          {/* Right Content Area */}
          <div className='space-y-6'>
            {/* Tabs */}
            <Card>
              <CardContent className='p-0'>
                <div className='flex border-b'>
                  <button
                    onClick={() => setActiveTab('intro')}
                    className={`flex-1 py-4 px-6 font-medium transition-colors ${
                      activeTab === 'intro'
                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Giới thiệu
                  </button>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`flex-1 py-4 px-6 font-medium transition-colors ${
                      activeTab === 'portfolio'
                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 py-4 px-6 font-medium transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Lịch sử & Đánh giá
                  </button>
                  <button className='flex-1 py-4 px-6 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors'>
                    Năng lực & Kinh nghiệm
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Tab Content */}
            {activeTab === 'intro' && (
              <Card>
                <CardHeader>
                  <h2 className='text-2xl font-bold text-gray-900'>Giới thiệu</h2>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 leading-relaxed whitespace-pre-line'>{mockUserProfile.bio}</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'portfolio' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-900'>Portfolio</h2>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-500'>Lưu trữ</span>
                    <Button variant='outline' size='sm'>
                      Tất cả
                    </Button>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  {mockUserProfile.portfolio.map((item) => (
                    <Card key={item.id} className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'>
                      <div className='aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center'>
                        <div className='text-center p-8'>
                          <div className='text-6xl mb-2'>🎨</div>
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
      </div>
    </div>
  )
}
