import { Calendar, Clock, Eye, Filter, Heart, Search, Users } from 'lucide-react'
import { useSearchParams } from 'react-router'
import PaginationDemo from '~/components/Pagination'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useRecruitments } from '~/hooks/useRecruitments'

import { Suspense } from 'react'
import { HydrateFallback } from '~/components/ui'

export default function JobsFreelancer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const pageSize = 10
  const { data: recruitmentData, isLoading, error } = useRecruitments(page, pageSize)

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() })
  }
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
        <div className='lg:col-span-3'>
          <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-gray-900'>
              {isLoading
                ? 'Đang tải dữ liệu...'
                : error
                  ? 'Có lỗi xảy ra'
                  : `Tìm thấy ${recruitmentData?.items?.length || 0} công việc phù hợp`}
            </h1>
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

          <Suspense fallback={<HydrateFallback variant='list' items={5} />}>
            {error ? (
              <div className='text-center py-8'>
                <p className='text-red-600'>Có lỗi xảy ra: {(error as Error).message}</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {recruitmentData?.items?.map((post) => (
                  <Card key={post.id} className='hover:shadow-md transition-shadow'>
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between mb-4 gap-10'>
                        <div className='w-2/3 flex flex-col gap-5'>
                          <div className='flex items-center'>
                            <h3 className='text-lg font-semibold text-gray-900 mr-3'>{post.title}</h3>
                            {post.status === 1 && (
                              <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
                                HOT
                              </Badge>
                            )}
                            <Heart className='h-5 w-5 text-gray-400 ml-2 cursor-pointer hover:text-red-500' />
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <span className='mr-4'>{post.projectName}</span>
                            <div className='flex items-center mr-4'>
                              <span>by {post.userName}</span>
                            </div>
                          </div>
                          <p className='text-gray-700'>{post.description}</p>
                          <div className='flex flex-wrap gap-2'>
                            <Badge variant='blue'>Logo Design</Badge>
                            <Badge variant='purple'>Branding</Badge>
                            <Badge variant='orange'>Adobe Illustrator</Badge>
                            <Badge variant='pink'>Photoshop</Badge>
                            <Badge variant='green'>UI/UX</Badge>
                          </div>
                          <div className='flex justify-between items-center text-sm text-gray-600'>
                            <div className='flex items-center'>
                              <Clock className='h-4 w-4 mr-1 font-extrabold' />
                              <span>
                                <strong>Hết hạn:</strong> {new Date(post.postExpired).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <div className='flex items-center'>
                              <Users className='h-4 w-4 mr-1 font-extrabold' />
                              <span>
                                <strong>Team:</strong> {post.teamSize}
                              </span>
                            </div>
                            <div className='flex items-center'>
                              <Calendar className='h-4 w-4 mr-1 font-extrabold' />
                              <span>
                                <strong>Đăng:</strong> {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='text-right w-1/3'>
                          <div className='text-2xl font-bold text-green-600 mb-2'>
                            {post.budget.toLocaleString('vi-VN')} VND
                          </div>
                          <div className='text-sm text-gray-600 mb-4'>Giá cố định</div>

                          <div className='flex flex-col gap-1'>
                            <Button className='w-full bg-black hover:bg-gray-800 text-white mb-2'>
                              Ứng tuyển ngay
                            </Button>
                            <Button className='bg-white w-full text-sm text-gray-600 flex items-center justify-center'>
                              <Eye className='h-4 w-4 mr-1' />
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          <div className='flex justify-center'>
            <PaginationDemo
              currentPage={page}
              hasNextPage={!!recruitmentData?.items?.length}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
