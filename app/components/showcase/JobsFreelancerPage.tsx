import { useState } from 'react'
import { JobFilters } from '~/components/showcase/JobFilters'
import { JobsHeader } from '~/components/showcase/JobsHeader'
import { JobsList } from '~/components/showcase/JobsList'
import { AdSpace } from '~/components/showcase/AdSpace'

// Mock data for the jobs
const mockJobs = [
  {
    id: '1',
    title: 'Thiết kế logo cho startup công nghệ AI',
    description: 'Chúng tôi cần thiết kế logo chuyên nghiệp cho startup công nghệ AI. Logo cần thể hiện sự hiện đại, đáng tin cậy và sáng tạo.',
    budget: { min: 3, max: 5, display: '3-5M VND' },
    duration: 'Hạn: 5 ngày',
    proposalsCount: '12-49',
    skills: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Photoshop'],
    clientInfo: {
      name: 'Techviet Solutions',
      rating: 4.9,
      reviewsCount: 23,
      completedProjects: 45
    },
    postedTime: 'Đăng 2 giờ trước',
    isUrgent: true,
    isFavorited: false,
    experienceLevel: 'Trung cấp'
  },
  {
    id: '2',
    title: 'Thiết kế UI/UX cho ứng dụng mobile e-commerce',
    description: 'Cần thiết kế giao diện người dùng cho ứng dụng mua sắm trực tuyến. Bao gồm wireframe, mockup và prototype tương tác.',
    budget: { min: 0, max: 0, display: 'Thương lượng' },
    duration: 'Hạn: 2 tuần',
    proposalsCount: '5-15',
    skills: ['UI/UX', 'Mobile Design', 'Figma', 'Prototyping'],
    clientInfo: {
      name: 'Digital Commerce Co.',
      rating: 4.7,
      reviewsCount: 45,
      completedProjects: 67
    },
    postedTime: 'Đăng 5 giờ trước',
    isUrgent: true,
    isFavorited: false,
    experienceLevel: 'Chuyên gia'
  },
  {
    id: '3',
    title: 'Thiết kế brochure và poster cho sự kiện',
    description: 'Cần thiết kế brochure và poster cho sự kiện công nghệ lớn. Thiết kế cần thể hiện tính chuyên nghiệp và thu hút.',
    budget: { min: 4, max: 7, display: '4-7M VND' },
    duration: 'Hạn: 1 tuần',
    proposalsCount: '10-30',
    skills: ['Print Design', 'Poster', 'InDesign', 'Marketing'],
    clientInfo: {
      name: 'Event Management Pro',
      rating: 4.8,
      reviewsCount: 67,
      completedProjects: 89
    },
    postedTime: 'Đăng 1 ngày trước',
    isUrgent: false,
    isFavorited: false,
    experienceLevel: 'Trung cấp'
  },
  {
    id: '4',
    title: 'Viết kịch bản quảng cáo bánh quy Oreo',
    description: 'Viết kịch bản quảng cáo về bánh quy Oreo. Kịch bản cần thu hút và mang tính chuyên nghiệp.',
    budget: { min: 8, max: 12, display: '8-12M VND' },
    duration: 'Hạn: 5 ngày',
    proposalsCount: '5-15',
    skills: ['Content Writer'],
    clientInfo: {
      name: 'Green Food Vietnam',
      rating: 4.6,
      reviewsCount: 34,
      completedProjects: 56
    },
    postedTime: 'Đăng 3 ngày trước',
    isUrgent: false,
    isFavorited: false,
    experienceLevel: 'Trung cấp'
  }
]

// Mock filter configuration
const mockFilters = {
  categories: [
    { id: 'all', label: 'Tất cả danh mục', value: 'all' },
    { id: 'design', label: 'Thiết kế', value: 'design' },
    { id: 'development', label: 'Phát triển', value: 'development' },
    { id: 'marketing', label: 'Marketing', value: 'marketing' }
  ],
  budgetRanges: [
    { id: 'under-1m', label: 'Dưới 1M', value: 'under-1m' },
    { id: '1-5m', label: '1-5M', value: '1-5m' },
    { id: '5-10m', label: '5-10M', value: '5-10m' },
    { id: 'over-10m', label: 'Trên 10M', value: 'over-10m' }
  ],
  durations: [
    { id: 'under-1-week', label: 'Dưới 1 tuần', value: 'under-1-week' },
    { id: '1-4-weeks', label: '1-4 tuần', value: '1-4-weeks' },
    { id: '1-3-months', label: '1-3 tháng', value: '1-3-months' },
    { id: 'over-3-months', label: 'Trên 3 tháng', value: 'over-3-months' }
  ],
  experienceLevels: [
    { id: 'entry-level', label: 'Mới bắt đầu', value: 'entry-level' },
    { id: 'intermediate', label: 'Trung cấp', value: 'intermediate' },
    { id: 'expert', label: 'Chuyên gia', value: 'expert' }
  ]
}

export function JobsFreelancerPage() {
  const [sortBy, setSortBy] = useState('newest')
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    // TODO: Implement filtering logic
    console.log('Filter changed:', filterType, value)
  }

  const handleApplyFilters = () => {
    // TODO: Implement filter application
    console.log('Applying filters...')
  }

  const handleClearFilters = () => {
    // TODO: Implement filter clearing
    setFilteredJobs(mockJobs)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // TODO: Implement sorting logic
    console.log('Sort changed:', value)
  }

  const handleFavorite = (id: string) => {
    setFilteredJobs(jobs => 
      jobs.map(job => 
        job.id === id ? { ...job, isFavorited: !job.isFavorited } : job
      )
    )
  }

  const handleViewDetails = (id: string) => {
    console.log('View details for job:', id)
    // TODO: Navigate to job details
  }

  const handleApply = (id: string) => {
    console.log('Apply to job:', id)
    // TODO: Navigate to application form
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <JobFilters
            filters={mockFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content - Job Listings */}
        <div className="lg:col-span-2">
          <JobsHeader
            jobCount={filteredJobs.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          
          <JobsList
            jobs={filteredJobs}
            onFavorite={handleFavorite}
            onViewDetails={handleViewDetails}
            onApply={handleApply}
          />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <AdSpace />
          </div>
        </div>
      </div>
    </div>
  )
}