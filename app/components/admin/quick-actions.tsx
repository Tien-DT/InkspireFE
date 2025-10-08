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
    <Card className='p-6 shadow-sm'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold text-slate-900'>Hành động nhanh</h2>
          <p className='text-sm text-muted-foreground'>Các mục việc cần xử lý trong hôm nay</p>
        </div>

        <div className='space-y-3'>
          {actions.map((action) => (
            <button
              key={action.number}
              className='flex w-full items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent'
              type='button'
            >
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground'>
                {action.number}
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-slate-900'>{action.title}</p>
              </div>
              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <span>{action.linkLabel}</span>
                <ChevronRight className='h-4 w-4' />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
