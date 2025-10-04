import { ArrowRight, CheckCircle2, Eye, Lightbulb, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { projectApi, type CreateProjectPayload } from '~/apis/project.api'

const steps = [
  {
    id: 1,
    title: 'Thông tin cơ bản'
  },
  {
    id: 2,
    title: 'Chi tiết dự án'
  },
  {
    id: 3,
    title: 'Hoàn thành'
  }
]

const createProjectSchema = z
  .object({
    title: z.string().min(5, 'Tiêu đề dự án tối thiểu 5 ký tự'),
    category: z.string().min(1, 'Vui lòng chọn danh mục dự án'),
    description: z.string().min(20, 'Mô tả dự án tối thiểu 20 ký tự'),
    budgetMin: z
      .string()
      .min(1, 'Vui lòng nhập ngân sách tối thiểu')
      .regex(/^[0-9]+(\.[0-9]+)?$/, 'Ngân sách phải là số hợp lệ'),
    budgetMax: z
      .string()
      .min(1, 'Vui lòng nhập ngân sách tối đa')
      .regex(/^[0-9]+(\.[0-9]+)?$/, 'Ngân sách phải là số hợp lệ'),
    currency: z.string().min(1, 'Vui lòng chọn đơn vị tiền tệ'),
    deadline: z.string().min(1, 'Vui lòng chọn hạn chót'),
    timeline: z.string().min(1, 'Vui lòng chọn thời hạn thực hiện'),
    goal: z.string().min(5, 'Vui lòng nhập kết quả mong đợi'),
    status: z.string().min(1, 'Vui lòng chọn trạng thái dự án'),
    skills: z.string().min(5, 'Vui lòng nhập kỹ năng cần có'),
    requirements: z.string().min(10, 'Vui lòng nhập yêu cầu chi tiết'),
    experienceLevel: z.string().min(1, 'Vui lòng chọn mức độ kinh nghiệm'),
    freelancerCount: z.string().min(1, 'Vui lòng chọn số lượng freelancer'),
    minExperience: z.string().min(1, 'Vui lòng chọn kinh nghiệm tối thiểu'),
    teamSize: z.string().min(1, 'Vui lòng chọn quy mô đội ngũ'),
    extras: z.string().min(1, 'Vui lòng chọn tùy chọn bổ sung')
  })
  .refine((data) => Number(data.budgetMin) <= Number(data.budgetMax), {
    path: ['budgetMax'],
    message: 'Ngân sách tối đa phải lớn hơn hoặc bằng ngân sách tối thiểu'
  })

type CreateProjectFormValues = z.infer<typeof createProjectSchema>

const createProjectDefaultValues: CreateProjectFormValues = {
  title: '',
  category: '',
  description: '',
  budgetMin: '',
  budgetMax: '',
  currency: 'VND',
  deadline: '',
  timeline: '',
  goal: '',
  status: '1',
  skills: '',
  requirements: '',
  experienceLevel: '',
  freelancerCount: '',
  minExperience: '',
  teamSize: '',
  extras: 'urgent'
}

const categories = [
  'Thiết kế đồ họa',
  'Phát triển web',
  'Marketing & PR',
  'Biên dịch & Nội dung',
  'Kinh doanh & Tư vấn'
]

const timelines = ['Dưới 1 tuần', '1 - 4 tuần', '1 - 3 tháng', 'Trên 3 tháng']

const experienceOptions = ['Mới bắt đầu', 'Trung cấp', 'Chuyên gia']
const freelancerCounts = ['1 freelancer', '2 - 5 freelancer', 'Hơn 5 freelancer']
const minExperienceOptions = ['Mới vào nghề', 'Trung cấp', 'Chuyên gia']
const teamSizeOptions = ['1 người', '2 - 3 người', '4+ người']

const currencyOptions = [
  { value: 'VND', label: 'VND - Việt Nam đồng' },
  { value: 'USD', label: 'USD - Đô la Mỹ' }
]

const statusOptions = [
  { value: '1', label: 'Đang mở' },
  { value: '0', label: 'Nháp' }
]

const extrasOptions = [
  {
    id: 'urgent',
    label: 'Dự án khẩn cấp (hoàn thành trong 7 ngày)'
  },
  {
    id: 'nda',
    label: 'Yêu cầu ký thỏa thuận bảo mật (NDA)'
  },
  {
    id: 'interview',
    label: 'Phỏng vấn trước khi tuyển chọn'
  }
]

export default function PostRecruitmentPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: createProjectDefaultValues
  })

  const createProjectMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectApi.createProject(payload),
    onSuccess: (response: any) => {
      toast.success('Đăng dự án thành công', {
        description: response?.message ?? 'Dự án của bạn đã được tạo thành công.'
      })
      form.reset(createProjectDefaultValues)
      setSelectedFiles([])
      setCurrentStep(3)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Có lỗi xảy ra khi tạo dự án. Vui lòng thử lại.'

      toast.error('Không thể đăng dự án', {
        description: message
      })
    }
  })

  const isSubmitting = createProjectMutation.isPending
  const formValues = form.watch()

  const currencyPreviewLabel =
    currencyOptions.find((option) => option.value === formValues.currency)?.label ?? 'Chưa chọn'
  const statusPreviewLabel =
    statusOptions.find((option) => option.value === formValues.status)?.label ?? 'Chưa chọn'
  const extrasPreviewLabel =
    extrasOptions.find((option) => option.id === formValues.extras)?.label ?? 'Chưa chọn'
  const deadlinePreviewLabel = formValues.deadline
    ? new Date(formValues.deadline).toLocaleDateString('vi-VN')
    : 'Chưa chọn'

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleBasicSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = await form.trigger([
      'title',
      'category',
      'description',
      'budgetMin',
      'budgetMax',
      'currency',
      'deadline',
      'timeline',
      'goal',
      'status'
    ])

    if (isValid) {
      setCurrentStep(2)
    }
  }

  const onSubmit = (values: CreateProjectFormValues) => {
    const payload: CreateProjectPayload = {
      title: values.title,
      description: values.description,
      category: values.category,
      budgetMin: values.budgetMin ? Number(values.budgetMin) : null,
      budgetMax: values.budgetMax ? Number(values.budgetMax) : null,
      currency: values.currency,
      deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
      status: values.status ? Number(values.status) : null
    }

    createProjectMutation.mutate(payload)
  }

  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))
  }

  const handleReset = () => {
    setCurrentStep(1)
    form.reset(createProjectDefaultValues)
    createProjectMutation.reset()
    setSelectedFiles([])
  }

  return (
    <Form {...form}>
      <div className='min-h-screen bg-gradient-to-b from-[#e4f1ff] via-white to-white py-12'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-sky-500'>Tuyển dụng</p>
            <h1 className='mt-2 text-3xl font-bold text-slate-900 md:text-4xl'>Đăng Tuyển Dụng Mới</h1>
            <p className='mt-3 text-base text-muted-foreground md:text-lg'>Chia sẻ dự án của bạn với hàng nghìn freelancer tài năng</p>
          </div>

          <div className='mt-10 flex justify-center'>
            <div className='flex flex-wrap items-center justify-center gap-6 text-sm font-medium'>
              {steps.map((step, index) => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                const circleClass = isActive
                  ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-200'
                  : isCompleted
                    ? 'border-sky-400 bg-white text-sky-500'
                    : 'border-gray-300 bg-white text-gray-500'

                return (
                  <div key={step.id} className='flex items-center gap-3'>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${circleClass}`}>
                      {isCompleted ? <CheckCircle2 className='h-5 w-5' /> : step.id}
                    </div>
                    <span className={`text-base font-semibold ${isActive ? 'text-sky-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && <ArrowRight className='ml-3 h-4 w-4 text-gray-300' />}
                  </div>
                )
              })}
            </div>
          </div>

          <div className='mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]'>
            <div className='rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
              {currentStep === 1 && (
                <>
                  <div className='mb-6 flex items-center'>
                    <span className='mr-3 h-3 w-3 rounded-full bg-sky-500'></span>
                    <h2 className='text-2xl font-semibold text-slate-900'>Thông tin cơ bản</h2>
                  </div>
                  <p className='mb-10 text-sm text-muted-foreground md:text-base'>Bắt đầu bằng cách mô tả mục tiêu, phạm vi và mong muốn của bạn để thu hút freelancer phù hợp ngay từ đầu.</p>

                  <form className='space-y-8' onSubmit={handleBasicSubmit}>
                    <FormField
                      control={form.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                            Tiêu đề dự án
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='Ví dụ: Thiết kế landing page cho sản phẩm fintech'
                              className='h-12 text-base'
                            />
                          </FormControl>
                          <FormDescription className='text-xs text-muted-foreground md:text-sm'>
                            Một tiêu đề rõ ràng sẽ giúp dự án của bạn nổi bật trong mắt freelancer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='category'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Danh mục dự án
                            </FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className='h-12 text-base'>
                                  <SelectValue placeholder='Chọn danh mục phù hợp' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='timeline'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Thời hạn mong muốn
                            </FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className='h-12 text-base'>
                                  <SelectValue placeholder='Chọn thời hạn' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timelines.map((timeline) => (
                                  <SelectItem key={timeline} value={timeline}>
                                    {timeline}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                            Tóm tắt dự án
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Chia sẻ những thông tin cốt lõi: mục tiêu, phạm vi, đối tượng khách hàng và ngân sách dự kiến.'
                              className='min-h-[140px] text-base'
                            />
                          </FormControl>
                          <FormDescription className='text-xs text-muted-foreground md:text-sm'>
                            Mô tả càng cụ thể, bạn càng dễ thu hút freelancer chất lượng.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='budgetMin'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Ngân sách tối thiểu
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type='number'
                                min='0'
                                step='100000'
                                placeholder='Ví dụ: 5000000'
                                className='h-12 text-base'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='budgetMax'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Ngân sách tối đa
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type='number'
                                min='0'
                                step='100000'
                                placeholder='Ví dụ: 15000000'
                                className='h-12 text-base'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Đơn vị tiền tệ
                            </FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className='h-12 text-base'>
                                  <SelectValue placeholder='Chọn đơn vị tiền tệ' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencyOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='deadline'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Hạn chót dự kiến
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type='date' className='h-12 text-base' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='goal'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Kết quả mong đợi
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder='Ví dụ: Tăng 30% lượng đăng ký trong 3 tháng'
                                className='h-12 text-base'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='status'
                        render={({ field }) => (
                          <FormItem className='space-y-3'>
                            <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                              Trạng thái dự án
                            </FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className='h-12 text-base'>
                                  <SelectValue placeholder='Chọn trạng thái' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between'>
                      <Button type='button' variant='outline' className='w-full md:w-auto'>
                        Lưu nháp
                      </Button>
                      <Button type='submit' className='w-full bg-gray-900 hover:bg-gray-800 md:w-auto'>
                        Tiếp theo
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className='mb-6 flex items-center'>
                    <span className='mr-3 h-3 w-3 rounded-full bg-emerald-500'></span>
                    <h2 className='text-2xl font-semibold text-slate-900'>Chi tiết dự án</h2>
                  </div>
                  <p className='mb-10 text-sm text-muted-foreground md:text-base'>Cung cấp thông tin chuyên sâu về yêu cầu, kỹ năng và kỳ vọng để freelancer nắm rõ phạm vi công việc.</p>

                  <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name='skills'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                            Kỹ năng cần có
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Ví dụ: React, Node.js, UI/UX, Copywriting...'
                              className='min-h-[100px] text-base'
                            />
                          </FormControl>
                          <FormDescription className='text-xs text-muted-foreground md:text-sm'>
                            Liệt kê kỹ năng theo thứ tự ưu tiên để freelancer đánh giá nhanh sự phù hợp.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='space-y-3'>
                      <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                        Tệp đính kèm
                      </FormLabel>
                      <div className='rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-10 text-center'>
                        <Upload className='mx-auto mb-4 h-12 w-12 text-slate-300' />
                        <p className='text-sm font-medium text-slate-700'>Kéo thả tệp vào đây hoặc</p>
                        <Button type='button' variant='outline' className='mt-3' onClick={handleOpenFilePicker}>
                          Chọn tệp
                        </Button>
                        <input
                          ref={fileInputRef}
                          id='file-upload'
                          type='file'
                          multiple
                          className='hidden'
                          onChange={handleFileUpload}
                        />
                        <p className='mt-4 text-xs text-muted-foreground md:text-sm'>Hỗ trợ PDF, DOCX, JPG, PNG. Dung lượng tối đa 10MB/tệp.</p>
                      </div>
                      {selectedFiles.length > 0 && (
                        <ul className='space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700'>
                          {selectedFiles.map((file) => (
                            <li key={file.name} className='flex items-center justify-between'>
                              <span className='truncate'>{file.name}</span>
                              <span className='text-xs text-muted-foreground'>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name='requirements'
                      render={({ field }) => (
                        <FormItem className='space-y-3'>
                          <FormLabel className='text-sm font-semibold uppercase tracking-wide text-slate-600 md:text-base'>
                            Yêu cầu chi tiết
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Mô tả quy trình làm việc, tiêu chuẩn chất lượng, công cụ bắt buộc...'
                              className='min-h-[140px] text-base'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <p className='mb-4 text-base font-semibold text-slate-900'>Thông số tuyển dụng</p>
                      <div className='grid gap-6 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='experienceLevel'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel className='text-sm font-medium text-slate-600'>Mức độ kinh nghiệm</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Chọn mức độ' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {experienceOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='freelancerCount'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel className='text-sm font-medium text-slate-600'>Số lượng freelancer</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Chọn số lượng' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {freelancerCounts.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='mt-4 grid gap-6 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='minExperience'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel className='text-sm font-medium text-slate-600'>Kinh nghiệm tối thiểu</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Chọn mức tối thiểu' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minExperienceOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='teamSize'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel className='text-sm font-medium text-slate-600'>Quy mô đội ngũ mong muốn</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Chọn quy mô' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {teamSizeOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name='extras'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='mb-4 block text-base font-semibold text-slate-900'>Tùy chọn bổ sung</FormLabel>
                          <FormControl>
                            <RadioGroup value={field.value} onValueChange={field.onChange} className='space-y-4'>
                              {extrasOptions.map((option) => (
                                <label
                                  key={option.id}
                                  htmlFor={`extra-${option.id}`}
                                  className='flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-sky-400'
                                >
                                  <RadioGroupItem value={option.id} id={`extra-${option.id}`} />
                                  <span className='text-sm text-slate-700'>{option.label}</span>
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between'>
                      <Button type='button' variant='outline' className='w-full md:w-auto' onClick={handleBack}>
                        Quay lại
                      </Button>
                      <Button
                        type='submit'
                        className='w-full bg-gray-900 hover:bg-gray-800 md:w-auto'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Đang lưu...' : 'Hoàn thành'}
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {currentStep === 3 && (
                <div className='flex flex-col items-center justify-center space-y-6 py-12 text-center'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
                    <CheckCircle2 className='h-9 w-9' />
                  </div>
                  <div className='space-y-2'>
                    <h2 className='text-3xl font-semibold text-slate-900'>Tuyệt vời! Dự án của bạn đã sẵn sàng</h2>
                    <p className='text-base text-muted-foreground'>Chúng tôi sẽ thông báo khi có freelancer phù hợp phản hồi. Bạn có thể quản lý hoặc đăng thêm dự án bất cứ lúc nào.</p>
                  </div>
                  <div className='flex flex-col gap-3 md:flex-row'>
                    <Button variant='outline' onClick={handleReset}>
                      Đăng dự án khác
                    </Button>
                    <Button className='bg-gray-900 hover:bg-gray-800'>
                      Xem danh sách ứng tuyển
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-6'>
              <div className='rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur'>
                <div className='mb-4 flex items-center gap-3'>
                  <Lightbulb className='h-6 w-6 text-amber-500' />
                  <h3 className='text-lg font-semibold text-slate-900'>Tips thành công</h3>
                </div>
                <div className='space-y-3 text-sm text-muted-foreground'>
                  <div className='flex items-start gap-3'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-sky-500' />
                    <p>Tiêu đề rõ ràng giúp dự án nổi bật và thu hút freelancer phù hợp.</p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-sky-500' />
                    <p>Mô tả chi tiết yêu cầu, thời gian và tiêu chí đánh giá kết quả.</p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-sky-500' />
                    <p>Ngân sách minh bạch tạo niềm tin và thu hút freelancer chất lượng.</p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-sky-500' />
                    <p>Tài liệu tham khảo và yêu cầu bổ sung rõ ràng giúp freelancer hiểu nhanh phạm vi công việc.</p>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur'>
                <div className='mb-4 flex items-center gap-3'>
                  <Eye className='h-6 w-6 text-sky-500' />
                  <h3 className='text-lg font-semibold text-slate-900'>Xem trước dự án</h3>
                </div>
                <div className='space-y-4 text-sm'>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground'>Tiêu đề</p>
                    <p className='text-base font-semibold text-slate-900'>{formValues.title || 'Chưa nhập'}</p>
                  </div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Danh mục</p>
                      <p className='text-base font-semibold text-slate-900'>{formValues.category || 'Chưa chọn'}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Thời hạn</p>
                      <p className='text-base font-semibold text-slate-900'>{formValues.timeline || 'Chưa chọn'}</p>
                    </div>
                  </div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Ngân sách tối thiểu</p>
                      <p className='text-base font-semibold text-slate-900'>{formValues.budgetMin || 'Chưa nhập'}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Ngân sách tối đa</p>
                      <p className='text-base font-semibold text-slate-900'>{formValues.budgetMax || 'Chưa nhập'}</p>
                    </div>
                  </div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Đơn vị tiền tệ</p>
                      <p className='text-base font-semibold text-slate-900'>{currencyPreviewLabel}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Trạng thái</p>
                      <p className='text-base font-semibold text-slate-900'>{statusPreviewLabel}</p>
                    </div>
                  </div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Hạn chót</p>
                      <p className='text-base font-semibold text-slate-900'>{deadlinePreviewLabel}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Kết quả mong đợi</p>
                      <p className='text-base font-semibold text-slate-900'>{formValues.goal || 'Chưa nhập'}</p>
                    </div>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground'>Kỹ năng</p>
                    <p className='text-base text-slate-900'>{formValues.skills || 'Chưa nhập'}</p>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground'>Yêu cầu</p>
                    <p className='whitespace-pre-line text-base text-slate-900'>{formValues.requirements || 'Chưa nhập'}</p>
                  </div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Số lượng freelancer</p>
                      <p className='text-base text-slate-900'>{formValues.freelancerCount || 'Chưa chọn'}</p>
                    </div>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Team mong muốn</p>
                      <p className='text-base text-slate-900'>{formValues.teamSize || 'Chưa chọn'}</p>
                    </div>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground'>Tệp đính kèm</p>
                    <p className='text-base text-slate-900'>
                      {selectedFiles.length > 0 ? `${selectedFiles.length} tệp đã chọn` : 'Chưa có tệp'}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-wide text-muted-foreground'>Tùy chọn bổ sung</p>
                    <p className='text-base text-slate-900'>{extrasPreviewLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}
