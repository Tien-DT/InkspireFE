import { Card, CardHeader, CardContent } from '~/components/ui/card'

interface ProfileIntroTabProps {
  bio: string
}

export function ProfileIntroTab({ bio }: ProfileIntroTabProps) {
  if (!bio || bio.trim() === '') {
    return (
      <Card className='border border-border/50 bg-card/85 shadow-sm backdrop-blur'>
        <CardHeader className='border-b border-border/40 pb-4'>
          <h2 className='text-2xl font-semibold text-foreground'>Giới thiệu</h2>
        </CardHeader>
        <CardContent className='py-10 text-center text-sm text-muted-foreground'>
          Chưa có thông tin giới thiệu
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border border-border/50 bg-card/85 shadow-sm backdrop-blur'>
      <CardHeader className='border-b border-border/40 pb-4'>
        <h2 className='text-2xl font-semibold text-foreground'>Giới thiệu</h2>
      </CardHeader>
      <CardContent className='pt-6 text-base leading-relaxed text-muted-foreground whitespace-pre-line'>
        {bio}
      </CardContent>
    </Card>
  )
}
