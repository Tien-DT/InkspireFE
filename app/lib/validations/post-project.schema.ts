import { z } from 'zod'

export const postProjectStep1Schema = z
  .object({
    title: z
      .string()
      .min(5, { message: 'Tiêu đề dự án phải có ít nhất 5 ký tự' })
      .max(200, { message: 'Tiêu đề dự án không được quá 200 ký tự' }),
    category: z.string().min(1, { message: 'Vui lòng chọn danh mục dự án' }),
    description: z
      .string()
      .min(20, { message: 'Mô tả dự án phải có ít nhất 20 ký tự' })
      .max(5000, { message: 'Mô tả dự án không được quá 5000 ký tự' }),
    budget: z
      .number({ message: 'Ngân sách phải là số' })
      .min(100000, { message: 'Ngân sách tối thiểu là 100,000 VNĐ' })
      .max(1000000000, { message: 'Ngân sách tối đa là 1,000,000,000 VNĐ' }),
    startDate: z.string().min(1, { message: 'Vui lòng chọn ngày bắt đầu' }),
    endDate: z.string().min(1, { message: 'Vui lòng chọn ngày kết thúc' }),
    skills: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một kỹ năng' })
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true
      return new Date(data.endDate) >= new Date(data.startDate)
    },
    {
      message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu',
      path: ['endDate']
    }
  )

export type PostProjectStep1FormValues = z.infer<typeof postProjectStep1Schema>
