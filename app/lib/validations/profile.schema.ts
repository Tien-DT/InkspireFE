import { z } from 'zod'

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' })
    .max(100, { message: 'Họ và tên không được quá 100 ký tự' }),
  title: z
    .string()
    .min(2, { message: 'Chức danh phải có ít nhất 2 ký tự' })
    .max(100, { message: 'Chức danh không được quá 100 ký tự' }),
  bio: z
    .string()
    .min(10, { message: 'Giới thiệu phải có ít nhất 10 ký tự' })
    .max(1000, { message: 'Giới thiệu không được quá 1000 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, { message: 'Số điện thoại phải có 10-11 chữ số' })
    .optional()
    .or(z.literal('')),
  location: z.string().max(200, { message: 'Địa điểm không được quá 200 ký tự' }).optional().or(z.literal('')),
  priceRange: z.string().max(100, { message: 'Mức giá không được quá 100 ký tự' }).optional().or(z.literal('')),
  status: z.string().max(100, { message: 'Tình trạng không được quá 100 ký tự' }).optional().or(z.literal('')),
  skills: z.string().max(500, { message: 'Danh sách kỹ năng không được quá 500 ký tự' }).optional().or(z.literal(''))
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const portfolioItemSchema = z.object({
  id: z.number(),
  title: z.string().min(1, { message: 'Tên dự án không được để trống' }).max(200, { message: 'Tên dự án quá dài' }),
  category: z.string().min(1, { message: 'Danh mục không được để trống' }).max(100, { message: 'Danh mục quá dài' }),
  description: z.string().min(1, { message: 'Mô tả không được để trống' }).max(500, { message: 'Mô tả quá dài' }),
  image: z.string().optional().or(z.literal(''))
})

export type PortfolioItemValues = z.infer<typeof portfolioItemSchema>
