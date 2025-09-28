import { ArrowRight, Lightbulb } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'

export default function PostProject() {
  return (
    <div className='container mx-auto px-4 py-6 space-y-6'> 
      {/* Main Content */}
      {/* Page Title */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-teal-500 mb-2'>Đăng Dự Án Mới</h1>
        <p className='text-gray-600'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
      </div>

      {/* Progress Steps */}
      <div className='flex items-center justify-center mb-8'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium'>
              1
            </div>
            <span className='ml-2 text-blue-600 font-medium'>Thông tin cơ bản</span>
          </div>
          <ArrowRight className='h-4 w-4 text-gray-400' />
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium'>
              2
            </div>
            <span className='ml-2 text-gray-600'>Chi tiết dự án</span>
          </div>
          <ArrowRight className='h-4 w-4 text-gray-400' />
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium'>
              3
            </div>
            <span className='ml-2 text-gray-600'>Hoàn thành</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Form */}
        <div className='lg:col-span-2'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center mb-6'>
                <div className='w-2 h-2 bg-blue-600 rounded-full mr-3'></div>
                <h2 className='text-lg font-semibold'>Thông tin cơ bản</h2>
              </div>
              <p className='text-gray-600 mb-6'>Hãy mô tả dự án của bạn một cách rõ ràng</p>

              <div className='space-y-6'>
                {/* Project Title */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Tiêu đề dự án</label>
                  <Input placeholder='Tiêu đề ngắn gọn, thu hút và mô tả chính xác dự án' className='w-full' />
                </div>

                {/* Project Category */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Danh mục dự án</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn danh mục' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='web'>Phát triển Web</SelectItem>
                      <SelectItem value='mobile'>Ứng dụng Mobile</SelectItem>
                      <SelectItem value='design'>Thiết kế</SelectItem>
                      <SelectItem value='marketing'>Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className='text-sm text-gray-500 mt-1'>Chọn danh mục phù hợp để freelancer dễ tìm thấy</p>
                </div>

                {/* Project Description */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Mô tả dự án</label>
                  <Textarea
                    placeholder='Mô tả chi tiết về dự án, yêu cầu, mong đợi của bạn'
                    rows={6}
                    className='w-full'
                  />
                  <p className='text-sm text-gray-500 mt-1'>Mô tả càng chi tiết, freelancer càng hiểu rõ yêu cầu</p>
                </div>

                {/* Budget and Timeline */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Ngân sách</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn mức ngân sách' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='under-500'>Dưới 500k</SelectItem>
                        <SelectItem value='500-1m'>500k - 1M</SelectItem>
                        <SelectItem value='1m-5m'>1M - 5M</SelectItem>
                        <SelectItem value='over-5m'>Trên 5M</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className='text-sm text-gray-500 mt-1'>Ngân sách sẽ không hiển thị công khai</p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Thời hạn</label>
                    <Input placeholder='Thời gian mong muốn hoàn thành' className='w-full' />
                    <p className='text-sm text-gray-500 mt-1'>Thời gian mong muốn hoàn thành</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className='pt-4'>
                  <Button className='bg-gray-800 hover:bg-gray-900 text-white px-6 py-2'>
                    Tiếp theo
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Tips for Success */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center mb-4'>
                <Lightbulb className='h-5 w-5 text-yellow-500 mr-2' />
                <h3 className='font-semibold'>Tips thành công</h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium text-sm mb-1'>Tiêu đề rõ ràng</h4>
                  <p className='text-sm text-gray-600'>Sử dụng từ khóa chính xác để thu hút freelancer phù hợp</p>
                </div>

                <div>
                  <h4 className='font-medium text-sm mb-1'>Mô tả chi tiết</h4>
                  <p className='text-sm text-gray-600'>Cung cấp đầy đủ thông tin về yêu cầu và kỳ vọng</p>
                </div>

                <div>
                  <h4 className='font-medium text-sm mb-1'>Ngân sách hợp lý</h4>
                  <p className='text-sm text-gray-600'>Đặt mức ngân sách phù hợp để thu hút freelancer chất lượng</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Preview */}
          <Card>
            <CardContent className='p-6'>
              <h3 className='font-semibold mb-4'>Xem trước dự án</h3>

              <div className='space-y-3'>
                <div>
                  <span className='text-sm text-gray-600'>Tiêu đề</span>
                  <p className='text-sm font-medium'>Chưa nhập</p>
                </div>

                <div>
                  <span className='text-sm text-gray-600'>Danh mục</span>
                  <p className='text-sm font-medium'>Chưa chọn</p>
                </div>

                <div>
                  <span className='text-sm text-gray-600'>Ngân sách</span>
                  <p className='text-sm font-medium'>Chưa chọn</p>
                </div>

                <div>
                  <span className='text-sm text-gray-600'>Thời hạn</span>
                  <p className='text-sm font-medium'>Chưa chọn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
