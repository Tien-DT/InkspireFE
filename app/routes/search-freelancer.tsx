import { Grid3X3, List, Star } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

export default function SearchFreelancer() {
  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-teal-500 mb-2'>Tìm Kiếm Freelancer</h1>
        <p className='text-gray-600'>Khám phá hàng nghìn freelancer tài năng cho dự án của bạn</p>
      </div>

      <Card className='mb-8'>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Tìm kiếm</label>
              <Input placeholder='' className='w-full' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Kỹ năng</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả kỹ năng' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả kỹ năng</SelectItem>
                  <SelectItem value='react'>React</SelectItem>
                  <SelectItem value='ui-design'>UI Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Xếp hạng</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  <SelectItem value='5-star'>5 sao</SelectItem>
                  <SelectItem value='4-star'>4+ sao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Vị trí</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Tất cả' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tất cả</SelectItem>
                  <SelectItem value='hanoi'>Hà Nội</SelectItem>
                  <SelectItem value='hcm'>TP.HCM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Giá</label>
            <div className='relative'>
              <div className='flex items-center space-x-4'>
                <span className='text-sm text-gray-600'>$10</span>
                <div className='flex-1 relative'>
                  <div className='w-full h-2 bg-gray-200 rounded-full'>
                    <div className='h-2 bg-gray-800 rounded-full' style={{ width: '60%' }}></div>
                  </div>
                  <div className='absolute top-0 left-0 w-4 h-4 bg-gray-800 rounded-full transform -translate-y-1'></div>
                  <div className='absolute top-0 right-0 w-4 h-4 bg-gray-300 rounded-full transform -translate-y-1'></div>
                </div>
                <span className='text-sm text-gray-600'>$1000/h</span>
              </div>
            </div>
          </div>

          {/* Filter Tags */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                React ×
              </Badge>
              <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
                UI Design ×
              </Badge>
              <button className='text-sm text-blue-600 hover:text-blue-800'>Xóa tất cả bộ lọc</button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-900'>Tìm thấy 2,847 freelancer</h2>
        <div className='flex items-center space-x-4'>
          <Select>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Phù hợp nhất' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='relevant'>Phù hợp nhất</SelectItem>
              <SelectItem value='rating'>Đánh giá cao nhất</SelectItem>
              <SelectItem value='price-low'>Giá thấp nhất</SelectItem>
              <SelectItem value='price-high'>Giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
          <div className='flex items-center space-x-2'>
            <Button variant='default' size='sm' className='bg-blue-600 text-white'>
              <Grid3X3 className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='sm'>
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Freelancer Card 1 */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4'></div>
            <h3 className='font-semibold text-gray-900 mb-1'>Nguyễn Minh Anh</h3>
            <p className='text-sm text-gray-600 mb-3'>UI/UX Designer</p>
            <div className='flex items-center justify-center mb-3'>
              <div className='flex items-center text-yellow-400'>
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
              </div>
              <span className='text-sm text-gray-600 ml-2'>5 (127)</span>
            </div>
            <div className='flex flex-wrap gap-1 justify-center mb-4'>
              <Badge variant='outline' className='text-xs text-blue-600 border-blue-600'>
                Figma
              </Badge>
              <Badge variant='outline' className='text-xs text-purple-600 border-purple-600'>
                Adobe XD
              </Badge>
              <Badge variant='outline' className='text-xs text-pink-600 border-pink-600'>
                Sketch
              </Badge>
            </div>
            <div className='text-lg font-bold text-gray-900 mb-4'>45.000/giờ</div>
            <Button className='w-full bg-black hover:bg-gray-800 text-white'>Mời Làm Việc</Button>
          </CardContent>
        </Card>

        {/* Freelancer Card 2 */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4'></div>
            <h3 className='font-semibold text-gray-900 mb-1'>Trần Văn Hưng</h3>
            <p className='text-sm text-gray-600 mb-3'>Content Writer</p>
            <div className='flex items-center justify-center mb-3'>
              <div className='flex items-center text-yellow-400'>
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4' />
              </div>
              <span className='text-sm text-gray-600 ml-2'>4.8 (89)</span>
            </div>
            <div className='flex flex-wrap gap-1 justify-center mb-4'>
              <Badge variant='outline' className='text-xs text-red-600 border-red-600'>
                SEO
              </Badge>
              <Badge variant='outline' className='text-xs text-blue-600 border-blue-600'>
                Facebook Ads
              </Badge>
              <Badge variant='outline' className='text-xs text-green-600 border-green-600'>
                Content
              </Badge>
            </div>
            <div className='text-lg font-bold text-gray-900 mb-4'>30.000/giờ</div>
            <Button className='w-full bg-black hover:bg-gray-800 text-white'>Mời Làm Việc</Button>
          </CardContent>
        </Card>

        {/* Freelancer Card 3 */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4'></div>
            <h3 className='font-semibold text-gray-900 mb-1'>Lê Thị Mai</h3>
            <p className='text-sm text-gray-600 mb-3'>Digital Marketing</p>
            <div className='flex items-center justify-center mb-3'>
              <div className='flex items-center text-yellow-400'>
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
              </div>
              <span className='text-sm text-gray-600 ml-2'>4.9 (156)</span>
            </div>
            <div className='flex flex-wrap gap-1 justify-center mb-4'>
              <Badge variant='outline' className='text-xs text-red-600 border-red-600'>
                SEO
              </Badge>
              <Badge variant='outline' className='text-xs text-blue-600 border-blue-600'>
                Facebook Ads
              </Badge>
              <Badge variant='outline' className='text-xs text-green-600 border-green-600'>
                Content
              </Badge>
            </div>
            <div className='text-lg font-bold text-gray-900 mb-4'>35.000/giờ</div>
            <Button className='w-full bg-black hover:bg-gray-800 text-white'>Mời Làm Việc</Button>
          </CardContent>
        </Card>

        {/* Freelancer Card 4 */}
        <Card className='hover:shadow-lg transition-shadow'>
          <CardContent className='p-6 text-center'>
            <div className='w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4'></div>
            <h3 className='font-semibold text-gray-900 mb-1'>Phạm Đức Nam</h3>
            <p className='text-sm text-gray-600 mb-3'>2D Illustrator</p>
            <div className='flex items-center justify-center mb-3'>
              <div className='flex items-center text-yellow-400'>
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4 fill-current' />
                <Star className='h-4 w-4' />
              </div>
              <span className='text-sm text-gray-600 ml-2'>4.7 (73)</span>
            </div>
            <div className='flex flex-wrap gap-1 justify-center mb-4'>
              <Badge variant='outline' className='text-xs text-purple-600 border-purple-600'>
                Poster
              </Badge>
              <Badge variant='outline' className='text-xs text-green-600 border-green-600'>
                React Native
              </Badge>
              <Badge variant='outline' className='text-xs text-blue-600 border-blue-600'>
                iOS
              </Badge>
            </div>
            <div className='text-lg font-bold text-gray-900 mb-4'>55.000/giờ</div>
            <Button className='w-full bg-black hover:bg-gray-800 text-white'>Mời Làm Việc</Button>
          </CardContent>
        </Card>
      </div>

      <div className='flex items-center justify-center space-x-2'>
        <Button variant='default' size='sm' className='bg-blue-600 text-white'>
          1
        </Button>
        <Button variant='outline' size='sm'>
          2
        </Button>
        <Button variant='outline' size='sm'>
          3
        </Button>
        <span className='text-sm text-gray-600'>...</span>
        <Button variant='outline' size='sm'>
          15
        </Button>
      </div>
    </div>
  )
}
