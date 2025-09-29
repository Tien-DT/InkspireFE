import { JobCard } from './JobCard'
import PaginationDemo from '~/components/Pagination'

interface Job {
  id: string
  title: string
  description: string
  budget: {
    min?: number
    max?: number
    negotiable?: boolean
  }
  duration: string
  proposalsCount: string
  skills: string[]
  clientInfo: {
    name: string
    rating: number
    reviewsCount: number
    completedProjects: number
  }
  postedTime: string
  isUrgent?: boolean
  isFavorited?: boolean
  experienceLevel: string
}

interface JobsListProps {
  jobs: Job[]
  onFavorite: (id: string) => void
  onViewDetails: (id: string) => void
  onApply: (id: string) => void
}

export function JobsList({ jobs, onFavorite, onViewDetails, onApply }: JobsListProps) {
  const formatBudget = (budget: Job['budget']) => {
    if (budget.negotiable) {
      return { min: 0, max: 0, display: 'Thương lượng' }
    }
    return {
      min: budget.min || 0,
      max: budget.max || 0,
      display: budget.min && budget.max ? `${budget.min}-${budget.max}M VND` : 'Thương lượng'
    }
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          title={job.title}
          description={job.description}
          budget={formatBudget(job.budget)}
          duration={job.duration}
          proposalsCount={parseInt(job.proposalsCount.split('-')[0]) || 0}
          skills={job.skills}
          clientInfo={job.clientInfo}
          postedTime={job.postedTime}
          isUrgent={job.isUrgent}
          isFavorited={job.isFavorited}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
        />
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-center mt-8 space-x-2">
        <PaginationDemo />
      </div>
    </div>
  )
}