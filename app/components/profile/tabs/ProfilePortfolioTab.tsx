import { Badge } from '~/components/ui/badge'
import { FileText } from 'lucide-react'
import { Button } from '~/components/ui/button'
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
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='text-center'>
                  <div className='mb-2 text-4xl'>🎨</div>
                  <p className='text-xs font-medium text-muted-foreground/70'>{item.project}</p>
                </div>
              )}
            </div>
            <div className='space-y-2 p-4'>
              <div className='flex items-start justify-between gap-2'>
                <h3 className='text-sm font-semibold text-foreground'>
                  {item.name}
                </h3>
              </div>
              {item.project && (
                <p className='text-xs text-muted-foreground/60'>
                  <span className='font-medium'>Dự án:</span> {item.project}
                </p>
              )}
              {item.skill && (
                <p className='text-xs text-muted-foreground/60'>
                  <span className='font-medium'>Kỹ năng:</span> {item.skill}
                </p>
              )}
              <p className='text-xs leading-relaxed text-muted-foreground/70'>{item.description}</p>
              {item.pdfUrl && (
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-2 w-full'
                  onClick={() => window.open(item.pdfUrl, '_blank')}
                >
                  <FileText className='mr-2 h-4 w-4' />
                  Xem chi tiết (PDF)
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
