import { z } from 'zod'

export const jobApplicationSchema = z.object({
  cvFile: z
    .instanceof(File, { message: 'Vui lòng chọn CV của bạn' })
    .refine((file) => file.size <= 5 * 1024 * 1024, { message: 'Kích thước file không được vượt quá 5MB' })
    .refine((file) => file.name.toLowerCase().endsWith('.pdf'), { message: 'Chỉ hỗ trợ file .pdf' }),
  coverLetter: z
    .string()
    .min(50, { message: 'Thư giới thiệu phải có ít nhất 50 ký tự' })
    .max(2000, { message: 'Thư giới thiệu không được quá 2000 ký tự' })
})

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>
