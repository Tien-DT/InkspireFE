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
          <h2 className='text-2xl font-bold text-gray-900'>Portfolio</h2>
        </div>
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-gray-500'>Chưa có dự án nào trong portfolio</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Portfolio</h2>
      </div>
      <div className='grid md:grid-cols-2 gap-6'>
        {portfolio.map((item) => (
          <Card key={item.id} className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center'>
              <div className='text-center p-8'>
                <div className='text-6xl mb-2'>🎨</div>
                <p className='text-sm text-gray-500'>{item.category}</p>
              </div>
            </div>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between mb-2'>
                <h3 className='font-bold text-gray-900'>{item.title}</h3>
                <Badge variant='outline' className='text-xs'>
                  {item.category}
                </Badge>
              </div>
              <p className='text-sm text-gray-600'>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
