import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface ProfileEmptyStateProps {
  onCreateProfile: () => void
}

export function ProfileEmptyState({ onCreateProfile }: ProfileEmptyStateProps) {
  return (
    <div className='relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
      <div className='relative mx-auto flex max-w-4xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-2xl rounded-2xl border border-border/30 bg-card/30 p-12 text-center backdrop-blur-md'>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center text-muted-foreground/50'>
            <Plus className='h-10 w-10' />
          </div>
          <h2 className='text-2xl font-semibold text-foreground'>Chưa có profile</h2>
          <p className='mx-auto mt-2 max-w-md text-sm text-muted-foreground/70'>
            Hãy tạo profile để giới thiệu bản thân, kỹ năng và portfolio của bạn với khách hàng tiềm năng.
          </p>
          <Button
            onClick={onCreateProfile}
            variant='shine'
            size='lg'
            className='mt-8 px-8'
          >
            <Plus className='mr-2 h-5 w-5' />
            Tạo profile ngay
          </Button>
        </div>
      </div>
    </div>
  )
}
