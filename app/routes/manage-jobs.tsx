import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import React from 'react'
import ProjectCard from '~/components/ProjectCard'
import StatusCard from '~/components/StatusCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function ManageJobs() {
  return (
    <div className='container mx-auto px-4 py-6 space-y-6 min-h-screen bg-background'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gradient mb-2'>Quản lý Công việc</h1>
          <p className='text-muted-foreground'>Theo dõi và quản lý tất cả dự án của bạn</p>
        </div>
        <Select defaultValue='all'>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Tất cả' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả</SelectItem>
            <SelectItem value='active'>Đang hoạt động</SelectItem>
            <SelectItem value='pending'>Chờ duyệt</SelectItem>
            <SelectItem value='editing'>Cần sửa đổi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatusCard title='Dự án đang hoạt động' count={3} icon={Clock} color='blue' />
        <StatusCard title='Chờ duyệt' count={1} icon={AlertCircle} color='yellow' />
        <StatusCard title='Cần sửa đổi' count={1} icon={AlertCircle} color='red' />
        <StatusCard title='Hoàn thành tháng này' count={2} icon={CheckCircle2} color='green' />
      </div>

      <Tabs defaultValue='active' className='mb-6'>
        <TabsList className='grid w-full grid-cols-4 bg-card border border-border rounded-lg h-auto p-0'>
          <TabsTrigger
            value='active'
            className='rounded-none border-b-2 data-[state=active]:border-[#4A9FD8] data-[state=active]:bg-[#E8F4FA] data-[state=active]:text-foreground py-3'
          >
            Đang hoạt động (3)
          </TabsTrigger>
          <TabsTrigger
            value='pending'
            className='rounded-none border-b-2 data-[state=active]:border-[#F5C842] data-[state=active]:bg-[#FEF9E7] data-[state=active]:text-foreground py-3'
          >
            Chờ duyệt (1)
          </TabsTrigger>
          <TabsTrigger
            value='editing'
            className='rounded-none border-b-2 data-[state=active]:border-[#E74C3C] data-[state=active]:bg-[#FADBD8] data-[state=active]:text-foreground py-3'
          >
            Cần sửa đổi (1)
          </TabsTrigger>
          <TabsTrigger
            value='completed'
            className='rounded-none border-b-2 data-[state=active]:border-[#52C41A] data-[state=active]:bg-[#E8F5E9] data-[state=active]:text-foreground py-3'
          >
            Hoàn thành (2)
          </TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='mt-6 space-y-6'>
          <ProjectCard
            title='Thiết kế logo cho startup công nghệ AI'
            company='TechViet Solutions'
            deadline='15/01/2024'
            timeRemaining='2 giờ trước'
            progress={75}
            phases={[
              { name: 'Research', completed: true },
              { name: 'Design', completed: true },
              { name: 'Revision', completed: false },
              { name: 'Final', completed: false }
            ]}
            budget='5.2M VNĐ'
            daysRemaining='Hạn: 3 ngày'
            status='active'
            statusLabel='Đang thực hiện'
          />
        </TabsContent>

        <TabsContent value='pending' className='mt-6 space-y-6'>
          <ProjectCard
            title='Viết kịch bản quảng cáo bánh ngọt'
            company='Digital Agency'
            deadline='10/01/2024'
            timeRemaining='3 ngày trước'
            progress={20}
            phases={[
              { name: 'Content', completed: false },
              { name: 'Draft', completed: false },
              { name: 'Prototype', completed: false },
              { name: 'Testing', completed: false }
            ]}
            budget='12.5M VNĐ'
            daysRemaining='Hạn: 10 ngày'
            status='pending'
            statusLabel='Chờ duyệt'
          />
        </TabsContent>

        <TabsContent value='editing' className='mt-6 space-y-6'>
          <ProjectCard
            title='Thiết kế brochure sản phẩm'
            company='Green Life Co.'
            deadline='12/01/2024'
            timeRemaining='1 ngày trước'
            progress={45}
            phases={[
              { name: 'Concept', completed: true },
              { name: 'Draft', completed: false },
              { name: 'Review', completed: false },
              { name: 'Final', completed: false }
            ]}
            budget='3.8M VNĐ'
            daysRemaining='Hạn: 5 ngày'
            status='editing'
            statusLabel='Cần sửa đổi'
          />
        </TabsContent>

        <TabsContent value='completed' className='mt-6 space-y-6'>
          <div className='text-center py-12 text-muted-foreground'>Không có dự án hoàn thành</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
