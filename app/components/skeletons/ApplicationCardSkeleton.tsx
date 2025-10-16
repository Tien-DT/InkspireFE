import { LoadingCard, LoadingList } from '~/components/shared/LoadingCard'

export const ApplicationCardSkeleton = () => {
  return <LoadingCard variant='default' />
}

// List loading with multiple skeletons
export const ApplicationListSkeleton = () => {
  return <LoadingList count={4} variant='default' />
}
