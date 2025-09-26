import { FileText, MoreHorizontal, Paperclip, Phone, Send, Video } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default function chat() {
  return (
    <div className='container mx-auto px-4 py-6 space-y-6 flex h-[calc(100vh-64px)]'>
      <div className='w-80 bg-white border-r border-gray-200 h-full'>
        <div className='p-4 border-b border-gray-200 min-h-[77px]'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-gray-900'>Tin nhắn</h2>
            <Button size='sm' className='bg-teal-500 hover:bg-teal-600 text-white rounded-full w-8 h-8 p-0'>
              <span className='text-lg'>+</span>
            </Button>
          </div>
        </div>

        <div className='overflow-y-auto'>
          {/* Active Conversation */}
          <div className='p-4 bg-blue-50 border-l-4 border-blue-500 cursor-pointer'>
            <div className='flex items-start space-x-3'>
              <div className='relative'>
                <Avatar className='w-10 h-10'>
                  <AvatarFallback className='bg-gray-200'>T</AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></div>
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900 text-sm'>TechViet Solutions</h3>
                  <span className='text-xs text-gray-500'>3h</span>
                </div>
                <p className='text-xs text-gray-600 truncate'>
                  Logo đã được phê duyệt, hãy tiến hành bước tiếp theo...
                </p>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-green-600 font-medium'>● Dự án đang hoạt động</span>
                  <span className='bg-blue-500 text-white text-xs rounded-full px-2 py-0.5'>2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Other Conversations */}
          <div className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100'>
            <div className='flex items-start space-x-3'>
              <Avatar className='w-10 h-10'>
                <AvatarFallback className='bg-gray-200'>G</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900 text-sm'>Green Life Co.</h3>
                  <span className='text-xs text-gray-500'>1s</span>
                </div>
                <p className='text-xs text-gray-600 truncate'>Cần chỉnh sửa một số chi tiết trong brochure...</p>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-yellow-600 font-medium'>Cần sửa đổi</span>
                  <span className='bg-blue-500 text-white text-xs rounded-full px-2 py-0.5'>1</span>
                </div>
              </div>
            </div>
          </div>

          <div className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100'>
            <div className='flex items-start space-x-3'>
              <Avatar className='w-10 h-10'>
                <AvatarFallback className='bg-gray-200'>D</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900 text-sm'>Digital Agency</h3>
                  <span className='text-xs text-gray-500'>1s</span>
                </div>
                <p className='text-xs text-gray-600 truncate'>Chào bạn, Dự án UI/UX cho ứng dụng UI/UX...</p>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-blue-600 font-medium'>Đã xuất môi</span>
                </div>
              </div>
            </div>
          </div>

          <div className='p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100'>
            <div className='flex items-start space-x-3'>
              <Avatar className='w-10 h-10'>
                <AvatarFallback className='bg-gray-200'>C</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-900 text-sm'>Creative Studio</h3>
                  <span className='text-xs text-gray-500'>2d</span>
                </div>
                <p className='text-xs text-gray-600 truncate'>Cần có bạn để hoàn thành dự án tuyệt vời</p>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-xs text-green-600 font-medium'>Hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Chat Header */}
        <div className='bg-white border-b border-gray-200 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Avatar className='w-10 h-10'>
                <AvatarFallback className='bg-gray-200'>T</AvatarFallback>
              </Avatar>
              <div>
                <h3 className='font-semibold text-gray-900'>TechViet Solutions</h3>
                <p className='text-sm text-green-600'>● Đang hoạt động</p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Button variant='ghost' size='icon'>
                <Phone className='h-5 w-5' />
              </Button>
              <Button variant='ghost' size='icon'>
                <Video className='h-5 w-5' />
              </Button>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-white'>
          <div className='text-center'>
            <span className='text-sm text-gray-500'>Hôm nay</span>
          </div>

          {/* Incoming Message */}
          <div className='flex items-start space-x-3'>
            <Avatar className='w-8 h-8'>
              <AvatarFallback className='bg-gray-200 text-xs'>T</AvatarFallback>
            </Avatar>
            <div className='max-w-xs'>
              <div className='bg-gray-100 rounded-lg p-3'>
                <p className='text-sm text-gray-900'>
                  Chào Nguyễn Văn A! Tôi đã xem qua thiết kế logo mà bạn gửi. Nhìn chung rất ấn tượng!
                </p>
              </div>
              <span className='text-xs text-gray-500 mt-1 block'>10:30 AM</span>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className='flex items-start space-x-3 justify-end'>
            <div className='max-w-xs'>
              <div className='bg-blue-500 rounded-lg p-3'>
                <p className='text-sm text-white'>
                  Cảm ơn anh! Tôi rất vui vì nghệ thuật đó. Có điều gì cần chỉnh sửa không ạ?
                </p>
              </div>
              <span className='text-xs text-gray-500 mt-1 block text-right'>10:32 AM</span>
            </div>
          </div>

          {/* File Message */}
          <div className='flex items-start space-x-3'>
            <Avatar className='w-8 h-8'>
              <AvatarFallback className='bg-gray-200 text-xs'>T</AvatarFallback>
            </Avatar>
            <div className='max-w-xs'>
              <div className='bg-gray-100 rounded-lg p-3'>
                <p className='text-sm text-gray-900'>
                  Có một vài điểm nhỏ cần điều chỉnh. Tôi đã đánh dấu trong file đính kèm:
                </p>
                <div className='flex items-center space-x-2 mt-2 p-2 bg-white rounded border'>
                  <FileText className='h-4 w-4 text-red-500' />
                  <div className='flex-1'>
                    <p className='text-xs font-medium'>logo_feedback.pdf</p>
                    <p className='text-xs text-gray-500'>245 KB</p>
                  </div>
                </div>
              </div>
              <span className='text-xs text-gray-500 mt-1 block'>10:35 AM</span>
            </div>
          </div>

          {/* Another Outgoing Message */}
          <div className='flex items-start space-x-3 justify-end'>
            <div className='max-w-xs'>
              <div className='bg-blue-500 rounded-lg p-3'>
                <p className='text-sm text-white'>
                  Dạ tôi sẽ xong và xem qua. Tôi sẽ chỉnh sửa theo yêu cầu và gửi lại trong vòng 2 giờ nữa.
                </p>
              </div>
              <span className='text-xs text-gray-500 mt-1 block text-right'>10:40 AM</span>
            </div>
          </div>

          {/* File Link */}
          <div className='text-center'>
            <a href='#' className='text-sm text-blue-600 hover:underline'>
              Nguyễn Văn A đã gửi file: logo-v2.ai
            </a>
          </div>

          {/* Final Message */}
          <div className='flex items-start space-x-3'>
            <Avatar className='w-8 h-8'>
              <AvatarFallback className='bg-gray-200 text-xs'>T</AvatarFallback>
            </Avatar>
            <div className='max-w-xs'>
              <div className='bg-gray-100 rounded-lg p-3'>
                <p className='text-sm text-gray-900'>
                  Perfect! Logo đã được phê duyệt. Hãy tiến hành bước tiếp theo - thiết kế business card nhé.
                </p>
              </div>
              <span className='text-xs text-gray-500 mt-1 block'>2 giờ trước</span>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className='bg-white border-t border-gray-200 p-4'>
          <div className='flex items-center space-x-3'>
            <Button variant='ghost' size='icon'>
              <Paperclip className='h-5 w-5' />
            </Button>
            <div className='flex-1'>
              <Input
                type='text'
                placeholder='Nhắn Enter để gửi, Shift+Enter để xuống dòng'
                className='border-0 focus:ring-0 focus:border-0'
              />
            </div>
            <Button className='bg-gray-900 hover:bg-gray-800 text-white rounded-full w-10 h-10 p-0'>
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
