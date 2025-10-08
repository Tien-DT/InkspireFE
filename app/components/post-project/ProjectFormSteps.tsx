import { ArrowRight } from 'lucide-react'

interface ProjectFormStepsProps {
  currentStep: number
}

export function ProjectFormSteps({ currentStep }: ProjectFormStepsProps) {
  return (
    <div className='flex items-center justify-center mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='flex items-center'>
          <div
            className={`w-8 h-8 ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300`}
          >
            1
          </div>
          <span className={`ml-2 ${currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
            Thông tin cơ bản
          </span>
        </div>
        <ArrowRight className='h-4 w-4 text-gray-400' />
        <div className={`flex items-center ${currentStep === 1 ? 'opacity-50' : ''}`}>
          <div
            className={`w-8 h-8 ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'} rounded-full flex items-center justify-center text-sm font-medium`}
          >
            2
          </div>
          <span className={`ml-2 ${currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Xác nhận</span>
        </div>
      </div>
    </div>
  )
}
