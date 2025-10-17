import { ChevronRight } from 'lucide-react'
import { Card } from '~/components/ui/card'

type QuickActionItem = {
  number: string
  title: string
  linkLabel: string
}

const actions: QuickActionItem[] = [
  {
    number: '01',
    title: 'Xem các nội dung bị báo cáo',
    linkLabel: 'Xem chi tiết'
  },
  {
    number: '02',
    title: 'Phê duyệt dự án mới',
    linkLabel: 'Xem chi tiết'
  },
  {
    number: '03',
    title: 'Xử lý yêu cầu hỗ trợ',
    linkLabel: 'Xem chi tiết'
  },
  {
    number: '04',
    title: 'Xác minh người dùng mới',
    linkLabel: 'Xem chi tiết'
  }
]

export function QuickActions() {
  return (
    <Card className='p-4 shadow-none border-0 rounded-lg bg-white dark:bg-slate-950'>
      <div className='space-y-2'>
        <div>
          <h2 className='text-base sm:text-lg font-semibold text-slate-900'>Hành động nhanh</h2>
          <p className='text-xs sm:text-sm text-muted-foreground'>Các mục việc cần xử lý trong hôm nay</p>
        </div>

        <div className='space-y-1'>
          {actions.map((action) => (
            <button
              key={action.number}
              className='flex w-full items-center gap-2 sm:gap-3 rounded-lg border-0 bg-gray-50 dark:bg-slate-900/50 p-2 sm:p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-900 shadow-none text-xs sm:text-sm'
              type='button'
            >
              <div className='flex h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive text-xs sm:text-sm font-bold text-destructive-foreground'>
                {action.number}
              </div>
              <div className='flex-1'>
                <p className='font-medium text-slate-900'>{action.title}</p>
              </div>
              <div className='flex items-center gap-1 text-muted-foreground flex-shrink-0'>
                <span className='hidden sm:inline'>{action.linkLabel}</span>
                <ChevronRight className='h-4 w-4' />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
