import { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import type { Skill } from '~/types/recruitment.type'

interface SkillsComboboxProps {
  skills: Skill[]
  selectedSkills: string[]
  onToggleSkill: (skillId: string) => void
  error?: string
}

export function SkillsCombobox({ skills, selectedSkills, onToggleSkill, error }: SkillsComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedSkillObjects = selectedSkills
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined)

  const availableSkills = skills.filter((skill) => !selectedSkills.includes(skill.id))

  return (
    <div className='space-y-3'>
      {/* Selected Skills */}
      {selectedSkillObjects.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedSkillObjects.map((skill) => (
            <Badge
              key={skill.id}
              variant='secondary'
              className='gap-1 px-3 py-1.5 text-sm font-medium hover:bg-secondary/80 transition-colors'
            >
              {skill.name}
              <button
                type='button'
                onClick={() => onToggleSkill(skill.id)}
                className='ml-1 rounded-full hover:bg-background/50 transition-colors'
                aria-label={`Remove ${skill.name}`}
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'w-full justify-between font-normal',
              selectedSkillObjects.length === 0 && 'text-muted-foreground',
              error && 'border-destructive'
            )}
          >
            {selectedSkillObjects.length > 0
              ? `Đã chọn ${selectedSkillObjects.length} kỹ năng`
              : 'Tìm kiếm và chọn kỹ năng...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Tìm kiếm kỹ năng...'
              value={searchQuery}
              onValueChange={setSearchQuery}
              className='h-9'
            />
            <CommandList>
              <CommandEmpty>Không tìm thấy kỹ năng phù hợp.</CommandEmpty>
              <CommandGroup>
                {availableSkills
                  .filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((skill) => (
                    <CommandItem
                      key={skill.id}
                      value={skill.id}
                      onSelect={() => {
                        onToggleSkill(skill.id)
                        setSearchQuery('')
                      }}
                      className='cursor-pointer'
                    >
                      <Check className={cn('mr-2 h-4 w-4', 'opacity-0')} />
                      {skill.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
