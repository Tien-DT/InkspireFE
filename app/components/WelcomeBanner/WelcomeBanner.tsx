import { BookOpen, Eye } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'

export default function WelcomeBanner() {
  return (
    <div className='bg-section rounded-2xl p-6 text-white'>
      <div className='flex items-center space-x-2 mb-2'>
        <h1 className='text-2xl font-bold'>Chào mừng trở lại, Nguyễn Tuấn Anh!</h1>
        <span className='text-2xl'>👋</span>
      </div>
      <p className='text-white/90 mb-4'>
        Bạn có 5 dự án xuất mới và 2 tin nhắn chưa đọc. Hãy tiếp tục phát triển sự nghiệp sáng tạo của mình!
      </p>

      <div className='flex items-center space-x-3'>
        <Button
          variant='secondary'
          size='sm'
          className='flex items-center gap-3 bg-white hover:bg-white/30 text-primary border-white/30'
        >
          <Eye className='w-4 h-4' />
          <span>Xem đề xuất</span>
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-3 bg-transparent border-white/30 text-white hover:bg-white/10'
        >
          <BookOpen className='w-4 h-4' />
          <span>Quản lý truyện</span>
        </Button>
      </div>
    </div>
  )
}
