import { Plus } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

interface ProfileEmptyStateProps {
  onCreateProfile: () => void
}

export function ProfileEmptyState({ onCreateProfile }: ProfileEmptyStateProps) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <Card className='max-w-2xl mx-auto'>
          <CardContent className='py-16 text-center'>
            <div className='mb-6'>
              <div className='h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto flex items-center justify-center'>
                <Plus className='h-12 w-12 text-white' />
              </div>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Chưa có profile</h2>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              Hãy tạo profile để giới thiệu bản thân, kỹ năng và portfolio của bạn với khách hàng tiềm năng.
            </p>
            <Button onClick={onCreateProfile} className='btn-submit' size='lg'>
              <Plus className='h-5 w-5 mr-2' />
              Tạo profile ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
