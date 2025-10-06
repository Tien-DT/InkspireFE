import { Clock } from 'lucide-react'
import { Card, CardHeader, CardContent } from '~/components/ui/card'

export function ProfileReviewsTab() {
  return (
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
  )
}
