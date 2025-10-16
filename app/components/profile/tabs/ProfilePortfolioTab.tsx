import { Badge } from '~/components/ui/badge'
import type { PortfolioItem } from '~/types/profile.type'

interface ProfilePortfolioTabProps {
  portfolio: PortfolioItem[]
}

export function ProfilePortfolioTab({ portfolio }: ProfilePortfolioTabProps) {
  if (portfolio.length === 0) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-foreground'>Portfolio</h2>
          <Badge
            variant='outline'
            className='border-0 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground/60'
          >
            0 dự án
          </Badge>
        </div>
        <div className='py-12 text-center text-sm text-muted-foreground/60 rounded-lg bg-muted/20'>
          Chưa có dự án nào trong portfolio
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-foreground'>Portfolio</h2>
        <Badge
          variant='outline'
          className='border-0 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary/80'
        >
          {portfolio.length} dự án
        </Badge>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {portfolio.map((item) => (
          <div
            key={item.id}
            className='group overflow-hidden rounded-lg bg-muted/40 transition hover:bg-muted/60'
          >
            <div className='relative flex aspect-video items-center justify-center bg-gradient-to-br from-muted to-muted/80'>
              <div className='text-center'>
                <div className='mb-2 text-4xl'>🎨</div>
                <p className='text-xs font-medium text-muted-foreground/70'>{item.category}</p>
              </div>
            </div>
            <div className='space-y-2 p-4'>
              <div className='flex items-start justify-between gap-2'>
                <h3 className='text-sm font-semibold text-foreground'>
                  {item.title}
                </h3>
              </div>
              <p className='text-xs leading-relaxed text-muted-foreground/70'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
