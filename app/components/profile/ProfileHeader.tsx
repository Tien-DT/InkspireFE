import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'

interface ProfileHeaderProps {
  name: string
  avatar: string
  rating: number
  reviewCount: number
  status?: string
  title?: string
}

export function ProfileHeader({ name, status, title, avatar, rating, reviewCount }: ProfileHeaderProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')

  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-8 py-8 text-center text-primary-foreground'>
      <div className='relative flex justify-center mb-4'>
        <Avatar className='h-24 w-24 border-3 border-white/40'>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className='bg-white/15 text-white text-3xl font-bold uppercase'>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className='relative flex flex-col items-center gap-2'>
        {status && (
          <Badge
            className='border-0 bg-white/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white/90'
          >
            {status}
          </Badge>
        )}
        <h1 className='text-2xl font-semibold leading-tight'>{name}</h1>
        {title && <p className='text-white/75 text-sm font-medium'>{title}</p>}
        <div className='flex items-center justify-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white/90'>
          <Star className='h-4 w-4 fill-yellow-300 text-yellow-300' />
          <span className='text-base font-bold text-white'>{rating.toFixed(1)}</span>
          <span className='text-white/70 text-xs'>({reviewCount} đánh giá)</span>
        </div>
      </div>
    </div>
  )
}
