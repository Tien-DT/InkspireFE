import { DollarSign, Clock } from 'lucide-react'
import { Badge } from '~/components/ui/badge'

interface ProfilePricingProps {
  priceRange: string
  status: string
}

export function ProfilePricing({ priceRange, status }: ProfilePricingProps) {
  return (
    <div className='rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-foreground'>Mức giá & Sẵn sàng</h3>
        <Badge
          variant='outline'
          className='border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary'
        >
          Cập nhật
        </Badge>
      </div>
      <div className='space-y-4'>
        <div className='flex items-start gap-3'>
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500'>
            <DollarSign className='h-4 w-4' />
          </span>
          <div>
            <p className='text-xs uppercase tracking-wide text-muted-foreground/80'>Mức giá dự kiến</p>
            <p className='text-lg font-semibold text-foreground'>{priceRange || 'Đang cập nhật'}</p>
          </div>
        </div>
        <div className='flex items-start gap-3'>
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500'>
            <Clock className='h-4 w-4' />
          </span>
          <div>
            <p className='text-xs uppercase tracking-wide text-muted-foreground/80'>Tình trạng làm việc</p>
            <Badge className='mt-1 border-0 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 shadow-none'>
              {status || 'Đang mở'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
