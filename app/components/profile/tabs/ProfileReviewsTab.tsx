import { Clock } from 'lucide-react'

export function ProfileReviewsTab() {
  return (
    <div className='py-10 text-center'>
      <span className='mx-auto mb-4 flex h-12 w-12 items-center justify-center text-muted-foreground/50'>
        <Clock className='h-6 w-6' />
      </span>
      <h3 className='mb-2 text-base font-semibold text-foreground'>Chưa có lịch sử</h3>
      <p className='text-sm text-muted-foreground/70'>
        Lịch sử dự án và đánh giá sẽ được hiển thị tại đây khi bạn hoàn thành các dự án đầu tiên.
      </p>
    </div>
  )
}
