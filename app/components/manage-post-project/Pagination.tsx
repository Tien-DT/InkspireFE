import { Button } from '~/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className='flex items-center justify-center gap-2 mt-8'>
      <Button variant='outline' onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
        Trước
      </Button>
      <div className='flex items-center gap-2'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'btn-submit' : 'btn-cancel'}
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        variant='outline'
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Sau
      </Button>
    </div>
  )
}
