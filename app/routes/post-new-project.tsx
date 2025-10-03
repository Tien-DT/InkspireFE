// This route is temporarily disabled
// The functionality has been moved to post-project.tsx

export default function PostNewProject() {
  return null
}

// import { ArrowLeft, ArrowRight } from 'lucide-react'
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router'
// import { Button } from '~/components/ui/button'
// import { Label } from '~/components/ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
// import { Textarea } from '~/components/ui/textarea'
// import { Checkbox } from '~/components/ui/checkbox'
// import { useRecruitmentForm } from '~/contexts/RecruitmentFormContext'
// import type { PostProjectStep2, ExperienceLevel } from '~/types/recruitment.type'
// import { Input } from '~/components/ui/input'

// export default function PostNewProject() {
//   const navigate = useNavigate()
//   const { step1Data, step2Data, setStep2Data, setCurrentStep } = useRecruitmentForm()

//   const [formData, setFormData] = useState<PostProjectStep2>({
//     skills: step2Data?.skills || [],
//     specialRequirements: step2Data?.specialRequirements || '',
//     experienceLevel: step2Data?.experienceLevel || ('INTERMEDIATE' as ExperienceLevel),
//     teamSize: step2Data?.teamSize || 1,
//     isUrgent: step2Data?.isUrgent || false,
//     requireNDA: step2Data?.requireNDA || false,
//     requireInterview: step2Data?.requireInterview || false
//   })

//   const [skillsInput, setSkillsInput] = useState(formData.skills.join(', '))

//   useEffect(() => {
//     setCurrentStep(2)
//     if (!step1Data) {
//       navigate('/post-project')
//     }
//   }, [setCurrentStep, step1Data, navigate])

//   const handleInputChange = (field: keyof PostProjectStep2, value: string | number | ExperienceLevel | boolean | string[]) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleNext = (e: React.FormEvent) => {
//     e.preventDefault()

//     const skillsArray = skillsInput
//       .split(',')
//       .map((s) => s.trim())
//       .filter(Boolean)

//     if (skillsArray.length === 0 || !formData.experienceLevel || !formData.teamSize) {
//       alert('Vui lòng điền đầy đủ thông tin')
//       return
//     }

//     const finalData: PostProjectStep2 = {
//       ...formData,
//       skills: skillsArray
//     }

//     console.log('Setting step2Data:', finalData)
//     console.log('Current step1Data:', step1Data)

//     setStep2Data(finalData)

//     setTimeout(() => {
//       console.log('Navigating to confirm page')
//       navigate('/post-project-confirm')
//     }, 100)
//   }

//   const handleBack = () => {
//     const skillsArray = skillsInput
//       .split(',')
//       .map((s) => s.trim())
//       .filter(Boolean)

//     setStep2Data({
//       ...formData,
//       skills: skillsArray
//     })

//     navigate('/post-project')
//   }

//   return (
//     <div className='container mx-auto px-4 py-6 space-y-6'>
//       <div className='text-center mb-8'>
//         <h1 className='text-3xl font-bold text-teal-500 mb-2'>Đăng Dự Án Mới</h1>
//         <p className='text-gray-600'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
//       </div>

//       <div className='flex items-center justify-center mb-12'>
//         <div className='flex items-center space-x-8'>
//           <div className='flex items-center'>
//             <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
//               1
//             </div>
//             <span className='ml-2 text-blue-600 font-medium'>Thông tin cơ bản</span>
//           </div>

//           <ArrowRight className='w-4 h-4 text-gray-400' />

//           <div className='flex items-center'>
//             <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold'>
//               2
//             </div>
//             <span className='ml-2 text-blue-600 font-medium'>Chi tiết dự án</span>
//           </div>

//           <ArrowRight className='w-4 h-4 text-gray-400' />

//           <div className='flex items-center'>
//             <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold'>
//               3
//             </div>
//             <span className='ml-2 text-gray-600'>Hoàn thành</span>
//           </div>
//         </div>
//       </div>

//       <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
//         <div className='flex items-center mb-6'>
//           <div className='w-3 h-3 bg-blue-600 rounded-full mr-3'></div>
//           <h2 className='text-xl font-semibold text-gray-900'>Chi tiết dự án</h2>
//         </div>

//         <p className='text-gray-600 mb-8'>Cung cấp thông tin chi tiết để freelancer hiểu rõ yêu cầu</p>

//         <form className='space-y-8'>
//           <div>
//             <Label htmlFor='skills' className='text-base font-medium text-gray-900 mb-2 block'>
//               Kỹ năng yêu cầu
//             </Label>
//             <Textarea
//               id='skills'
//               placeholder='Nhập kỹ năng cần thiết (VD: React, Node.js, Design)'
//               className='min-h-[60px] resize-none'
//               value={skillsInput}
//               onChange={(e) => setSkillsInput(e.target.value)}
//             />
//             <p className='text-sm text-gray-500 mt-1'>Nhập các kỹ năng cần thiết, cách nhau bằng dấu phẩy</p>
//           </div>

//           <div>
//             <Label htmlFor='requirements' className='text-base font-medium text-gray-900 mb-2 block'>
//               Yêu cầu đặc biệt
//             </Label>
//             <Textarea
//               id='requirements'
//               placeholder='Mô tả các yêu cầu đặc biệt, quy trình làm việc, tiêu chuẩn chất lượng...'
//               className='min-h-[100px] resize-none'
//               value={formData.specialRequirements}
//               onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
//             />
//           </div>

//           <div>
//             <p className='text-base font-medium text-gray-900 mb-4'>Cung cấp thông tin chi tiết về yêu cầu và kỳ vọng</p>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//               <div>
//                 <Label className='text-sm font-medium text-gray-700 mb-2 block'>Mức độ kinh nghiệm</Label>
//                 <Select
//                   value={formData.experienceLevel}
//                   onValueChange={(value) => handleInputChange('experienceLevel', value as ExperienceLevel)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder='Chọn mức độ kinh nghiệm...' />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value='BEGINNER'>Mới bắt đầu</SelectItem>
//                     <SelectItem value='INTERMEDIATE'>Trung cấp</SelectItem>
//                     <SelectItem value='EXPERT'>Chuyên gia</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label className='text-sm font-medium text-gray-700 mb-2 block'>Số lượng freelancer</Label>
//                 <Input
//                   type='number'
//                   min='1'
//                   placeholder='Nhập số lượng'
//                   value={formData.teamSize}
//                   onChange={(e) => handleInputChange('teamSize', Number(e.target.value))}
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <Label className='text-base font-medium text-gray-900 mb-4 block'>Tùy chọn bổ sung</Label>

//             <div className='space-y-3'>
//               <div className='flex items-center space-x-2'>
//                 <Checkbox
//                   id='urgent'
//                   checked={formData.isUrgent}
//                   onCheckedChange={(checked) => handleInputChange('isUrgent', !!checked)}
//                 />
//                 <Label htmlFor='urgent' className='text-sm text-gray-700'>
//                   Dự án khẩn cấp (hoàn thành trong 7 ngày)
//                 </Label>
//               </div>

//               <div className='flex items-center space-x-2'>
//                 <Checkbox
//                   id='nda'
//                   checked={formData.requireNDA}
//                   onCheckedChange={(checked) => handleInputChange('requireNDA', !!checked)}
//                 />
//                 <Label htmlFor='nda' className='text-sm text-gray-700'>
//                   Yêu cầu ký thỏa thuận bảo mật (NDA)
//                 </Label>
//               </div>

//               <div className='flex items-center space-x-2'>
//                 <Checkbox
//                   id='interview'
//                   checked={formData.requireInterview}
//                   onCheckedChange={(checked) => handleInputChange('requireInterview', !!checked)}
//                 />
//                 <Label htmlFor='interview' className='text-sm text-gray-700'>
//                   Phỏng vấn trước khi tuyển chọn
//                 </Label>
//               </div>
//             </div>
//           </div>

//           <div className='flex justify-between pt-6'>
//             <Button variant='outline' className='px-8 bg-transparent' onClick={handleBack} type='button'>
//               <ArrowLeft className='mr-2 h-4 w-4' />
//               Quay lại
//             </Button>
//             <Button className='px-8 bg-gray-900 hover:bg-gray-800' onClick={(e) => handleNext(e)} type='button'>
//               Tiếp theo
//               <ArrowRight className='ml-2 h-4 w-4' />
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
