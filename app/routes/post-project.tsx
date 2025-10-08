import { ArrowRight, Lightbulb, X, Calendar as CalendarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Calendar } from '~/components/ui/calendar'
import { useRecruitmentForm } from '~/contexts/RecruitmentFormContext'
import { recruitmentApi } from '~/apis/recruitment.api'
import type { PostProjectStep1, RecruitmentCategory, Skill } from '~/types/recruitment.type'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { format } from 'date-fns'

export default function PostProject() {
  const navigate = useNavigate()
  const { step1Data, setStep1Data, setCurrentStep } = useRecruitmentForm()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [categories, setCategories] = useState<RecruitmentCategory[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [formData, setFormData] = useState<Omit<PostProjectStep1, 'startDate' | 'endDate' | 'skills'>>({
    title: step1Data?.title || '',
    category: step1Data?.category || '',
    description: step1Data?.description || '',
    budget: step1Data?.budget || 0
  })

  useEffect(() => {
    setCurrentStep(1)

    const fetchData = async () => {
      try {
        const [categoriesRes, skillsRes] = await Promise.all([
          recruitmentApi.getCategories(),
          recruitmentApi.getSkills()
        ])
        setCategories(categoriesRes.data)
        setSkills(skillsRes.data)
      } catch {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
      }
    }

    fetchData()

    if (step1Data) {
      setSelectedSkills(step1Data.skills || [])
      if (step1Data.startDate) setStartDate(new Date(step1Data.startDate))
      if (step1Data.endDate) setEndDate(new Date(step1Data.endDate))
    }
  }, [setCurrentStep, step1Data])

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  const handleNext = () => {
    if (!formData.title || !formData.category || !formData.description || !formData.budget) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc')
      return
    }

    if (endDate < startDate) {
      toast.error('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
      return
    }

    if (selectedSkills.length === 0) {
      toast.error('Vui lòng chọn ít nhất một kỹ năng')
      return
    }

    const finalData: PostProjectStep1 = {
      ...formData,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      skills: selectedSkills
    }

    setStep1Data(finalData)
    setIsTransitioning(true)

    setTimeout(() => {
      navigate('/post-project-confirm')
    }, 500)
  }

  const skillColors = ['blue', 'purple', 'orange', 'pink', 'green', 'yellow', 'red', 'indigo'] as const

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <div
        className={`transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gradient mb-2'>Đăng Dự Án Mới</h1>
          <p className='text-gray-600'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
        </div>

        <div className='flex items-center justify-center mb-8'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300'>
                1
              </div>
              <span className='ml-2 text-blue-600 font-medium'>Thông tin cơ bản</span>
            </div>
            <ArrowRight className='h-4 w-4 text-gray-400' />
            <div className='flex items-center opacity-50'>
              <div className='w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium'>
                2
              </div>
              <span className='ml-2 text-gray-600'>Xác nhận</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center mb-6'>
                  <div className='w-2 h-2 bg-blue-600 rounded-full mr-3'></div>
                  <h2 className='text-lg font-semibold'>Thông tin cơ bản</h2>
                </div>
                <p className='text-gray-600 mb-6'>Hãy mô tả dự án của bạn một cách rõ ràng</p>

                <div className='space-y-6'>
                  <div>
                    <label className='block text-md font-semibold text-gray-700 mb-2'>Tiêu đề dự án</label>
                    <Input
                      placeholder='Tiêu đề ngắn gọn, thu hút và mô tả chính xác dự án'
                      className='w-full'
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                    <p className='text-sm text-gray-500 mt-1'>Tiêu đề ngắn gọn, thu hút và mô tả chính xác dự án</p>
                  </div>

                  <div>
                    <label className='block text-md font-semibold text-gray-700 mb-2'>Danh mục dự án</label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn danh mục' />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-sm text-gray-500 mt-1'>Chọn danh mục phù hợp để freelancer dễ tìm thấy</p>
                  </div>

                  <div>
                    <label className='block text-md font-semibold text-gray-700 mb-2'>Mô tả dự án</label>
                    <Textarea
                      placeholder='Mô tả chi tiết về dự án, yêu cầu, mong đợi của bạn'
                      rows={6}
                      className='w-full'
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <p className='text-sm text-gray-500 mt-1'>Mô tả càng chi tiết, freelancer càng hiểu rõ yêu cầu</p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-md font-semibold text-gray-700 mb-2'>Ngân sách (VNĐ)</label>
                      <Input
                        type='number'
                        placeholder='Nhập ngân sách'
                        className='w-full'
                        value={formData.budget || ''}
                        onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                        min={0}
                      />
                      <p className='text-sm text-gray-500 mt-1'>Nhập số tiền ngân sách dự kiến</p>
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row gap-6'>
                    <div className='basis-1/2 w-full min-w-0'>
                      <label className='block text-md font-semibold text-gray-700 mb-2'>Ngày bắt đầu</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !startDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {startDate ? format(startDate, 'PPP') : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className='text-sm text-gray-500 mt-1'>Thời gian mở form đăng tuyển</p>
                    </div>

                    <div className='basis-1/2 w-full min-w-0'>
                      <label className='block text-md font-semibold text-gray-700 mb-2'>Ngày kết thúc</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !endDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {endDate ? format(endDate, 'PPP') : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date < (startDate || new Date(new Date().setHours(0, 0, 0, 0)))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className='text-sm text-gray-500 mt-1'>Ngày kết thúc không được nhỏ hơn ngày bắt đầu</p>
                    </div>
                  </div>

                  <div>
                    <label className='block text-md font-semibold text-gray-700 mb-2'>Kỹ năng yêu cầu</label>
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {selectedSkills.map((skillId) => {
                        const skill = skills.find((s) => s.id === skillId)
                        if (!skill) return null
                        const colorIndex = skills.findIndex((s) => s.id === skillId) % skillColors.length
                        return (
                          <Badge key={skillId} variant={skillColors[colorIndex]} className='cursor-pointer gap-1'>
                            {skill.name}
                            <X className='h-3 w-3' onClick={() => toggleSkill(skillId)} />
                          </Badge>
                        )
                      })}
                    </div>
                    <Select value='' onValueChange={(value) => toggleSkill(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn kỹ năng' />
                      </SelectTrigger>
                      <SelectContent>
                        {skills
                          .filter((skill) => !selectedSkills.includes(skill.id))
                          .map((skill) => (
                            <SelectItem key={skill.id} value={skill.id}>
                              {skill.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className='text-sm text-gray-500 mt-1'>Chọn các kỹ năng cần thiết cho dự án</p>
                  </div>

                  <div className='pt-4'>
                    <Button className='btn-submit px-8 py-3' onClick={handleNext}>
                      Tiếp theo
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center mb-4'>
                  <Lightbulb className='h-5 w-5 text-yellow-500 mr-2' />
                  <h3 className='font-semibold'>Tips thành công</h3>
                </div>

                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-sm mb-1'>Tiêu đề rõ ràng</h4>
                    <p className='text-sm text-gray-600'>Sử dụng từ khóa chính xác để thu hút freelancer phù hợp</p>
                  </div>

                  <div>
                    <h4 className='font-medium text-sm mb-1'>Mô tả chi tiết</h4>
                    <p className='text-sm text-gray-600'>Cung cấp đầy đủ thông tin về yêu cầu và kỳ vọng</p>
                  </div>

                  <div>
                    <h4 className='font-medium text-sm mb-1'>Ngân sách hợp lý</h4>
                    <p className='text-sm text-gray-600'>Đặt mức ngân sách phù hợp để thu hút freelancer chất lượng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <h3 className='font-semibold mb-4'>Xem trước dự án</h3>

                <div className='space-y-3'>
                  <div>
                    <span className='text-sm text-gray-600'>Tiêu đề</span>
                    <p className='text-sm font-medium'>{formData.title || 'Chưa nhập'}</p>
                  </div>

                  <div>
                    <span className='text-sm text-gray-600'>Danh mục</span>
                    <p className='text-sm font-medium'>
                      {categories.find((c) => c.id === formData.category)?.title || 'Chưa chọn'}
                    </p>
                  </div>

                  <div>
                    <span className='text-sm text-gray-600'>Ngân sách</span>
                    <p className='text-sm font-medium'>
                      {formData.budget ? `${formData.budget.toLocaleString()} VNĐ` : 'Chưa nhập'}
                    </p>
                  </div>

                  <div>
                    <span className='text-sm text-gray-600'>Thời gian</span>
                    <p className='text-sm font-medium'>
                      {startDate && endDate
                        ? `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
                        : 'Chưa chọn'}
                    </p>
                  </div>

                  <div>
                    <span className='text-sm text-gray-600'>Kỹ năng</span>
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {selectedSkills.length > 0 ? (
                        selectedSkills.map((skillId) => {
                          const skill = skills.find((s) => s.id === skillId)
                          return skill ? (
                            <Badge key={skillId} variant='outline' className='text-xs'>
                              {skill.name}
                            </Badge>
                          ) : null
                        })
                      ) : (
                        <p className='text-sm font-medium'>Chưa chọn</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
