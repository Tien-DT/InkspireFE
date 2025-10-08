import { Filter, Search } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'

interface JobFiltersProps {
  onApplyFilters?: () => void
  onClearFilters?: () => void
}

export function JobFilters({ onApplyFilters, onClearFilters }: JobFiltersProps) {
  return (
    <Card className='sticky top-5'>
      <CardContent className='p-6'>
        <div className='flex items-center mb-4'>
          <Filter className='h-5 w-5 mr-2' />
          <h3 className='font-semibold'>Bộ lọc tìm kiếm</h3>
        </div>

        <div className='space-y-6'>
          {/* Keywords */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Từ khóa</label>
            <Input placeholder='Tìm kiếm công việc...' className='w-full' />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Danh mục</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Tất cả danh mục' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả danh mục</SelectItem>
                <SelectItem value='design'>Thiết kế</SelectItem>
                <SelectItem value='development'>Phát triển</SelectItem>
                <SelectItem value='marketing'>Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Ngân sách (VND)</label>
            <div className='space-y-2'>
              <Input type='number' placeholder='Từ' className='w-full' />
              <Input type='number' placeholder='Đến' className='w-full' />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Thời hạn</label>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='under-1-week' />
                <label htmlFor='under-1-week' className='text-sm cursor-pointer'>
                  Dưới 1 tuần
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='1-4-weeks' />
                <label htmlFor='1-4-weeks' className='text-sm cursor-pointer'>
                  1-4 tuần
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='1-3-months' />
                <label htmlFor='1-3-months' className='text-sm cursor-pointer'>
                  1-3 tháng
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='over-3-months' />
                <label htmlFor='over-3-months' className='text-sm cursor-pointer'>
                  Trên 3 tháng
                </label>
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Cấp độ kinh nghiệm</label>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Checkbox id='entry-level' />
                <label htmlFor='entry-level' className='text-sm cursor-pointer'>
                  Mới bắt đầu
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='intermediate' />
                <label htmlFor='intermediate' className='text-sm cursor-pointer'>
                  Trung cấp
                </label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox id='expert' />
                <label htmlFor='expert' className='text-sm cursor-pointer'>
                  Chuyên gia
                </label>
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button className='w-full bg-gray-800 hover:bg-gray-900 text-white' onClick={onApplyFilters}>
            <Search className='h-4 w-4 mr-2' />
            Áp dụng bộ lọc
          </Button>

          {/* Clear Filters */}
          <button className='w-full text-center text-blue-600 hover:text-blue-800 text-sm' onClick={onClearFilters}>
            Xóa bộ lọc
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
