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

  const skillColors = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

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
                  : `Tìm thấy ${recruitmentData?.pagination?.totalCount || 0} công việc phù hợp`}
            </h1>
            {recruitmentData?.pagination && (
              <p className='text-sm text-gray-600 mt-2'>
                Trang {recruitmentData.pagination.currentPage} / {recruitmentData.pagination.totalPages}
              </p>
            )}
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
                {recruitmentData?.data?.map((post) => (
                  <Card key={post.id} className='hover:shadow-lg transition-shadow border border-gray-200'>
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between gap-8'>
                        {/* Left Content */}
                        <div className='flex-1'>
                          {/* Title and Badge */}
                          <div className='flex items-start gap-3 mb-3'>
                            <h3 className='text-xl font-semibold text-gray-900 flex-1 hover:text-blue-600 cursor-pointer'>
                              {post.title}
                            </h3>
                            {post.status === 1 && (
                              <Badge className='bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-3 py-1 text-xs font-semibold'>
                                Nổi bật
                              </Badge>
                            )}
                            <Heart className='h-5 w-5 text-gray-400 cursor-pointer hover:text-red-500 transition-colors flex-shrink-0' />
                          </div>

                          {/* Company/User Info */}
                          <div className='flex items-center gap-2 mb-4'>
                            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                              {post.user.firstName.charAt(0)}
                            </div>
                            <span className='text-sm text-gray-700 font-medium'>
                              {post.user.firstName} {post.user.lastName}
                            </span>
                          </div>

                          {/* Description */}
                          <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{post.description}</p>

                          {/* Categories */}
                          {post.categories && post.categories.length > 0 && (
                            <div className='mb-3'>
                              <div className='flex items-center gap-2 flex-wrap'>
                                <span className='text-xs font-semibold text-gray-500 uppercase'>Danh mục:</span>
                                {post.categories.map((category) => (
                                  <Badge
                                    key={category.id}
                                    variant='secondary'
                                    className='bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium px-2.5 py-0.5'
                                  >
                                    📁 {category.title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills Tags */}
                          <div className='mb-4'>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <span className='text-xs font-semibold text-gray-500 uppercase'>Kỹ năng:</span>
                              {post.skills.map((skill, skillIndex) => {
                                const colorVariant = skillColors[skillIndex % skillColors.length]
                                return (
                                  <Badge key={skill.id} variant={colorVariant} className='text-xs font-medium'>
                                    {skill.name}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className='flex items-center justify-between gap-6 text-sm text-gray-600'>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-4 w-4' />
                              <span>Hạn: {new Date(post.endTime).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Users className='h-4 w-4' />
                              <span>{post.teamSize} đề xuất</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Calendar className='h-4 w-4' />
                              <span>Đăng {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Content - Budget and Actions */}
                        <div className='flex flex-col justify-between gap-4 min-w-[200px] h-full'>
                          <div className='text-right'>
                            <div className='text-2xl font-bold text-green-600 mb-1'>
                              {(post.budget / 1000000).toFixed(1)}M VND
                            </div>
                            <div className='text-sm text-gray-500'>Giá cố định</div>
                          </div>

                          <div className='flex flex-col gap-2 w-full'>
                            <Button className='w-full bg-gray-900 hover:bg-gray-800 text-white'>Ứng tuyển ngay</Button>
                            <Button
                              variant='outline'
                              className='w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            >
                              <Eye className='h-4 w-4 mr-2' />
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
          <div className='flex justify-center mt-8'>
            <PaginationDemo
              currentPage={page}
              totalPages={recruitmentData?.pagination?.totalPages ?? 1}
              hasNextPage={recruitmentData?.pagination?.hasNext ?? false}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
