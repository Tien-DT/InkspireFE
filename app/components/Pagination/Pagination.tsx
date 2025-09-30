import { useSearchParams } from 'react-router'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'

interface PaginationProps {
  currentPage: number
  hasNextPage?: boolean
  isLoading?: boolean
  onPageChange: (page: number) => void
}

export function PaginationDemo({ currentPage, hasNextPage = true, isLoading = false, onPageChange }: PaginationProps) {
  const [searchParams] = useSearchParams()
  const queryPage = Number(searchParams.get('page')) || 1
  return (
    <Pagination className='mt-8'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            aria-disabled={currentPage === 1 || isLoading}
            className={currentPage === 1 || isLoading ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive={queryPage === currentPage} className='px-4 py-2'>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            aria-disabled={!hasNextPage || isLoading}
            className={!hasNextPage || isLoading ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
