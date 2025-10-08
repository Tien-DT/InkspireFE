import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

type FilterStatus = 'all' | 'pending' | 'accepted' | 'rejected'

interface FilterTabsProps {
  activeFilter: FilterStatus
  onFilterChange: (filter: FilterStatus) => void
}

const filters = [
  { value: 'all' as const, label: 'Tất cả' },
  { value: 'pending' as const, label: 'Đang chờ' },
  { value: 'accepted' as const, label: 'Được chấp nhận' },
  { value: 'rejected' as const, label: 'Bị từ chối' }
]

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <Card className='mb-6'>
      <CardContent className='p-4'>
        <div className='flex gap-2'>
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              onClick={() => onFilterChange(filter.value)}
              className={activeFilter === filter.value ? 'btn-submit' : 'btn-cancel'}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export type { FilterStatus }
