import { Badge } from '~/components/ui/badge'

interface ProfileSkillsProps {
  skills: string[]
}

const SKILL_COLORS = [
  'bg-sky-500/10 text-sky-600',
  'bg-violet-500/10 text-violet-600',
  'bg-amber-500/10 text-amber-600',
  'bg-rose-500/10 text-rose-600',
  'bg-emerald-500/10 text-emerald-600',
  'bg-cyan-500/10 text-cyan-600',
  'bg-fuchsia-500/10 text-fuchsia-600',
  'bg-indigo-500/10 text-indigo-600'
] as const

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  return (
    <div className='p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-foreground uppercase tracking-wide'>Kỹ năng</h3>
        <span className='text-xs text-muted-foreground/60'>{skills.length}</span>
      </div>
      {skills.length === 0 ? (
        <div className='rounded-lg bg-muted/30 py-4 text-center text-xs text-muted-foreground/60'>
          Chưa có kỹ năng nào
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {skills.map((skill, index) => (
            <Badge
              key={skill}
              className={`${SKILL_COLORS[index % SKILL_COLORS.length]} border-0 px-2 py-1 text-xs font-semibold`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
