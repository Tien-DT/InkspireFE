import { DollarSign, Clock } from 'lucide-react'
import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

interface ProfilePricingProps {
  priceRange: string
  status: string
}

export function ProfilePricing({ priceRange, status }: ProfilePricingProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className='text-lg font-semibold text-gray-900'>Mức giá & Sẵn sàng</h3>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-start gap-3'>
          <DollarSign className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
          <div>
            <p className='text-sm text-gray-500'>Mức giá theo giờ</p>
            <p className='text-gray-900 font-bold text-lg'>{priceRange}</p>
          </div>
        </div>
        <div className='flex items-start gap-3'>
          <Clock className='h-5 w-5 text-blue-600 mt-0.5 shrink-0' />
          <div>
            <p className='text-sm text-gray-500'>Tình trạng</p>
            <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-1'>{status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
