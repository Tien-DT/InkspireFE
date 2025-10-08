import { Card, CardHeader, CardContent } from '~/components/ui/card'

interface ProfileIntroTabProps {
  bio: string
}

export function ProfileIntroTab({ bio }: ProfileIntroTabProps) {
  if (!bio || bio.trim() === '') {
    return (
      <Card>
        <CardHeader>
          <h2 className='text-2xl font-bold text-gray-900'>Giới thiệu</h2>
        </CardHeader>
        <CardContent>
          <p className='text-gray-500 text-center py-8'>Chưa có thông tin giới thiệu</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h2 className='text-2xl font-bold text-gray-900'>Giới thiệu</h2>
      </CardHeader>
      <CardContent>
        <p className='text-gray-700 leading-relaxed whitespace-pre-line'>{bio}</p>
      </CardContent>
    </Card>
  )
}
