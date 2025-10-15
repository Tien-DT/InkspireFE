import { Briefcase, Plus } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import { PATH } from '~/constants/path'

export function EmptyProjectsState() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-3xl border border-border/50 border-dashed bg-muted/20 p-12 text-center shadow-inner'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Briefcase className='h-8 w-8' />
      </div>
      <div>
        <h3 className='text-lg font-semibold text-foreground'>Chưa có bài đăng nào</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu đăng tin ngay!
        </p>
      </div>
      <Button
        asChild
        className='rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
      >
        <Link to={PATH.postProject}>
          <Plus className='mr-2 h-4 w-4' />
          Đăng tin tuyển dụng
        </Link>
      </Button>
    </div>
  )
}
