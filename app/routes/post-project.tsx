import { ArrowRight, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { AuthErrorBoundary } from '~/components/errors'
import { ProjectFormFields, ProjectFormTips, ProjectFormPreview, ProjectFormSteps } from '~/components/post-project'
import { useRecruitmentForm } from '~/contexts/RecruitmentFormContext'
import { recruitmentApi } from '~/apis/recruitment.api'
import { postProjectStep1Schema, type PostProjectStep1FormValues } from '~/lib/validations/post-project.schema'

function PostProjectPage() {
  const navigate = useNavigate()
  const { step1Data, setStep1Data, setCurrentStep } = useRecruitmentForm()
  const [selectedSkills, setSelectedSkills] = useState<string[]>(step1Data?.skills || [])
  const [startDate, setStartDate] = useState<Date | undefined>(
    step1Data?.startDate ? new Date(step1Data.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(step1Data?.endDate ? new Date(step1Data.endDate) : undefined)

  // Fetch categories with React Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['recruitment-categories'],
    queryFn: async () => {
      const res = await recruitmentApi.getCategories()
      return res.data
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Fetch skills with React Query
  const {
    data: skills = [],
    isLoading: skillsLoading,
    error: skillsError
  } = useQuery({
    queryKey: ['recruitment-skills'],
    queryFn: async () => {
      const res = await recruitmentApi.getSkills()
      return res.data
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const isLoading = categoriesLoading || skillsLoading

  // Show error toast if data fetch fails
  if (categoriesError || skillsError) {
    toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
  }

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

  // Set current step on mount
  useEffect(() => {
    setCurrentStep(1)
  }, [setCurrentStep])

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

    navigate('/post-project-confirm')
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <AnimatePresence mode='wait'>
        <motion.div
          key='post-project-form'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
              Đăng Dự Án Mới
            </h1>
            <p className='text-muted-foreground'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
          </div>

          <ProjectFormSteps currentStep={1} />

          {/* Loading Skeleton */}
          {isLoading && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2 space-y-6'>
                <Card>
                  <CardHeader>
                    <Skeleton className='h-6 w-48' />
                  </CardHeader>
                  <CardContent data-slot='card-content' className='space-y-6'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-10 w-full' />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className='space-y-6'>
                <Skeleton className='h-64 w-full' />
                <Skeleton className='h-80 w-full' />
              </div>
            </div>
          )}

          {/* Form Content */}
          {!isLoading && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              <div className='lg:col-span-2'>
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <div className='h-2 w-2 rounded-full bg-primary' />
                      <h2 className='text-lg font-semibold'>Thông tin cơ bản</h2>
                    </div>
                    <p className='text-sm text-muted-foreground mt-2'>Hãy mô tả dự án của bạn một cách rõ ràng</p>
                  </CardHeader>

                  <CardContent data-slot='card-content'>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                      <ProjectFormFields
                        form={form}
                        categories={categories}
                        skills={skills}
                        selectedSkills={selectedSkills}
                        onToggleSkill={(skillId) => {
                          setSelectedSkills((prev) =>
                            prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
                          )
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                      />

                      <div className='pt-4 flex justify-end'>
                        <Button type='submit' size='lg' disabled={form.formState.isSubmitting} className='px-8 group'>
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              Tiếp theo
                              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className='space-y-6'>
                <ProjectFormTips />
                <ProjectFormPreview
                  formData={form.watch()}
                  categories={categories}
                  skills={skills}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
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
