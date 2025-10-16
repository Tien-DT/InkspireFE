interface ProfileIntroTabProps {
  bio: string
}

export function ProfileIntroTab({ bio }: ProfileIntroTabProps) {
  if (!bio || bio.trim() === '') {
    return (
      <div className='rounded-lg bg-muted/20 py-8 text-center text-sm text-muted-foreground/60'>
        Chưa có thông tin giới thiệu
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-sm font-semibold text-foreground uppercase tracking-wide'>Giới thiệu</h2>
      <p className='text-sm leading-relaxed text-muted-foreground/80 whitespace-pre-line'>
        {bio}
      </p>
    </div>
  )
}
