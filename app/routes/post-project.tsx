import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { AuthErrorBoundary } from '~/components/errors'
import { ProjectFormFields, ProjectFormTips, ProjectFormPreview, ProjectFormSteps } from '~/components/post-project'
import { useRecruitmentForm } from '~/contexts/RecruitmentFormContext'
import { recruitmentApi } from '~/apis/recruitment.api'
import { postProjectStep1Schema, type PostProjectStep1FormValues } from '~/lib/validations/post-project.schema'
import type { RecruitmentCategory, Skill } from '~/types/recruitment.type'

function PostProjectPage() {
  const navigate = useNavigate()
  const { step1Data, setStep1Data, setCurrentStep } = useRecruitmentForm()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [categories, setCategories] = useState<RecruitmentCategory[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const form = useForm<PostProjectStep1FormValues>({
    resolver: zodResolver(postProjectStep1Schema),
    defaultValues: {
      title: step1Data?.title || '',
      category: step1Data?.category || '',
      description: step1Data?.description || '',
      budget: step1Data?.budget || 0,
      startDate: step1Data?.startDate || '',
      endDate: step1Data?.endDate || '',
      skills: step1Data?.skills || []
    }
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

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => {
      const newSkills = prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
      form.setValue('skills', newSkills, { shouldValidate: true })
      return newSkills
    })
  }

  const onSubmit = (data: PostProjectStep1FormValues) => {
    setStep1Data({
      title: data.title,
      category: data.category,
      description: data.description,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
      skills: data.skills
    })

    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/post-project-confirm')
    }, 500)
  }

  const formData = form.watch()

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <div
        className={`transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gradient mb-2'>Đăng Dự Án Mới</h1>
          <p className='text-gray-600'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
        </div>

        <ProjectFormSteps currentStep={1} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex items-center mb-6'>
                  <div className='w-2 h-2 bg-blue-600 rounded-full mr-3'></div>
                  <h2 className='text-lg font-semibold'>Thông tin cơ bản</h2>
                </div>
                <p className='text-gray-600 mb-6'>Hãy mô tả dự án của bạn một cách rõ ràng</p>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <ProjectFormFields
                    form={form}
                    categories={categories}
                    skills={skills}
                    selectedSkills={selectedSkills}
                    onToggleSkill={toggleSkill}
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                  />

                  <div className='pt-4'>
                    <Button type='submit' className='btn-submit px-8 py-3'>
                      Tiếp theo
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <ProjectFormTips />
            <ProjectFormPreview
              formData={formData}
              categories={categories}
              skills={skills}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PostProject() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <PostProjectPage />
    </AuthErrorBoundary>
  )
}
