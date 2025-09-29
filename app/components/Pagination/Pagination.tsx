import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/components/ui/pagination'

export function PaginationDemo() {
  const handlePageClick = (page: number | string) => {
    console.log('Navigate to page:', page)
    // Thực hiện navigation logic ở đây
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageClick('prev')} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={() => handlePageClick(1)}>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={() => handlePageClick(2)} isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={() => handlePageClick(3)}>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => handlePageClick('next')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
