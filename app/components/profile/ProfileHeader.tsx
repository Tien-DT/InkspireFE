import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

interface ProfileHeaderProps {
  name: string
  title: string
  avatar: string
  rating: number
  reviewCount: number
}

export function ProfileHeader({ name, title, avatar, rating, reviewCount }: ProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <div className='bg-section p-8 text-center'>
      <div className='flex justify-center mb-4'>
        <Avatar className='h-32 w-32 border-4 border-white shadow-xl'>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-600 text-white text-4xl font-bold'>
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <h1 className='text-2xl font-bold text-white mb-1'>{name}</h1>
      <p className='text-blue-100 text-sm'>{title}</p>
      <div className='flex items-center justify-center gap-1 mt-3'>
        <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
        <span className='text-white font-bold text-lg'>{rating}</span>
        <span className='text-blue-100 text-sm'>({reviewCount} đánh giá)</span>
      </div>
    </div>
  )
}
