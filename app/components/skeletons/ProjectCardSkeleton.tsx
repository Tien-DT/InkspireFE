import { LoadingCard, LoadingList } from '~/components/shared/LoadingCard'

export const ProjectCardSkeleton = () => {
  return <LoadingCard variant='default' />
}

// List loading with multiple skeletons
export const ProjectListSkeleton = () => {
  return <LoadingList count={5} variant='default' />
}
