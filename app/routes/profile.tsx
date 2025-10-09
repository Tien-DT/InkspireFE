import { useState, useMemo } from 'react'
import { Edit } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
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
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-end mb-4'>
          <Button onClick={() => setIsEditDialogOpen(true)} className='btn-submit'>
            <Edit className='h-4 w-4 mr-2' />
            Chỉnh sửa profile
          </Button>
        </div>

        <div className='grid lg:grid-cols-[350px_1fr] gap-6'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            <Card className='overflow-hidden py-0'>
              <CardContent className='p-0'>
                <ProfileHeader
                  name={profileData.name}
                  status={profileData.status}
                  avatar={profileData.avatar}
                  rating={profileData.rating}
                  reviewCount={profileData.reviewCount}
                />
                <ProfileContact
                  location={profileData.location}
                  email={profileData.email}
                  phone={profileData.phone}
                  onSendMessage={() => console.log('Send message')}
                  onViewFullProfile={() => console.log('View full profile')}
                />

                <ProfilePricing priceRange={profileData.priceRange} status={profileData.status} />

                <ProfileSkills skills={profileData.skills} />
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className='space-y-6'>
            <Card className='border-0 shadow-sm'>
              <Tabs defaultValue='intro' className='w-full'>
                <ProfileTabs />

                <TabsContent value='intro' className='mt-0 p-6'>
                  <ProfileIntroTab bio={profileData.bio} />
                </TabsContent>

                <TabsContent value='portfolio' className='mt-0 p-6'>
                  <ProfilePortfolioTab portfolio={profileData.portfolio} />
                </TabsContent>

                <TabsContent value='reviews' className='mt-0 p-6'>
                  <ProfileReviewsTab />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='!max-w-[85vw] !w-[85vw] h-[90vh] bg-white flex flex-col p-0 gap-0 overflow-hidden'>
            <DialogHeader className='px-6 pt-6 pb-4 border-b shrink-0 bg-white'>
              <DialogTitle className='text-2xl'>{hasProfile ? 'Chỉnh sửa profile' : 'Tạo profile mới'}</DialogTitle>
              <DialogDescription>
                {hasProfile
                  ? 'Cập nhật thông tin cá nhân, chuyên môn và portfolio của bạn'
                  : 'Điền thông tin để tạo profile chuyên nghiệp'}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={editingTab}
              onValueChange={(v) => setEditingTab(v as EditTabType)}
              className='flex-1 flex flex-col min-h-0 overflow-hidden'
            >
              <div className='px-6 pt-4 pb-2 shrink-0 bg-white border-b'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='profile'>Thông tin Profile</TabsTrigger>
                  <TabsTrigger value='portfolio'>Portfolio</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value='profile' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
                <ProfileEditForm
                  defaultValues={formDefaultValues}
                  onSubmit={handleSaveProfile}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </TabsContent>

              <TabsContent value='portfolio' className='flex-1 overflow-y-auto scrollbar-hide px-6 py-6 mt-0 min-h-0'>
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
