import { ArrowRight, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'

export default function PostNewProject() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }
  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-teal-500 mb-2'>Đăng Dự Án Mới</h1>
        <p className='text-gray-600'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
      </div>

      {/* Progress Steps */}
      <div className='flex items-center justify-center mb-12'>
        <div className='flex items-center space-x-8'>
          {/* Step 1 - Active */}
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
              1
            </div>
            <span className='ml-2 text-blue-600 font-medium'>Thông tin cơ bản</span>
          </div>

          <ArrowRight className='w-4 h-4 text-gray-400' />

          {/* Step 2 */}
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold'>
              2
            </div>
            <span className='ml-2 text-gray-600'>Chi tiết dự án</span>
          </div>

          <ArrowRight className='w-4 h-4 text-gray-400' />

          {/* Step 3 */}
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold'>
              3
            </div>
            <span className='ml-2 text-gray-600'>Hoàn thành</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
        <div className='flex items-center mb-6'>
          <div className='w-3 h-3 bg-blue-600 rounded-full mr-3'></div>
          <h2 className='text-xl font-semibold text-gray-900'>Chi tiết dự án</h2>
        </div>

        <p className='text-gray-600 mb-8'>Cung cấp thông tin chi tiết để freelancer hiểu rõ yêu cầu</p>

        <form className='space-y-8'>
          {/* Skills Required */}
          <div>
            <Label htmlFor='skills' className='text-base font-medium text-gray-900 mb-2 block'>
              Kỹ năng yêu cầu
            </Label>
            <Textarea
              id='skills'
              placeholder='Nhập kỹ năng cần thiết (VD: React, Node.js, Design)'
              className='min-h-[60px] resize-none'
            />
            <p className='text-sm text-gray-500 mt-1'>Nhập các kỹ năng cần thiết, cách nhau bằng dấu phẩy</p>
          </div>

          {/* File Upload */}
          <div>
            <Label className='text-base font-medium text-gray-900 mb-2 block'>Tệp đính kèm</Label>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'>
              <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600 mb-2'>Kéo thả tệp vào đây hoặc</p>
              <Button variant='outline' onClick={() => document.getElementById('file-upload')?.click()}>
                Chọn tệp
              </Button>
              <input id='file-upload' type='file' multiple className='hidden' onChange={handleFileUpload} />
              <p className='text-sm text-gray-500 mt-4'>Hỗ trợ PDF, DOC, DOCX, JPG, PNG (Tối đa 10MB)</p>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <Label htmlFor='requirements' className='text-base font-medium text-gray-900 mb-2 block'>
              Yêu cầu đặc biệt
            </Label>
            <Textarea
              id='requirements'
              placeholder='Mô tả các yêu cầu đặc biệt, quy trình làm việc, tiêu chuẩn chất lượng...'
              className='min-h-[100px] resize-none'
            />
          </div>

          {/* Experience and Freelancer Count */}
          <div>
            <p className='text-base font-medium text-gray-900 mb-4'>
              Cung cấp thông tin chi tiết về yêu cầu và kỳ vọng
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Experience Level */}
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>Mức độ kinh nghiệm</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn mức độ kinh nghiệm...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='beginner'>Mới bắt đầu</SelectItem>
                    <SelectItem value='intermediate'>Trung cấp</SelectItem>
                    <SelectItem value='expert'>Chuyên gia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Freelancer Count */}
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>Số lượng freelancer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn số lượng...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1 freelancer</SelectItem>
                    <SelectItem value='2-5'>2-5 freelancer</SelectItem>
                    <SelectItem value='5+'>Hơn 5 freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
              {/* Experience Level Required */}
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Mức độ kinh nghiệm tối thiểu yêu cầu
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn mức độ kinh nghiệm...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='entry'>Mới vào nghề</SelectItem>
                    <SelectItem value='intermediate'>Trung cấp</SelectItem>
                    <SelectItem value='expert'>Chuyên gia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Freelancer Specialization */}
              <div>
                <Label className='text-sm font-medium text-gray-700 mb-2 block'>Số lượng freelancer cần tuyển</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn số lượng...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1 người</SelectItem>
                    <SelectItem value='2-3'>2-3 người</SelectItem>
                    <SelectItem value='4+'>4+ người</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div>
            <Label className='text-base font-medium text-gray-900 mb-4 block'>Tùy chọn bổ sung</Label>

            <RadioGroup defaultValue='option1' className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='option1' id='option1' />
                <Label htmlFor='option1' className='text-sm text-gray-700'>
                  Dự án khẩn cấp (hoàn thành trong 7 ngày)
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='option2' id='option2' />
                <Label htmlFor='option2' className='text-sm text-gray-700'>
                  Yêu cầu ký thỏa thuận bảo mật (NDA)
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='option3' id='option3' />
                <Label htmlFor='option3' className='text-sm text-gray-700'>
                  Phỏng vấn trước khi tuyển chọn
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-between pt-6'>
            <Button variant='outline' className='px-8 bg-transparent'>
              Quay lại
            </Button>
            <Button className='px-8 bg-gray-900 hover:bg-gray-800'>Tiếp theo →</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
