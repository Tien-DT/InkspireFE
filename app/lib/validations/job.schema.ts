import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ['.pdf']

export const applicationFormSchema = z.object({
  cvFile: z
    .instanceof(File, { message: 'Vui lòng chọn CV của bạn' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'Kích thước file không được vượt quá 5MB'
    })
    .refine(
      (file) => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        return ACCEPTED_FILE_TYPES.includes(fileExtension)
      },
      {
        message: 'Chỉ hỗ trợ file .pdf'
      }
    ),
  coverLetter: z
    .string()
    .min(50, { message: 'Thư giới thiệu phải có ít nhất 50 ký tự' })
    .max(2000, { message: 'Thư giới thiệu không được quá 2000 ký tự' })
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>

export const jobFilterSchema = z.object({
  keyword: z.string().max(200).optional(),
  category: z.string().optional(),
  minBudget: z.number().min(0).optional(),
  maxBudget: z.number().min(0).optional(),
  timeline: z.array(z.string()).optional(),
  experienceLevel: z.array(z.string()).optional(),
  sortBy: z.enum(['newest', 'budget-high', 'budget-low']).optional()
})

export type JobFilterFormValues = z.infer<typeof jobFilterSchema>
