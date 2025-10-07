import { Card, CardContent } from '~/components/ui/card'
import { Briefcase } from 'lucide-react'

interface EmptyApplicationsStateProps {
  filterStatus: string
}

export function EmptyApplicationsState({ filterStatus }: EmptyApplicationsStateProps) {
  return (
    <Card>
      <CardContent className='py-16 text-center'>
        <Briefcase className='h-16 w-16 text-gray-400 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chưa có ứng tuyển nào</h3>
        <p className='text-gray-600'>
          {filterStatus === 'all' ? 'Bạn chưa ứng tuyển công việc nào' : `Không có ứng tuyển nào ở trạng thái này`}
        </p>
      </CardContent>
    </Card>
  )
}
