import { Lightbulb } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'

export function ProjectFormTips() {
  return (
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
  )
}
