import { useState, useMemo } from 'react'
import { Edit } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useUserProfile } from '~/hooks/useUser'
import { getProfileFromLS } from '~/utils/auth'
import { ProfileHeader } from '~/components/profile/ProfileHeader'
import { ProfileContact } from '~/components/profile/ProfileContact'
import { ProfilePricing } from '~/components/profile/ProfilePricing'
import { ProfileSkills } from '~/components/profile/ProfileSkills'
import { ProfileTabs } from '~/components/profile/ProfileTabs'
import { ProfileEditForm } from '~/components/profile/ProfileEditForm'
import { ProfileEmptyState } from '~/components/profile/ProfileEmptyState'
import { ProfileLoadingState, ProfileErrorState } from '~/components/profile/ProfileStates'
import { ProfileIntroTab } from '~/components/profile/tabs/ProfileIntroTab'

import type { ProfileData, PortfolioItem } from '~/types/profile.type'
import type { ProfileFormValues } from '~/lib/validations/profile.schema'
import { AuthErrorBoundary } from '~/components/errors/AuthErrorBoundary'
import { PortfolioEditTab, ProfilePortfolioTab, ProfileReviewsTab } from '~/components/profile/tabs'

// Mock portfolio data - will be replaced with API later
const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1,
    title: 'Logo thiết kế cho startup AI',
    category: 'Logo Design',
    description: 'Thiết kế logo hiện đại cho các công ty công nghệ AI',
    image: ''
  },
  {
    id: 2,
    title: 'Brand identity cho chuỗi cafe',
    category: 'Brand Identity',
    description: 'Hệ thống nhận diện thương hiệu hoàn chỉnh cho chuỗi cafe',
    image: ''
  },
  {
    id: 3,
    title: 'Logo cho ứng dụng fintech',
    category: 'Logo Design',
    description: 'Logo tối giản cho ứng dụng tài chính',
    image: ''
  },
  {
    id: 4,
    title: 'Thiết kế logo thương mại điện tử',
    category: 'Logo Design',
    description: 'Logo năng động cho nền tảng thương mại điện tử',
    image: ''
  }
]

type EditTabType = 'profile' | 'portfolio'

function ProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTab, setEditingTab] = useState<EditTabType>('profile')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(MOCK_PORTFOLIO)

  // Get current user from localStorage
  const currentUser = getProfileFromLS()
  const userId = currentUser?.id

  // Fetch user profile from API
  const { data: userProfileData, isLoading, error } = useUserProfile(userId)

  // Profile data from API - memoized to prevent re-creation
  const profileData = useMemo<ProfileData | null>(() => {
    if (!userProfileData?.data) return null

    return {
      name: `${userProfileData.data.firstName} ${userProfileData.data.lastName}`,
      title: 'Freelancer', // TODO: Add title field to backend
      avatar: '',
      rating: 4.8, // TODO: Add rating from backend
      reviewCount: 0, // TODO: Add review count from backend
      location: 'Việt Nam', // TODO: Add location field to backend
      email: userProfileData.data.email,
      phone: userProfileData.data.phoneNumber || '',
      bio: '', // TODO: Add bio field to backend
      priceRange: '500.000 - 800.000 VND', // TODO: Add price range to backend
      status: userProfileData.data.role === 1 ? 'Client' : 'Freelancer', // TODO: Improve status mapping
      skills: [], // TODO: Add skills from backend
      portfolio: portfolioItems
    }
  }, [userProfileData, portfolioItems])

  // Convert profile data to form values
  const formDefaultValues = useMemo<ProfileFormValues>(() => {
    if (!profileData) {
      return {
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        priceRange: '',
        status: '',
        skills: ''
      }
    }

    return {
      name: profileData.name,
      title: profileData.title,
      bio: profileData.bio,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      priceRange: profileData.priceRange,
      status: profileData.status,
      skills: profileData.skills.join(', ')
    }
  }, [profileData])

  const hasProfile = !!profileData

  const handleSaveProfile = (data: ProfileFormValues) => {
    // TODO: Call API to update profile
    console.log('Save profile:', data)
    setIsEditDialogOpen(false)
  }

  const handleSavePortfolio = (items: PortfolioItem[]) => {
    // TODO: Call API to save portfolio
    console.log('Save portfolio:', items)
    setPortfolioItems(items)
    setIsEditDialogOpen(false)
  }

  // Loading state
  if (isLoading) {
    return <ProfileLoadingState />
  }

  // Error state
  if (error) {
    return <ProfileErrorState />
  }

  // Empty state
  if (!hasProfile) {
    return <ProfileEmptyState onCreateProfile={() => setIsEditDialogOpen(true)} />
  }

  return (
    <div className='container mx-auto min-h-screen bg-gradient-to-br from-muted/30 via-background to-background'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-64 bg-section opacity-30 blur-3xl' />
      <div className='px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mb-8 flex flex-col items-center justify-end gap-4 text-center md:flex-row md:justify-between md:text-left'>
          <div className='w-full flex-1 text-sm text-muted-foreground'>
            <span className='rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary'>
              Hồ sơ cá nhân
            </span>
            <h1 className='mt-3 text-3xl font-semibold text-foreground sm:text-4xl'>
              Không gian thể hiện bản thân và kinh nghiệm của bạn
            </h1>
            <p className='mt-2 text-base text-muted-foreground'>
              Cập nhật thông tin để thu hút thêm khách hàng và hợp tác chất lượng.
            </p>
          </div>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            variant='shine'
            size='lg'
            className='shadow-lg hover:shadow-xl'
          >
            <Edit className='mr-2 h-5 w-5' />
            Chỉnh sửa profile
          </Button>
        </div>

        <div className='grid gap-8 lg:grid-cols-[360px_1fr]'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            <div className='overflow-hidden rounded-3xl border border-border/40 bg-card/90 shadow-xl backdrop-blur'>
              <ProfileHeader
                name={profileData.name}
                status={profileData.status}
                avatar={profileData.avatar}
                rating={profileData.rating}
                reviewCount={profileData.reviewCount}
              />
              <div className='space-y-5 p-6'>
                <ProfileContact
                  location={profileData.location}
                  email={profileData.email}
                  phone={profileData.phone}
                  onSendMessage={() => console.log('Send message')}
                  onViewFullProfile={() => console.log('View full profile')}
                />
                <ProfilePricing priceRange={profileData.priceRange} status={profileData.status} />
                <ProfileSkills skills={profileData.skills} />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className='space-y-6'>
            <Card className='overflow-hidden rounded-3xl border border-border/40 bg-card/90 shadow-xl backdrop-blur'>
              <Tabs defaultValue='intro' className='w-full'>
                <div className='sticky top-0 z-10 border-b border-border/40 bg-card/95 px-6 pb-4 pt-6 backdrop-blur-sm'>
                  <ProfileTabs />
                </div>

                <TabsContent value='intro' className='mt-0 space-y-6 px-6 pb-6 pt-4'>
                  <ProfileIntroTab bio={profileData.bio} />
                </TabsContent>

                <TabsContent value='portfolio' className='mt-0 space-y-6 px-6 pb-6 pt-4'>
                  <ProfilePortfolioTab portfolio={profileData.portfolio} />
                </TabsContent>

                <TabsContent value='reviews' className='mt-0 space-y-6 px-6 pb-6 pt-4'>
                  <ProfileReviewsTab />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='flex h-[90vh] !w-5xl min-w-5xl flex-col gap-0 overflow-hidden rounded-3xl border border-border/40 bg-card/95 p-0 shadow-2xl backdrop-blur'>
            <DialogHeader className='shrink-0 border-b border-border/40 bg-card/95 px-6 pb-4 pt-6'>
              <DialogTitle className='text-2xl font-semibold text-foreground'>
                {hasProfile ? 'Chỉnh sửa profile' : 'Tạo profile mới'}
              </DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                {hasProfile
                  ? 'Cập nhật thông tin cá nhân, chuyên môn và portfolio của bạn'
                  : 'Điền thông tin để tạo profile chuyên nghiệp'}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={editingTab}
              onValueChange={(v) => setEditingTab(v as EditTabType)}
              className='flex min-h-0 flex-1 flex-col overflow-hidden'
            >
              <div className='shrink-0 border-b border-border/40 bg-card/95 px-6 pb-2 pt-4'>
                <TabsList className='grid w-full grid-cols-2 rounded-2xl border border-border/40 bg-card/80 p-1 text-muted-foreground'>
                  <TabsTrigger
                    value='profile'
                    className='rounded-xl px-6 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  >
                    Thông tin Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value='portfolio'
                    className='rounded-xl px-6 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  >
                    Portfolio
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='profile' className='mt-0 flex-1 min-h-0 overflow-y-auto px-6 scrollbar-hide'>
                <ProfileEditForm
                  defaultValues={formDefaultValues}
                  onSubmit={handleSaveProfile}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </TabsContent>

              <TabsContent value='portfolio' className='mt-0 flex-1 min-h-0 overflow-y-auto px-6 scrollbar-hide'>
                <PortfolioEditTab
                  initialItems={portfolioItems}
                  onSave={handleSavePortfolio}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Wrap with ErrorBoundary
export default function Profile() {
  return (
    <AuthErrorBoundary autoRedirectToLogin>
      <ProfilePage />
    </AuthErrorBoundary>
  )
}
