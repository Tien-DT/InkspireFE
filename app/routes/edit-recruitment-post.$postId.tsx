import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { isAxiosError } from 'axios'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { ButtonSpinner } from '~/components/ui/button-spinner'
import { AuthErrorBoundary } from '~/components/errors'
import { ProjectFormFields, ProjectFormTips, ProjectFormPreview } from '~/components/post-project'
import { recruitmentApi } from '~/apis/recruitment.api'
import { postProjectStep1Schema, type PostProjectStep1FormValues } from '~/lib/validations/post-project.schema'
import { PATH } from '~/constants/path'

function EditRecruitmentPostPage() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Fetch recruitment post details
  const {
    data: postData,
    isLoading: postLoading,
    error: postError
  } = useQuery({
    queryKey: ['recruitment-post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('Post ID is required')
      const res = await recruitmentApi.getRecruitmentById(postId)
      return res.data
    },
    enabled: !!postId
  })

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
    staleTime: 5 * 60 * 1000
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
    staleTime: 5 * 60 * 1000
  })

  const isLoading = categoriesLoading || skillsLoading || postLoading

  const form = useForm<PostProjectStep1FormValues>({
    resolver: zodResolver(postProjectStep1Schema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      budget: 0,
      startDate: '',
      endDate: '',
      skills: []
    }
  })

  // Update form when post data is loaded
  useEffect(() => {
    if (postData) {
      const categoryId = postData.categories?.[0]?.id || ''
      const skillIds = postData.skills?.map((s: { id: string }) => s.id) || []
      const startDateValue = postData.startTime ? new Date(postData.startTime) : undefined
      const endDateValue = postData.endTime ? new Date(postData.endTime) : undefined

      form.reset({
        title: postData.title || '',
        category: categoryId,
        description: postData.description || '',
        budget: postData.budget || 0,
        startDate: postData.startTime || '',
        endDate: postData.endTime || '',
        skills: skillIds
      })

      setSelectedSkills(skillIds)
      setStartDate(startDateValue)
      setEndDate(endDateValue)
    }
  }, [postData, form])

  const updateMutation = useMutation({
    mutationFn: (data: {
      title: string
      description: string
      budget: number
      skillIds: string[]
    }) => {
      if (!postId) throw new Error('Post ID is required')
      return recruitmentApi.updateRecruitmentPost(postId, {
        title: data.title,
        description: data.description,
        budget: data.budget,
        skillIds: data.skillIds
      })
    },
    onSuccess: () => {
      toast.success('Cập nhật bài đăng thành công', {
        description: 'Thông tin bài đăng tuyển dụng đã được cập nhật.'
      })
      navigate(PATH.managePostProject)
    },
    onError: (error: unknown) => {
      const axiosMessage = isAxiosError(error) ? error.response?.data?.message : undefined
      const message =
        axiosMessage ??
        (error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật bài đăng. Vui lòng thử lại.')

      toast.error('Không thể cập nhật bài đăng', {
        description: message
      })
    }
  })

  if (postError) {
    toast.error('Không thể tải bài đăng', {
      description: 'Vui lòng thử lại sau.'
    })
  }

  if (categoriesError || skillsError) {
    toast.error('Không thể tải dữ liệu. Vui lòng thử lại.')
  }

  const onSubmit = (data: PostProjectStep1FormValues) => {
    updateMutation.mutate({
      title: data.title,
      description: data.description,
      budget: data.budget,
      skillIds: data.skills
    })
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <AnimatePresence mode='wait'>
        <motion.div
          key='edit-recruitment-post-form'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
              Chỉnh Sửa Bài Đăng Tuyển Dụng
            </h1>
            <p className='text-muted-foreground'>Cập nhật thông tin bài đăng tuyển dụng của bạn</p>
          </div>

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
                    <p className='text-sm text-muted-foreground mt-2'>Cập nhật thông tin bài đăng của bạn</p>
                  </CardHeader>

                  <CardContent data-slot='card-content'>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                      <ProjectFormFields
                        form={form}
                        categories={categories}
                        skills={skills}
                        selectedSkills={selectedSkills}
                        onToggleSkill={(skillId) => {
                          setSelectedSkills((prev) => {
                            const newSkills = prev.includes(skillId)
                              ? prev.filter((id) => id !== skillId)
                              : [...prev, skillId]
                            form.setValue('skills', newSkills)
                            return newSkills
                          })
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                      />

                      <div className='pt-4 flex justify-between'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => navigate(PATH.managePostProject)}
                          disabled={updateMutation.isPending}
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          type='submit'
                          size='lg'
                          disabled={updateMutation.isPending || form.formState.isSubmitting}
                          className='px-8 group'
                        >
                          {updateMutation.isPending || form.formState.isSubmitting ? (
                            <>
                              <ButtonSpinner className='mr-2' />
                              Đang cập nhật...
                            </>
                          ) : (
                            <>
                              Cập nhật
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

export default function EditRecruitmentPost() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <EditRecruitmentPostPage />
    </AuthErrorBoundary>
  )
}
