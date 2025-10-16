import { Briefcase, RefreshCcw, Search } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { LoadingList } from '~/components/shared/LoadingCard'

export function JobListLoading() {
  return <LoadingList count={3} variant='default' />
}

export function JobListEmpty() {
  return (
    <Card className='border-2 border-dashed'>
      <CardContent className='py-16 text-center'>
        <div className='flex flex-col items-center max-w-md mx-auto'>
          <div className='h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 ring-8 ring-muted/30'>
            <Search className='h-10 w-10 text-muted-foreground' />
          </div>
          <h3 className='text-xl font-bold mb-2'>Không tìm thấy công việc</h3>
          <p className='text-muted-foreground leading-relaxed'>
            Không có công việc nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ
            khóa khác.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function JobListError({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Card className='border-destructive/50 bg-destructive/5'>
      <CardContent className='py-16 text-center'>
        <div className='flex flex-col items-center max-w-md mx-auto'>
          <div className='h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4 ring-8 ring-destructive/10'>
            <Briefcase className='h-10 w-10 text-destructive' />
          </div>
          <h3 className='text-xl font-bold mb-2'>Có lỗi xảy ra</h3>
          <p className='text-muted-foreground mb-6 leading-relaxed'>{error.message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant='outline' className='gap-2'>
              <RefreshCcw className='h-4 w-4' />
              Thử lại
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
