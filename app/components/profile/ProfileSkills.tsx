import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'

interface ProfileSkillsProps {
  skills: string[]
}

const SKILL_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700'
] as const

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  if (skills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold text-gray-900'>Kỹ năng</h3>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-gray-500 text-center py-4'>Chưa có kỹ năng nào được thêm</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className='text-lg font-semibold text-gray-900'>Kỹ năng</h3>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {skills.map((skill, index) => (
            <Badge key={skill} className={`${SKILL_COLORS[index % SKILL_COLORS.length]} hover:opacity-80 font-medium`}>
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
