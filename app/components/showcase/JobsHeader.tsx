import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface JobsHeaderProps {
  jobCount: number
  sortBy: string
  onSortChange: (value: string) => void
}

export function JobsHeader({ jobCount, sortBy, onSortChange }: JobsHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Tìm thấy {jobCount} công việc phù hợp
      </h1>
      <div className="flex items-center justify-between mt-4">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48 bg-white">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="budget-high">Ngân sách cao</SelectItem>
            <SelectItem value="budget-low">Ngân sách thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}