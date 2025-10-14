import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { PortfolioItem } from '~/types/profile.type'

interface ProfilePortfolioTabProps {
  portfolio: PortfolioItem[]
}

export function ProfilePortfolioTab({ portfolio }: ProfilePortfolioTabProps) {
  if (portfolio.length === 0) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-semibold text-foreground'>Portfolio</h2>
          <Badge
            variant='outline'
            className='border-dashed border-border/60 bg-transparent px-4 py-1 text-xs uppercase tracking-wide text-muted-foreground'
          >
            0 dự án
          </Badge>
        </div>
        <Card className='border border-border/50 bg-card/85 shadow-sm backdrop-blur'>
          <CardContent className='py-16 text-center text-sm text-muted-foreground'>
            Chưa có dự án nào trong portfolio
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-foreground'>Portfolio</h2>
        <Badge
          variant='outline'
          className='border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary'
        >
          {portfolio.length} dự án
        </Badge>
      </div>
      <div className='grid gap-6 md:grid-cols-2'>
        {portfolio.map((item) => (
          <Card
            key={item.id}
            className='group overflow-hidden border border-border/60 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:shadow-xl'
          >
            <div className='rounded-md relative flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20'>
              <div className='text-center'>
                <div className='mb-3 text-5xl drop-shadow-sm'>🎨</div>
                <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>{item.category}</p>
              </div>
              <div className='pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 group-hover:[transform:scale(1.05)] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),transparent_60%)]' />
            </div>
            <CardContent className='space-y-3 p-5'>
              <div className='flex items-start justify-between gap-3'>
                <h3 className='text-lg font-semibold text-foreground group-hover:text-primary transition'>
                  {item.title}
                </h3>
                <Badge
                  variant='outline'
                  className='border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-primary'
                >
                  {item.category}
                </Badge>
              </div>
              <p className='text-sm leading-relaxed text-muted-foreground'>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
