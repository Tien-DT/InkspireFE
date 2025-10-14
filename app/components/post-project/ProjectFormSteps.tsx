import { Check } from 'lucide-react'
import { cn } from '~/lib/utils'

interface ProjectFormStepsProps {
  currentStep: number
}

const steps = [
  { number: 1, label: 'Thông tin cơ bản' },
  { number: 2, label: 'Xác nhận' }
]

export function ProjectFormSteps({ currentStep }: ProjectFormStepsProps) {
  return (
    <div className='flex items-center justify-center mb-8'>
      <div className='flex items-center gap-0'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const showConnector = index < steps.length - 1

          return (
            <div key={step.number} className='flex items-center'>
              {/* Step Circle */}
              <div className='flex items-center gap-3'>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isActive && 'border-primary bg-primary text-primary-foreground shadow-md',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    !isActive && !isCompleted && 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className='h-5 w-5' strokeWidth={3} />
                  ) : (
                    <span className='text-sm font-bold'>{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm transition-all duration-300',
                    isActive && 'font-bold text-foreground',
                    isCompleted && 'font-medium text-foreground',
                    !isActive && !isCompleted && 'font-normal text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {showConnector && (
                <div
                  className={cn(
                    'mx-4 h-[2px] w-16 transition-all duration-300',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
