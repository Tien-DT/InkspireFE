import { DollarSign, Clock } from 'lucide-react'
import { Badge } from '~/components/ui/badge'

interface ProfilePricingProps {
  priceRange: string
  status: string
}

export function ProfilePricing({ priceRange, status }: ProfilePricingProps) {
  return (
    <div className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-foreground uppercase tracking-wide'>Mức giá & Sẵn sàng</h3>
      <div className='space-y-3'>
        <div className='flex items-start gap-3'>
          <span className='flex h-8 w-8 items-center justify-center text-muted-foreground/60'>
            <DollarSign className='h-4 w-4' />
          </span>
          <div>
            <p className='text-xs uppercase tracking-wide text-muted-foreground/60'>Mức giá dự kiến</p>
            <p className='text-base font-semibold text-foreground'>{priceRange || 'Đang cập nhật'}</p>
          </div>
        </div>
        <div className='flex items-start gap-3'>
          <span className='flex h-8 w-8 items-center justify-center text-muted-foreground/60'>
            <Clock className='h-4 w-4' />
          </span>
          <div>
            <p className='text-xs uppercase tracking-wide text-muted-foreground/60'>Tình trạng làm việc</p>
            <Badge className='mt-1 border-0 bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 shadow-none'>
              {status || 'Đang mở'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
