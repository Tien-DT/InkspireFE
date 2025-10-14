import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'

interface ProfileHeaderProps {
  name: string
  status: string
  avatar: string
  rating: number
  reviewCount: number
}

export function ProfileHeader({ name, status, avatar, rating, reviewCount }: ProfileHeaderProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')

  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-8 py-10 text-center text-primary-foreground'>
      <div className='pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_60%)]' />
      <div className='relative flex justify-center mb-5'>
        <Avatar className='h-28 w-28 border-4 border-white/60 shadow-xl ring-4 ring-white/10'>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className='bg-white/15 text-white text-4xl font-bold uppercase'>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className='relative flex flex-col items-center gap-3'>
        <div className='inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider'>
          <span className='text-white/80'>Trạng thái</span>
          <Badge
            variant='outline'
            className='border-white/40 bg-white/10 text-primary-foreground/90 px-3 py-0.5 text-xs uppercase tracking-wider'
          >
            {status}
          </Badge>
        </div>
        <h1 className='text-3xl font-bold leading-tight'>{name}</h1>
        <div className='flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur'>
          <Star className='h-5 w-5 fill-yellow-300 text-yellow-300 drop-shadow' />
          <span className='text-lg font-bold text-white'>{rating.toFixed(1)}</span>
          <span className='text-white/80'>({reviewCount} đánh giá)</span>
        </div>
      </div>
    </div>
  )
}
