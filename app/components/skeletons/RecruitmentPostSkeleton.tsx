import { LoadingCard, LoadingList } from '~/components/shared/LoadingCard'

export const RecruitmentPostSkeleton = () => {
  return <LoadingCard variant='default' />
}

// List loading with multiple skeletons
export const RecruitmentPostListSkeleton = () => {
  return <LoadingList count={5} variant='default' />
}
