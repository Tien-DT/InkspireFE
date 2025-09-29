import { Filter } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import { Button } from '~/components/ui/button'

interface FilterOption {
  id: string
  label: string
  value: string
}

interface FilterConfig {
  categories: FilterOption[]
  budgetRanges: FilterOption[]
  durations: FilterOption[]
  experienceLevels: FilterOption[]
}

interface JobFiltersProps {
  filters: FilterConfig
  onFilterChange: (filterType: string, value: string | string[]) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function JobFilters({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onClearFilters 
}: JobFiltersProps) {
  return (
    <Card className="sticky top-5">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">Bộ lọc tìm kiếm</h3>
        </div>

        <div className="space-y-6">
          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ khóa
            </label>
            <Input 
              placeholder="Nhập từ khóa..." 
              className="w-full"
              onChange={(e) => onFilterChange('keywords', e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <Select onValueChange={(value) => onFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                {filters.categories.map((category) => (
                  <SelectItem key={category.id} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngân sách (VND)
            </label>
            <Select onValueChange={(value) => onFilterChange('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mức ngân sách" />
              </SelectTrigger>
              <SelectContent>
                {filters.budgetRanges.map((range) => (
                  <SelectItem key={range.id} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian dự án
            </label>
            <div className="space-y-3">
              {filters.durations.map((duration) => (
                <div key={duration.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={duration.id}
                    onCheckedChange={(checked) => {
                      // Handle checkbox logic for multiple selections
                      console.log('Duration filter:', duration.value, checked)
                    }}
                  />
                  <label 
                    htmlFor={duration.id} 
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {duration.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ kinh nghiệm
            </label>
            <div className="space-y-3">
              {filters.experienceLevels.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={level.id}
                    onCheckedChange={(checked) => {
                      console.log('Experience filter:', level.value, checked)
                    }}
                  />
                  <label 
                    htmlFor={level.id} 
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {level.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            <Button 
              onClick={onApplyFilters} 
              className="w-full"
            >
              Áp dụng bộ lọc
            </Button>
            <Button 
              onClick={onClearFilters} 
              variant="outline" 
              className="w-full"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}