import { Clock } from 'lucide-react'
import { Card, CardHeader, CardContent } from '~/components/ui/card'

export function ProfileReviewsTab() {
  return (
    <Card className='border border-border/50 bg-card/85 shadow-sm backdrop-blur'>
      <CardHeader className='border-b border-border/40 pb-4'>
        <h2 className='text-2xl font-semibold text-foreground'>Lịch sử làm việc</h2>
      </CardHeader>
      <CardContent>
        <div className='py-14 text-center'>
          <span className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Clock className='h-7 w-7' />
          </span>
          <h3 className='mb-2 text-lg font-semibold text-foreground'>Chưa có lịch sử</h3>
          <p className='text-sm text-muted-foreground'>
            Lịch sử dự án và đánh giá sẽ được hiển thị tại đây khi bạn hoàn thành các dự án đầu tiên.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
