import { useState } from 'react'
import { Plus, Image, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import type { PortfolioItem } from '~/types/profile.type'

interface PortfolioEditTabProps {
  initialItems: PortfolioItem[]
  onSave: (items: PortfolioItem[]) => void
  onCancel: () => void
}

export function PortfolioEditTab({ initialItems, onSave, onCancel }: PortfolioEditTabProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialItems)

  const handleAddPortfolio = () => {
    const newItem: PortfolioItem = {
      id: Date.now(),
      title: '',
      category: '',
      description: '',
      image: ''
    }
    setPortfolioItems([...portfolioItems, newItem])
  }

  const handleRemovePortfolio = (id: number) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
  }

  const handleUpdatePortfolio = (id: number, field: keyof PortfolioItem, value: string) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSave = () => {
    onSave(portfolioItems)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-bold text-gray-900'>Portfolio của bạn</h3>
          <p className='text-sm text-gray-600 mt-1'>Thêm và quản lý các dự án của bạn</p>
        </div>
        <Button
          onClick={handleAddPortfolio}
          className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        >
          <Plus className='h-4 w-4 mr-2' />
          Thêm dự án mới
        </Button>
      </div>

      {portfolioItems.length === 0 ? (
        <div className='text-center py-12 border-2 border-dashed border-gray-300 rounded-lg'>
          <Image className='h-16 w-16 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có dự án nào</h3>
          <p className='text-gray-600 mb-4'>Thêm dự án đầu tiên để showcase portfolio của bạn</p>
          <Button onClick={handleAddPortfolio} variant='outline' className='border-2'>
            <Plus className='h-4 w-4 mr-2' />
            Thêm dự án mới
          </Button>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 gap-6'>
          {portfolioItems.map((item) => (
            <Card key={item.id} className='overflow-hidden'>
              <div className='aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative group'>
                <Image className='h-12 w-12 text-gray-400' />
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                  <Button size='sm' variant='secondary'>
                    <Eye className='h-4 w-4 mr-1' />
                    Xem
                  </Button>
                </div>
              </div>
              <CardContent className='p-4 space-y-3'>
                <div>
                  <Label htmlFor={`title-${item.id}`} className='text-xs'>
                    Tên dự án
                  </Label>
                  <Input
                    id={`title-${item.id}`}
                    value={item.title}
                    onChange={(e) => handleUpdatePortfolio(item.id, 'title', e.target.value)}
                    placeholder='Nhập tên dự án'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor={`category-${item.id}`} className='text-xs'>
                    Danh mục
                  </Label>
                  <Input
                    id={`category-${item.id}`}
                    value={item.category}
                    onChange={(e) => handleUpdatePortfolio(item.id, 'category', e.target.value)}
                    placeholder='e.g. Logo Design'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${item.id}`} className='text-xs'>
                    Mô tả
                  </Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => handleUpdatePortfolio(item.id, 'description', e.target.value)}
                    placeholder='Mô tả ngắn về dự án'
                    rows={2}
                    className='mt-1'
                  />
                </div>
                <div className='flex gap-2 pt-2'>
                  <Button variant='outline' size='sm' className='flex-1'>
                    <Image className='h-4 w-4 mr-1' />
                    Upload ảnh
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={() => handleRemovePortfolio(item.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className='flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        >
          Lưu Portfolio
        </Button>
      </div>
    </div>
  )
}
