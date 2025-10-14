import { Filter, Search, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Slider } from '~/components/ui/slider'
import { recruitmentApi } from '~/apis/recruitment.api'

interface JobFiltersProps {
  filters: {
    keyword: string
    category: string
    minBudget: number
    maxBudget: number
  }
  onFiltersChange: (filters: { keyword: string; category: string; minBudget: number; maxBudget: number }) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

const BUDGET_MIN = 0
const BUDGET_MAX = 100_000_000
const BUDGET_STEP = 1_000_000

export function JobFilters({ filters, onFiltersChange, onApplyFilters, onClearFilters }: JobFiltersProps) {
  // Fetch categories dynamically
  const { data: categories = [] } = useQuery({
    queryKey: ['recruitment-categories'],
    queryFn: async () => {
      const res = await recruitmentApi.getCategories()
      return res.data
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  })

  const handleBudgetChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minBudget: values[0],
      maxBudget: values[1]
    })
  }

  const formatBudget = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`
    }
    return value.toString()
  }

  return (
    <Card className='sticky top-5'>
      <CardContent className='p-6'>
        <div className='flex items-center mb-6'>
          <Filter className='h-5 w-5 mr-2 text-primary' />
          <h3 className='font-semibold'>Bộ lọc tìm kiếm</h3>
        </div>

        <div className='space-y-8'>
          {/* Keywords */}
          <div className='space-y-2.5'>
            <Label htmlFor='keyword' className='text-sm font-medium'>
              Từ khóa
            </Label>
            <Input
              id='keyword'
              placeholder='Tìm kiếm công việc...'
              value={filters.keyword}
              onChange={(e) => onFiltersChange({ ...filters, keyword: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className='space-y-2.5'>
            <Label htmlFor='category' className='text-sm font-medium'>
              Danh mục
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
            >
              <SelectTrigger id='category'>
                <SelectValue placeholder='Tất cả danh mục' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range Slider */}
          <div className='space-y-4'>
            <Label className='text-sm font-medium'>Ngân sách</Label>

            {/* Budget Range Display */}
            <div className='flex items-center gap-2.5'>
              <div className='flex-1 bg-muted/50 rounded-lg px-3 py-2.5 border border-border/60 transition-colors hover:border-border'>
                <div className='text-xs text-muted-foreground mb-0.5 font-medium'>Tối thiểu</div>
                <div className='font-semibold text-foreground tracking-tight'>{formatBudget(filters.minBudget)}</div>
              </div>
              <div className='text-muted-foreground/60 text-sm pt-3'>→</div>
              <div className='flex-1 bg-muted/50 rounded-lg px-3 py-2.5 border border-border/60 transition-colors hover:border-border'>
                <div className='text-xs text-muted-foreground mb-0.5 font-medium'>Tối đa</div>
                <div className='font-semibold text-foreground tracking-tight'>{formatBudget(filters.maxBudget)}</div>
              </div>
            </div>

            {/* Slider */}
            <div className='px-1 pt-2 pb-1'>
              <Slider
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={BUDGET_STEP}
                value={[filters.minBudget, filters.maxBudget]}
                onValueChange={handleBudgetChange}
                className='w-full'
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button className='w-full shadow-sm' onClick={onApplyFilters}>
            <Search className='h-4 w-4 mr-2' />
            Áp dụng bộ lọc
          </Button>

          {/* Clear Filters */}
          <Button
            variant='ghost'
            className='w-full text-muted-foreground hover:text-foreground'
            onClick={onClearFilters}
          >
            <X className='h-4 w-4 mr-2' />
            Xóa bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
