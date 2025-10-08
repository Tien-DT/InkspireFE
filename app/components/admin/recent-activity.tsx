import { CheckCircle2, Clock } from 'lucide-react'
import { Card } from '~/components/ui/card'

type ActivityItem = {
  title: string
  description: string
  time: string
  completed: boolean
}

const activities: ActivityItem[] = [
  {
    title: 'Phát hành sản phẩm mới',
    description: 'Sản phẩm mới đã được phát hành thành công',
    time: '2 giờ trước',
    completed: true
  },
  {
    title: 'Hoàn tất dự án TAMI web bán hàng',
    description: 'Dự án đã được bàn giao cho khách hàng',
    time: '5 giờ trước',
    completed: true
  },
  {
    title: 'Xử lý thanh toán 40.000.000đ',
    description: 'Khoản thanh toán đã được xử lý thành công',
    time: '1 ngày trước',
    completed: true
  },
  {
    title: 'Đăng tải báo cáo tháng',
    description: 'Tài liệu đã được tải lên hệ thống',
    time: '2 ngày trước',
    completed: true
  },
  {
    title: 'Kích hoạt gói Premium hạng Platinum',
    description: 'Gói Premium đã được kích hoạt cho người dùng',
    time: '3 ngày trước',
    completed: true
  }
]

export function RecentActivity() {
  return (
    <Card className='p-6 shadow-sm'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold text-slate-900'>Hoạt động gần đây</h2>
          <p className='text-sm text-muted-foreground'>Các hoạt động mới nhất trên hệ thống</p>
        </div>

        <div className='space-y-4'>
          {activities.map((activity) => (
            <div key={activity.title} className='flex gap-3'>
              <div className='mt-0.5 flex-shrink-0'>
                {activity.completed ? (
                  <CheckCircle2 className='h-5 w-5 text-emerald-500' />
                ) : (
                  <Clock className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
              <div className='flex-1 space-y-1'>
                <p className='text-sm font-medium leading-tight text-slate-900'>{activity.title}</p>
                <p className='text-xs text-muted-foreground'>{activity.description}</p>
                <p className='text-xs text-muted-foreground'>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
