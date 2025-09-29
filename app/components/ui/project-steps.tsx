import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface Step {
  number: number
  title: string
  isActive?: boolean
  isCompleted?: boolean
}

interface ProjectStepsProps {
  steps: Step[]
  currentStep: number
}

export function ProjectSteps({ steps, currentStep }: ProjectStepsProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step.isCompleted
                  ? 'bg-green-600 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step.isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <span className={`ml-2 font-medium ${
                step.isCompleted
                  ? 'text-green-600'
                  : step.number === currentStep
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}>
                {step.title}
              </span>
            </div>

            {/* Arrow (not for last step) */}
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400 ml-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}