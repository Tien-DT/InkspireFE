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
    <div className='rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-foreground'>Kỹ năng</h3>
        <span className='text-sm text-muted-foreground'>{skills.length} kỹ năng</span>
      </div>
      {skills.length === 0 ? (
        <div className='rounded-xl border border-dashed border-muted-foreground/40 bg-muted/30 py-6 text-center text-sm text-muted-foreground'>
          Chưa có kỹ năng nào được thêm
        </div>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {skills.map((skill, index) => (
            <Badge
              key={skill}
              className={`${SKILL_COLORS[index % SKILL_COLORS.length]} border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wide`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
