import { useState, useRef, useEffect } from 'react'
import { Plus, Image, Eye, Trash2, FileUp, Loader2 } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import type { PortfolioItem } from '~/types/profile.type'
import { portfolioApi } from '~/apis/portfolio.api'
import { toast } from 'sonner'

interface PortfolioEditTabProps {
  initialItems: PortfolioItem[]
  onSave: (items: PortfolioItem[]) => void
  onCancel: () => void
}

export function PortfolioEditTab({ initialItems, onSave, onCancel }: PortfolioEditTabProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(initialItems)
  const [uploadingStates, setUploadingStates] = useState<Record<string, { image: boolean; pdf: boolean }>>({})
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const pdfInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Ensure buckets exist when component mounts
  useEffect(() => {
    // Try to create buckets via backend (has service_role permissions)
    portfolioApi.initializePortfolioBuckets().catch(err => {
      console.log('Backend bucket initialization failed (might already exist):', err)
    })
  }, [])

  const handleAddPortfolio = () => {
    const newItem: PortfolioItem = {
      id: `temp-${Date.now()}`,
      name: '',
      project: '',
      skill: '',
      description: '',
      imageUrl: '',
      pdfUrl: ''
    }
    setPortfolioItems([...portfolioItems, newItem])
    setUploadingStates({ ...uploadingStates, [newItem.id]: { image: false, pdf: false } })
  }

  const handleRemovePortfolio = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
    const newStates = { ...uploadingStates }
    delete newStates[id]
    setUploadingStates(newStates)
  }

  const handleUpdatePortfolio = (id: string, field: keyof PortfolioItem, value: string) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleImageUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    setUploadingStates({ ...uploadingStates, [id]: { ...uploadingStates[id], image: true } })

    try {
      const imageUrl = await portfolioApi.uploadPortfolioImage(file)
      handleUpdatePortfolio(id, 'imageUrl', imageUrl)
      toast.success('Upload ảnh thành công')
    } catch (error) {
      console.error('Upload image error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Upload ảnh thất bại'
      toast.error(errorMsg)
    } finally {
      setUploadingStates({ ...uploadingStates, [id]: { ...uploadingStates[id], image: false } })
    }
  }

  const handlePdfUpload = async (id: string, file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Vui lòng chọn file PDF')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước PDF không được vượt quá 10MB')
      return
    }

    setUploadingStates({ ...uploadingStates, [id]: { ...uploadingStates[id], pdf: true } })

    try {
      const pdfUrl = await portfolioApi.uploadPortfolioPdf(file)
      handleUpdatePortfolio(id, 'pdfUrl', pdfUrl)
      toast.success('Upload PDF thành công')
    } catch (error) {
      console.error('Upload PDF error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Upload PDF thất bại'
      toast.error(errorMsg)
    } finally {
      setUploadingStates({ ...uploadingStates, [id]: { ...uploadingStates[id], pdf: false } })
    }
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
        <Button onClick={handleAddPortfolio} variant='shine'>
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
                {item.imageUrl ? (
                  <>
                    <img src={item.imageUrl} alt={item.name} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                      {item.pdfUrl && (
                        <Button size='sm' variant='secondary' onClick={() => window.open(item.pdfUrl, '_blank')}>
                          <Eye className='h-4 w-4 mr-1' />
                          Xem PDF
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <Image className='h-12 w-12 text-gray-400' />
                )}
              </div>
              <CardContent className='p-4 space-y-3'>
                <div>
                  <Label htmlFor={`name-${item.id}`} className='text-xs'>
                    Tên portfolio
                  </Label>
                  <Input
                    id={`name-${item.id}`}
                    value={item.name}
                    onChange={(e) => handleUpdatePortfolio(item.id, 'name', e.target.value)}
                    placeholder='Nhập tên portfolio'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor={`project-${item.id}`} className='text-xs'>
                    Dự án
                  </Label>
                  <Input
                    id={`project-${item.id}`}
                    value={item.project}
                    onChange={(e) => handleUpdatePortfolio(item.id, 'project', e.target.value)}
                    placeholder='e.g. Website Design'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor={`skill-${item.id}`} className='text-xs'>
                    Kỹ năng
                  </Label>
                  <Input
                    id={`skill-${item.id}`}
                    value={item.skill}
                    onChange={(e) => handleUpdatePortfolio(item.id, 'skill', e.target.value)}
                    placeholder='e.g. UI/UX Design'
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
                    placeholder='Mô tả ngắn về portfolio'
                    rows={2}
                    className='mt-1'
                  />
                </div>
                <div className='flex gap-2 pt-2'>
                  <input
                    ref={(el) => (imageInputRefs.current[item.id] = el)}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(item.id, file)
                    }}
                  />
                  <input
                    ref={(el) => (pdfInputRefs.current[item.id] = el)}
                    type='file'
                    accept='application/pdf'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handlePdfUpload(item.id, file)
                    }}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => imageInputRefs.current[item.id]?.click()}
                    disabled={uploadingStates[item.id]?.image}
                  >
                    {uploadingStates[item.id]?.image ? (
                      <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                    ) : (
                      <Image className='h-4 w-4 mr-1' />
                    )}
                    {item.imageUrl ? 'Đổi ảnh' : 'Upload ảnh'}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => pdfInputRefs.current[item.id]?.click()}
                    disabled={uploadingStates[item.id]?.pdf}
                  >
                    {uploadingStates[item.id]?.pdf ? (
                      <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                    ) : (
                      <FileUp className='h-4 w-4 mr-1' />
                    )}
                    {item.pdfUrl ? 'Đổi PDF' : 'Upload PDF'}
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

      <div className='sticky -mx-6 bottom-0 flex justify-end gap-3 border-t border-border/60 bg-card/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={handleSave} variant='shine'>
          Lưu Portfolio
        </Button>
      </div>
    </div>
  )
}
