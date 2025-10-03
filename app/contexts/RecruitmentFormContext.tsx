import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { PostProjectStep1, PostProjectStep2, CreateRecruitmentRequest } from '~/types/recruitment.type'

interface RecruitmentFormContextType {
  step1Data: PostProjectStep1 | null
  step2Data: PostProjectStep2 | null
  currentStep: number
  setStep1Data: (data: PostProjectStep1) => void
  setStep2Data: (data: PostProjectStep2) => void
  setCurrentStep: (step: number) => void
  getCombinedData: () => CreateRecruitmentRequest | null
  resetForm: () => void
}

const RecruitmentFormContext = createContext<RecruitmentFormContextType | undefined>(undefined)

export function RecruitmentFormProvider({ children }: { children: ReactNode }) {
  const [step1Data, setStep1DataState] = useState<PostProjectStep1 | null>(() => {
    if (typeof window === 'undefined') return null
    const saved = sessionStorage.getItem('recruitmentStep1')
    return saved ? JSON.parse(saved) : null
  })

  const [step2Data, setStep2DataState] = useState<PostProjectStep2 | null>(() => {
    if (typeof window === 'undefined') return null
    const saved = sessionStorage.getItem('recruitmentStep2')
    return saved ? JSON.parse(saved) : null
  })

  const [currentStep, setCurrentStep] = useState(1)

  const setStep1Data = useCallback((data: PostProjectStep1) => {
    setStep1DataState(data)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recruitmentStep1', JSON.stringify(data))
    }
  }, [])

  const setStep2Data = useCallback((data: PostProjectStep2) => {
    setStep2DataState(data)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recruitmentStep2', JSON.stringify(data))
    }
  }, [])

  const getCombinedData = useCallback((): CreateRecruitmentRequest | null => {
    if (!step1Data) return null

    return {
      title: step1Data.title,
      projectName: step1Data.title,
      category: step1Data.category,
      description: step1Data.description,
      budget: step1Data.budget,
      startDate: step1Data.startDate,
      endDate: step1Data.endDate,
      skills: step1Data.skills
    }
  }, [step1Data])

  const resetForm = useCallback(() => {
    setStep1DataState(null)
    setStep2DataState(null)
    setCurrentStep(1)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('recruitmentStep1')
      sessionStorage.removeItem('recruitmentStep2')
    }
  }, [])

  return (
    <RecruitmentFormContext.Provider
      value={{
        step1Data,
        step2Data,
        currentStep,
        setStep1Data,
        setStep2Data,
        setCurrentStep,
        getCombinedData,
        resetForm
      }}
    >
      {children}
    </RecruitmentFormContext.Provider>
  )
}

export function useRecruitmentForm() {
  const context = useContext(RecruitmentFormContext)
  if (!context) {
    throw new Error('useRecruitmentForm must be used within RecruitmentFormProvider')
  }
  return context
}
