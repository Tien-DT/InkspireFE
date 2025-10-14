import { Plus } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

interface ProfileEmptyStateProps {
  onCreateProfile: () => void
}

export function ProfileEmptyState({ onCreateProfile }: ProfileEmptyStateProps) {
  return (
    <div className='relative min-h-screen bg-gradient-to-br from-muted/30 via-background to-background'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-64 bg-section opacity-30 blur-3xl' />
      <div className='relative mx-auto flex max-w-4xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-2xl overflow-hidden rounded-3xl border border-border/40 bg-card/90 shadow-2xl backdrop-blur'>
          <CardContent className='py-16 text-center'>
            <div className='mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg'>
              <Plus className='h-12 w-12' />
            </div>
            <h2 className='text-3xl font-semibold text-foreground'>Chưa có profile</h2>
            <p className='mx-auto mt-3 max-w-md text-base text-muted-foreground'>
              Hãy tạo profile để giới thiệu bản thân, kỹ năng và portfolio của bạn với khách hàng tiềm năng.
            </p>
            <Button
              onClick={onCreateProfile}
              variant='shine'
              size='lg'
              className='mt-10 px-10 shadow-lg hover:shadow-xl'
            >
              <Plus className='mr-2 h-5 w-5' />
              Tạo profile ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
