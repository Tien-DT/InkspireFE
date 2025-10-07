import { useState } from 'react'
import { Briefcase, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import {
  StatsCard,
  FilterTabs,
  ApplicationCard,
  EmptyApplicationsState,
  ApplicationDetailsDialog
} from '~/components/manage-applications'
import type { JobApplication, FilterStatus } from '~/components/manage-applications'
import { mockApplications } from '~/data/mockApplications'
import { AuthErrorBoundary } from '~/components/errors'

function ManageApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application)
    setIsViewDialogOpen(true)
  }

  const handleWithdrawApplication = (applicationId: string) => {
    // TODO: Call API to withdraw application
    console.log('Withdraw application:', applicationId)
  }

  const handleEditApplication = () => {
    // TODO: Navigate to edit page or open edit dialog
    console.log('Edit application')
  }

  const filteredApplications = mockApplications.filter((app) => {
    if (filterStatus === 'all') return true
    return app.status === filterStatus
  })

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter((app) => app.status === 'pending').length,
    accepted: mockApplications.filter((app) => app.status === 'accepted').length,
    rejected: mockApplications.filter((app) => app.status === 'rejected').length
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gradient mb-2'>Quản lý ứng tuyển</h1>
          <p className='text-gray-600'>Theo dõi và quản lý các công việc bạn đã ứng tuyển</p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <StatsCard
            label='Tổng ứng tuyển'
            value={stats.total}
            icon={Briefcase}
            iconColor='text-blue-500'
            valueColor='text-gray-900'
            onClick={() => setFilterStatus('all')}
          />
          <StatsCard
            label='Đang chờ'
            value={stats.pending}
            icon={AlertCircle}
            iconColor='text-yellow-500'
            valueColor='text-yellow-600'
            onClick={() => setFilterStatus('pending')}
          />
          <StatsCard
            label='Được chấp nhận'
            value={stats.accepted}
            icon={CheckCircle}
            iconColor='text-green-500'
            valueColor='text-green-600'
            onClick={() => setFilterStatus('accepted')}
          />
          <StatsCard
            label='Bị từ chối'
            value={stats.rejected}
            icon={XCircle}
            iconColor='text-red-500'
            valueColor='text-red-600'
            onClick={() => setFilterStatus('rejected')}
          />
        </div>

        {/* Filter Tabs */}
        <FilterTabs activeFilter={filterStatus} onFilterChange={setFilterStatus} />

        {/* Applications List */}
        <div className='space-y-4'>
          {filteredApplications.length === 0 ? (
            <EmptyApplicationsState filterStatus={filterStatus} />
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onView={() => handleViewApplication(application)}
                onWithdraw={() => handleWithdrawApplication(application.id)}
              />
            ))
          )}
        </div>

        {/* Application Details Dialog */}
        <ApplicationDetailsDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          application={selectedApplication}
          onWithdraw={() => selectedApplication && handleWithdrawApplication(selectedApplication.id)}
          onEdit={handleEditApplication}
        />
      </div>
    </div>
  )
}

export default function ManageApplications() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <ManageApplicationsPage />
    </AuthErrorBoundary>
  )
}
