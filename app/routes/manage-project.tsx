import { Check, Clock, Download, FileText, ImageIcon, MessageCircle, Plus, Share2 } from 'lucide-react'
import React, { Suspense } from 'react'
import { HydrateFallback } from '~/components/ui'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

export default function ManageProject() {
  return (
    <Suspense fallback={<HydrateFallback variant='details' showHeader />}>
      <div className='container mx-auto px-4 py-6 space-y-6 flex min-h-screen bg-background'>
        <div className='w-80 bg-white min-h-screen p-6 rounded-lg'>
          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin dự án</h2>

            <div className='space-y-4'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Tên dự án</p>
                <p className='font-medium text-gray-900'>Chiến dịch "Cùng COCOON sống xanh"</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Khách hàng</p>
                <div className='flex items-center'>
                  <div className='w-4 h-4 bg-gray-400 rounded mr-2'></div>
                  <p className='text-gray-900'>Công ty ABC</p>
                </div>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Ngày bắt đầu</p>
                <p className='text-gray-900'>15/12/2024</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Deadline</p>
                <p className='text-gray-900'>30/01/2025</p>
              </div>

              <div>
                <p className='text-sm text-gray-600 mb-1'>Trạng thái</p>
                <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>● Đang thực hiện</Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tệp đính kèm</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                <div className='flex items-center'>
                  <FileText className='h-5 w-5 text-red-500 mr-3' />
                  <span className='text-sm text-gray-900'>Yêu cầu kỹ thuật.pdf</span>
                </div>
                <Download className='h-4 w-4 text-gray-400' />
              </div>

              <div className='flex items-center justify-between p-3 bg-white rounded-lg border'>
                <div className='flex items-center'>
                  <ImageIcon className='h-5 w-5 text-green-500 mr-3' />
                  <span className='text-sm text-gray-900'>Mockup thiết kế.jpg</span>
                </div>
                <Download className='h-4 w-4 text-gray-400' />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 p-6'>
          {/* Tabs */}
          <div className='flex border-b border-gray-200 mb-6'>
            <button className='px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium'>Timeline dự án</button>
            <button className='px-4 py-2 text-gray-600 hover:text-gray-900'>Tất cả</button>
            <button className='px-4 py-2 text-gray-600 hover:text-gray-900'>Đang chờ</button>
          </div>

          {/* Project Timeline */}
          <div className='space-y-6'>
            {/* Phase 1 - Completed */}
            <div className='flex items-start'>
              <div className='flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4'>
                <Check className='h-5 w-5 text-white' />
              </div>
              <div className='flex-1'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>Phân tích yêu cầu</h3>
                      <span className='text-sm text-gray-500'>2 ngày trước</span>
                    </div>
                    <p className='text-gray-600 mb-4'>
                      Hoàn thành phân tích yêu cầu khách hàng và lập kế hoạch thực hiện.
                    </p>
                    <div className='flex items-center justify-between'>
                      <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>Đã duyệt</Badge>
                      <div className='flex items-center space-x-4'>
                        <Button variant='ghost' size='sm'>
                          <Download className='h-4 w-4 mr-2' />
                          Tải file thiết kế
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <FileText className='h-4 w-4 mr-2' />
                          Xem trước
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Phase 2 - In Progress */}
            <div className='flex items-start'>
              <div className='flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4'>
                <Clock className='h-5 w-5 text-white' />
              </div>
              <div className='flex-1'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Sản xuất nội dung truyền thông - Giai đoạn 1
                      </h3>
                      <span className='text-sm text-gray-500'>Hiện tại</span>
                    </div>
                    <p className='text-gray-600 mb-4'>
                      Viết bài social và kịch bản video đầu tiên truyền tải thông điệp "Cùng Cocoon sống xanh".
                    </p>
                    <div className='flex items-center justify-between'>
                      <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>Chờ thành toán</Badge>
                      <Button className='bg-black hover:bg-gray-800 text-white'>
                        <MessageCircle className='h-4 w-4 mr-2' />
                        Đặt cọc ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Phase 3 - Pending */}
            <div className='flex items-start'>
              <div className='flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4'>
                <div className='w-3 h-3 bg-white rounded-full'></div>
              </div>
              <div className='flex-1'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Điều chỉnh nội dung & triển khai giai đoạn 2
                      </h3>
                      <span className='text-sm text-gray-500'>Sắp tới</span>
                    </div>
                    <p className='text-gray-600 mb-4'>
                      Hiệu chỉnh theo feedback và tiếp tục viết bài, phối hợp KOL/Media.
                    </p>
                    <div className='flex items-center justify-between'>
                      <Badge variant='outline' className='text-gray-600 border-gray-300'>
                        Chưa bắt đầu
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Phase 4 - Pending */}
            <div className='flex items-start'>
              <div className='flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4'>
                <div className='w-3 h-3 bg-white rounded-full'></div>
              </div>
              <div className='flex-1'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>Đề xuất nội dung tiếp theo - giai đoạn 3</h3>
                      <span className='text-sm text-gray-500'>Sắp tới</span>
                    </div>
                    <p className='text-gray-600 mb-4'>
                      Tổng hợp hiệu suất, phân tích phản hồi và đề xuất chiến dịch tiếp theo cho chiến dịch dài hạn.
                    </p>
                    <div className='flex items-center justify-between'>
                      <Badge variant='outline' className='text-gray-600 border-gray-300'>
                        Chưa bắt đầu
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Phase 5 - Pending */}
            <div className='flex items-start'>
              <div className='flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-4'>
                <div className='w-3 h-3 bg-white rounded-full'></div>
              </div>
              <div className='flex-1'>
                <Card>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>Triển khai & Bàn giao</h3>
                      <span className='text-sm text-gray-500'>Sắp tới</span>
                    </div>
                    <p className='text-gray-600 mb-4'>Triển khai và bàn giao cho khách hàng.</p>
                    <div className='flex items-center justify-between'>
                      <Badge variant='outline' className='text-gray-600 border-gray-300'>
                        Chưa bắt đầu
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='mt-12 bg-white rounded-xl p-10'>
            <h3 className='text-2xl font-semibold text-gray-900 mb-6'>Hành động nhanh</h3>
            <div className='grid grid-cols-4 gap-6'>
              <div className='text-center border rounded-xl py-7'>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Plus className='h-6 w-6 text-blue-600' />
                </div>
                <p className='text-sm text-gray-700'>Thêm giai đoạn</p>
              </div>

              <div className='text-center border rounded-xl py-7'>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Download className='h-6 w-6 text-green-600' />
                </div>
                <p className='text-sm text-gray-700'>Tải báo cáo</p>
              </div>

              <div className='text-center border rounded-xl py-7'>
                <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <MessageCircle className='h-6 w-6 text-orange-600' />
                </div>
                <p className='text-sm text-gray-700'>Gửi phản hồi</p>
              </div>

              <div className='text-center border rounded-xl py-7'>
                <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Share2 className='h-6 w-6 text-purple-600' />
                </div>
                <p className='text-sm text-gray-700'>Chia sẻ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
