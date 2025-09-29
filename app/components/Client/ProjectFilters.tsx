import { useState } from 'react'
import { Search, Filter, X, MapPin, DollarSign, Calendar, Star, Briefcase } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Slider } from '~/components/ui/slider'
import { Checkbox } from '~/components/ui/checkbox'

export interface FilterCriteria {
  keyword: string
  category: string
  minBudget: number
  maxBudget: number
  location: string
  deadline: string
  projectType: string[]
  experienceLevel: string
  rating: number
  skills: string[]
  sortBy: 'newest' | 'budget_high' | 'budget_low' | 'deadline' | 'rating'
}

interface ProjectFiltersProps {
  filters: FilterCriteria
  onFiltersChange: (filters: FilterCriteria) => void
  onClearFilters: () => void
  onSearch: () => void
  resultCount?: number
  isLoading?: boolean
  availableSkills?: string[]
  availableLocations?: string[]
}

export function ProjectFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  onSearch,
  resultCount = 0,
  isLoading = false,
  availableSkills = [],
  availableLocations = []
}: ProjectFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [tempSkill, setTempSkill] = useState('')

  const updateFilter = (key: keyof FilterCriteria, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const addSkill = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      updateFilter('skills', [...filters.skills, skill])
      setTempSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    updateFilter('skills', filters.skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch()
    }
  }

  const addProjectType = (type: string, checked: boolean) => {
    if (checked) {
      updateFilter('projectType', [...filters.projectType, type])
    } else {
      updateFilter('projectType', filters.projectType.filter(t => t !== type))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const hasActiveFilters = 
    filters.keyword ||
    filters.category ||
    filters.location ||
    filters.deadline ||
    filters.projectType.length > 0 ||
    filters.experienceLevel ||
    filters.rating > 0 ||
    filters.skills.length > 0 ||
    filters.minBudget > 0 ||
    filters.maxBudget < 10000000

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm dự án theo từ khóa..."
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Lọc nâng cao</span>
                  {hasActiveFilters && (
                    <Badge variant="destructive" className="text-xs px-1">
                      !
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Bộ lọc nâng cao</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearFilters}
                      className="text-red-600 hover:text-red-700"
                    >
                      Xóa tất cả
                    </Button>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả danh mục</SelectItem>
                        <SelectItem value="web-development">Phát triển Web</SelectItem>
                        <SelectItem value="mobile-development">Phát triển Mobile</SelectItem>
                        <SelectItem value="design">Thiết kế</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="writing">Viết lách</SelectItem>
                        <SelectItem value="translation">Dịch thuật</SelectItem>
                        <SelectItem value="data-entry">Nhập liệu</SelectItem>
                        <SelectItem value="video-editing">Chỉnh sửa video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-3">
                    <Label>Ngân sách</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{formatCurrency(filters.minBudget)}</span>
                        <span>{formatCurrency(filters.maxBudget)}</span>
                      </div>
                      <Slider
                        value={[filters.minBudget, filters.maxBudget]}
                        onValueChange={(value) => {
                          updateFilter('minBudget', value[0])
                          updateFilter('maxBudget', value[1])
                        }}
                        min={0}
                        max={10000000}
                        step={100000}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm</Label>
                    <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa điểm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả địa điểm</SelectItem>
                        <SelectItem value="remote">Làm việc từ xa</SelectItem>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="danang">Đà Nẵng</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label>Loại dự án</Label>
                    <div className="space-y-2">
                      {['fixed-price', 'hourly', 'contest', 'part-time', 'full-time'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={filters.projectType.includes(type)}
                            onCheckedChange={(checked) => addProjectType(type, checked as boolean)}
                          />
                          <Label htmlFor={type} className="text-sm cursor-pointer">
                            {type === 'fixed-price' && 'Giá cố định'}
                            {type === 'hourly' && 'Theo giờ'}
                            {type === 'contest' && 'Cuộc thi'}
                            {type === 'part-time' && 'Bán thời gian'}
                            {type === 'full-time' && 'Toàn thời gian'}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">Cấp độ kinh nghiệm</Label>
                    <Select value={filters.experienceLevel} onValueChange={(value) => updateFilter('experienceLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả cấp độ</SelectItem>
                        <SelectItem value="entry">Mới bắt đầu</SelectItem>
                        <SelectItem value="intermediate">Trung bình</SelectItem>
                        <SelectItem value="expert">Chuyên gia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Minimum Rating */}
                  <div className="space-y-2">
                    <Label htmlFor="rating">Đánh giá tối thiểu</Label>
                    <Select value={filters.rating.toString()} onValueChange={(value) => updateFilter('rating', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đánh giá" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Tất cả đánh giá</SelectItem>
                        <SelectItem value="4">4+ sao</SelectItem>
                        <SelectItem value="3">3+ sao</SelectItem>
                        <SelectItem value="2">2+ sao</SelectItem>
                        <SelectItem value="1">1+ sao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={onSearch} disabled={isLoading}>
              {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span>Kỹ năng yêu cầu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Nhập kỹ năng..."
              value={tempSkill}
              onChange={(e) => setTempSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill(tempSkill)
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSkill(tempSkill)}
              disabled={!tempSkill.trim()}
            >
              Thêm
            </Button>
          </div>
          
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-red-100"
                    onClick={() => removeSkill(skill)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
          {availableSkills.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 mb-2">Kỹ năng phổ biến:</p>
              <div className="flex flex-wrap gap-1">
                {availableSkills.slice(0, 8).map((skill, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => addSkill(skill)}
                    disabled={filters.skills.includes(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sort & Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="sort" className="text-sm font-medium">
              Sắp xếp:
            </Label>
            <Select value={filters.sortBy} onValueChange={(value: any) => updateFilter('sortBy', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="budget_high">Ngân sách cao</SelectItem>
                <SelectItem value="budget_low">Ngân sách thấp</SelectItem>
                <SelectItem value="deadline">Hạn chót gần</SelectItem>
                <SelectItem value="rating">Đánh giá cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          Tìm thấy <span className="font-medium">{resultCount.toLocaleString('vi-VN')}</span> dự án
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Bộ lọc đang áp dụng:</span>
              <div className="flex flex-wrap gap-1">
                {filters.keyword && (
                  <Badge variant="outline" className="text-blue-700">
                    "{filters.keyword}"
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="outline" className="text-blue-700">
                    Danh mục: {filters.category}
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="outline" className="text-blue-700">
                    Địa điểm: {filters.location}
                  </Badge>
                )}
                {filters.experienceLevel && (
                  <Badge variant="outline" className="text-blue-700">
                    Kinh nghiệm: {filters.experienceLevel}
                  </Badge>
                )}
                {filters.minBudget > 0 || filters.maxBudget < 10000000 && (
                  <Badge variant="outline" className="text-blue-700">
                    Ngân sách: {formatCurrency(filters.minBudget)} - {formatCurrency(filters.maxBudget)}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}