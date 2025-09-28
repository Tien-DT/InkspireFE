import { Clock, Eye, Filter, Heart, Search, Star, Users } from 'lucide-react'
import PaginationDemo from '~/components/Pagination'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export default function JobsFreelancer() {
  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Left Sidebar - Filters */}
        <div className='lg:col-span-1'>
          <Card className='sticky top-5'>
            <CardContent className='p-6'>
              <div className='flex items-center mb-4'>
                <Filter className='h-5 w-5 mr-2' />
                <h3 className='font-semibold'>Bộ lọc tìm kiếm</h3>
              </div>

              <div className='space-y-6'>
                {/* Keywords */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Từ khóa</label>
                  <Input placeholder='' className='w-full' />
                </div>

                {/* Category */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Danh mục</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Tất cả danh mục' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Tất cả danh mục</SelectItem>
                      <SelectItem value='design'>Thiết kế</SelectItem>
                      <SelectItem value='development'>Phát triển</SelectItem>
                      <SelectItem value='marketing'>Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Ngân sách (VND)</label>
                </div>

                {/* Timeline */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Thời hạn</label>
                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='under-1-week' />
                      <label htmlFor='under-1-week' className='text-sm'>
                        Dưới 1 tuần
                      </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='1-4-weeks' />
                      <label htmlFor='1-4-weeks' className='text-sm'>
                        1-4 tuần
                      </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='1-3-months' />
                      <label htmlFor='1-3-months' className='text-sm'>
                        1-3 tháng
                      </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='over-3-months' />
                      <label htmlFor='over-3-months' className='text-sm'>
                        Trên 3 tháng
                      </label>
                    </div>
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Cấp độ kinh nghiệm</label>
                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='entry-level' />
                      <label htmlFor='entry-level' className='text-sm'>
                        Mới bắt đầu
                      </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='intermediate' />
                      <label htmlFor='intermediate' className='text-sm'>
                        Trung cấp
                      </label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='expert' />
                      <label htmlFor='expert' className='text-sm'>
                        Chuyên gia
                      </label>
                    </div>
                  </div>
                </div>

                {/* Apply Filters Button */}
                <Button className='w-full bg-gray-800 hover:bg-gray-900 text-white'>
                  <Search className='h-4 w-4 mr-2' />
                  Áp dụng bộ lọc
                </Button>

                {/* Clear Filters */}
                <button className='w-full text-center text-blue-600 hover:text-blue-800 text-sm'>Xóa bộ lọc</button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Job Listings */}
        <div className='lg:col-span-2'>
          <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-gray-900'>Tìm thấy 4 công việc phù hợp</h1>
            <div className='flex items-center justify-between mt-4'>
              <Select>
                <SelectTrigger className='w-48 bg-white'>
                  <SelectValue placeholder='Sắp xếp theo' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>Mới nhất</SelectItem>
                  <SelectItem value='budget-high'>Ngân sách cao</SelectItem>
                  <SelectItem value='budget-low'>Ngân sách thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Job Card 1 */}
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900 mr-3'>
                        Thiết kế logo cho startup công nghệ AI
                      </h3>
                      <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
                        HOT HIT
                      </Badge>
                      <Heart className='h-5 w-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500' />
                    </div>
                    <div className='flex items-center text-sm text-gray-600 mb-3'>
                      <span className='mr-4'>Techviet Solutions</span>
                      <div className='flex items-center mr-4'>
                        <Star className='h-4 w-4 text-yellow-400 mr-1' />
                        <span>4.9 (23 đánh giá)</span>
                      </div>
                    </div>
                    <p className='text-gray-700 mb-4'>
                      Chúng tôi cần thiết kế logo chuyên nghiệp cho startup công nghệ AI. Logo cần thể hiện sự hiện đại,
                      đáng tin cậy và sáng tạo.
                    </p>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      <Badge variant='outline' className='text-blue-600 border-blue-600'>
                        Logo Design
                      </Badge>
                      <Badge variant='outline' className='text-purple-600 border-purple-600'>
                        Branding
                      </Badge>
                      <Badge variant='outline' className='text-orange-600 border-orange-600'>
                        Adobe Illustrator
                      </Badge>
                      <Badge variant='outline' className='text-pink-600 border-pink-600'>
                        Photoshop
                      </Badge>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 space-x-6'>
                      <div className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1' />
                        <span>Hạn: 5 ngày</span>
                      </div>
                      <div className='flex items-center'>
                        <Users className='h-4 w-4 mr-1' />
                        <span>12-49 xuất</span>
                      </div>
                      <div className='flex items-center'>
                        <span>Đăng 2 giờ trước</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right ml-6'>
                    <div className='text-2xl font-bold text-green-600 mb-2'>3-5M VND</div>
                    <div className='text-sm text-gray-600 mb-4'>Giá cố định</div>
                    <div className='flex items-center text-yellow-400 mb-4'>
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                    </div>
                    <div className='text-sm text-gray-600 mb-4'>Cấp độ: Trung cấp</div>
                    <Button className='w-full bg-black hover:bg-gray-800 text-white mb-2'>Ứng tuyển ngay</Button>
                    <button className='w-full text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center'>
                      <Eye className='h-4 w-4 mr-1' />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Card 2 */}
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900 mr-3'>
                        Thiết kế UI/UX cho ứng dụng mobile e-commerce
                      </h3>
                      <Badge variant='secondary' className='bg-red-100 text-red-800'>
                        Gấp
                      </Badge>
                      <Heart className='h-5 w-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500' />
                    </div>
                    <div className='flex items-center text-sm text-gray-600 mb-3'>
                      <span className='mr-4'>Digital Commerce Co.</span>
                      <div className='flex items-center mr-4'>
                        <Star className='h-4 w-4 text-yellow-400 mr-1' />
                        <span>4.7 (45 đánh giá)</span>
                      </div>
                    </div>
                    <p className='text-gray-700 mb-4'>
                      Cần thiết kế giao diện người dùng cho ứng dụng mua sắm trực tuyến. Bao gồm wireframe, mockup và
                      prototype tương tác.
                    </p>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      <Badge variant='outline' className='text-green-600 border-green-600'>
                        UI/UX
                      </Badge>
                      <Badge variant='outline' className='text-blue-600 border-blue-600'>
                        Mobile Design
                      </Badge>
                      <Badge variant='outline' className='text-purple-600 border-purple-600'>
                        Figma
                      </Badge>
                      <Badge variant='outline' className='text-orange-600 border-orange-600'>
                        Prototyping
                      </Badge>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 space-x-6'>
                      <div className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1' />
                        <span>Hạn: 2 tuần</span>
                      </div>
                      <div className='flex items-center'>
                        <Users className='h-4 w-4 mr-1' />
                        <span>5-15 xuất</span>
                      </div>
                      <div className='flex items-center'>
                        <span>Đăng 5 giờ trước</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right ml-6'>
                    <div className='text-2xl font-bold text-orange-600'>Thương Lượng</div>
                    <div className='text-sm text-gray-600 mb-4'>Giá hấp dẫn</div>
                    <div className='flex items-center text-yellow-400 mb-4'>
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                    </div>
                    <div className='text-sm text-gray-600 mb-4'>Cấp độ: Chuyên gia</div>
                    <Button className='w-full bg-black hover:bg-gray-800 text-white mb-2'>Ứng tuyển ngay</Button>
                    <button className='w-full text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center'>
                      <Eye className='h-4 w-4 mr-1' />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Card 3 */}
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900 mr-3'>
                        Thiết kế brochure và poster cho sự kiện
                      </h3>
                      <Heart className='h-5 w-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500' />
                    </div>
                    <div className='flex items-center text-sm text-gray-600 mb-3'>
                      <span className='mr-4'>Event Management Pro</span>
                      <div className='flex items-center mr-4'>
                        <Star className='h-4 w-4 text-yellow-400 mr-1' />
                        <span>4.8 (67 đánh giá)</span>
                      </div>
                    </div>
                    <p className='text-gray-700 mb-4'>
                      Cần thiết kế brochure và poster cho sự kiện công nghệ lớn. Thiết kế cần thể hiện tính chuyên
                      nghiệp và thu hút.
                    </p>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      <Badge variant='outline' className='text-orange-600 border-orange-600'>
                        Print Design
                      </Badge>
                      <Badge variant='outline' className='text-purple-600 border-purple-600'>
                        Poster
                      </Badge>
                      <Badge variant='outline' className='text-blue-600 border-blue-600'>
                        InDesign
                      </Badge>
                      <Badge variant='outline' className='text-pink-600 border-pink-600'>
                        Marketing
                      </Badge>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 space-x-6'>
                      <div className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1' />
                        <span>Hạn: 1 tuần</span>
                      </div>
                      <div className='flex items-center'>
                        <Users className='h-4 w-4 mr-1' />
                        <span>10-30 xuất</span>
                      </div>
                      <div className='flex items-center'>
                        <span>Đăng 1 ngày trước</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right ml-6'>
                    <div className='text-2xl font-bold text-green-600 mb-2'>4-7M VND</div>
                    <div className='text-sm text-gray-600 mb-4'>Giá cố định</div>
                    <div className='flex items-center text-yellow-400 mb-4'>
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                    </div>
                    <div className='text-sm text-gray-600 mb-4'>Cấp độ: Trung cấp</div>
                    <Button className='w-full bg-black hover:bg-gray-800 text-white mb-2'>Ứng tuyển ngay</Button>
                    <button className='w-full text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center'>
                      <Eye className='h-4 w-4 mr-1' />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Card 4 */}
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <div className='flex items-center mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900 mr-3'>
                        Viết kịch bản quảng cáo bánh quy Oreo
                      </h3>
                      <Heart className='h-5 w-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500' />
                    </div>
                    <div className='flex items-center text-sm text-gray-600 mb-3'>
                      <span className='mr-4'>Green Food Vietnam</span>
                      <div className='flex items-center mr-4'>
                        <Star className='h-4 w-4 text-yellow-400 mr-1' />
                        <span>4.6 (34 đánh giá)</span>
                      </div>
                    </div>
                    <p className='text-gray-700 mb-4'>
                      Viết kịch bản quảng cáo về bánh quy Oreo. Kịch bản cần thu hút và mang tính chuyên nghiệp.
                    </p>
                    <div className='flex flex-wrap gap-2 mb-4'>
                      <Badge variant='outline' className='text-blue-600 border-blue-600'>
                        Content Writer
                      </Badge>
                    </div>
                    <div className='flex items-center text-sm text-gray-600 space-x-6'>
                      <div className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1' />
                        <span>Hạn: 5 ngày</span>
                      </div>
                      <div className='flex items-center'>
                        <Users className='h-4 w-4 mr-1' />
                        <span>5-15 xuất</span>
                      </div>
                      <div className='flex items-center'>
                        <span>Đăng 3 ngày trước</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right ml-6'>
                    <div className='text-2xl font-bold text-green-600 mb-2'>8-12M VND</div>
                    <div className='text-sm text-gray-600 mb-4'>Giá cố định</div>
                    <div className='flex items-center text-yellow-400 mb-4'>
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                      <Star className='h-4 w-4' />
                    </div>
                    <div className='text-sm text-gray-600 mb-4'>Cấp độ: Trung cấp</div>
                    <Button className='w-full bg-black hover:bg-gray-800 text-white mb-2'>Ứng tuyển ngay</Button>
                    <button className='w-full text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center'>
                      <Eye className='h-4 w-4 mr-1' />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-center mt-8 space-x-2'>
            <PaginationDemo />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='lg:col-span-1'>
          <div className='space-y-6'>
            {/* Ad Space or Featured Content */}
            <Card>
              <CardContent className='p-6 text-center'>
                <div className='text-gray-400 text-sm'>Quảng cáo</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
