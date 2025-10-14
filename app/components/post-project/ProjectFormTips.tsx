import { FileText, Lightbulb, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const tips = [
  {
    icon: Target,
    title: 'Tiêu đề rõ ràng',
    description: 'Sử dụng từ khóa chính xác để thu hút freelancer phù hợp với dự án của bạn'
  },
  {
    icon: FileText,
    title: 'Mô tả chi tiết',
    description: 'Cung cấp đầy đủ thông tin về yêu cầu, kỳ vọng và phạm vi công việc'
  },
  {
    icon: TrendingUp,
    title: 'Ngân sách hợp lý',
    description: 'Đặt mức ngân sách phù hợp để thu hút freelancer chất lượng cao'
  }
]

export function ProjectFormTips() {
  return (
    <Card className='top-24'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-amber-500' />
          <CardTitle className='text-lg'>Mẹo thành công</CardTitle>
        </div>
      </CardHeader>
      <CardContent data-slot='card-content' className='space-y-5'>
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <div key={index} className='flex gap-3'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10'>
                <Icon className='h-5 w-5 text-primary' />
              </div>
              <div className='space-y-1'>
                <h4 className='text-sm font-semibold leading-none'>{tip.title}</h4>
                <p className='text-sm text-muted-foreground leading-relaxed'>{tip.description}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
