import { useState, useMemo, useEffect } from 'react'
import { Edit, KeyRound } from 'lucide-react'
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
import { ProfileErrorState } from '~/components/profile/ProfileStates'
import { ProfileIntroTab } from '~/components/profile/tabs/ProfileIntroTab'
import { ChangePasswordDialog } from '~/components/profile/ChangePasswordDialog'
import { toast } from 'sonner'

import type { ProfileData, PortfolioItem } from '~/types/profile.type'
import type { ProfileFormValues } from '~/lib/validations/profile.schema'
import { AuthErrorBoundary } from '~/components/errors/AuthErrorBoundary'
import { PortfolioEditTab, ProfilePortfolioTab, ProfileReviewsTab } from '~/components/profile/tabs'
import { portfolioApi } from '~/apis/portfolio.api'

type EditTabType = 'profile' | 'portfolio'

function ProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTab, setEditingTab] = useState<EditTabType>('profile')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loadingPortfolios, setLoadingPortfolios] = useState(false)
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)

  // Get current user from localStorage
  const currentUser = getProfileFromLS()
  const userId = currentUser?.id
  const userRole = currentUser?.role

  // Fetch user profile from API
  const { data: userProfileData, isLoading, error } = useUserProfile(userId)

  // Fetch user portfolios
  useEffect(() => {
    if (userId) {
      setLoadingPortfolios(true)
      portfolioApi.getUserPortfolios(userId)
        .then((portfolios) => {
          setPortfolioItems(portfolios.map(p => ({
            id: p.id,
            name: p.name || '',
            project: p.project || '',
            skill: p.skill || '',
            description: p.description || '',
            imageUrl: p.imageUrl || '',
            pdfUrl: p.pdfUrl || ''
          })))
        })
        .catch((err) => {
          console.error('Failed to load portfolios:', err)
        })
        .finally(() => {
          setLoadingPortfolios(false)
        })
    }
  }, [userId])

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

  const handleSavePortfolio = async (items: PortfolioItem[]) => {
    if (!userId) return

    try {
      // Save each portfolio item
      const savePromises = items.map(async (item) => {
        if (item.id.startsWith('temp-')) {
          // Create new portfolio
          return await portfolioApi.createPortfolio({
            userId: userId,
            name: item.name,
            project: item.project,
            skill: item.skill,
            description: item.description,
            imageUrl: item.imageUrl,
            pdfUrl: item.pdfUrl,
            status: 1
          })
        } else {
          // Update existing portfolio
          return await portfolioApi.updatePortfolio(item.id, {
            name: item.name,
            project: item.project,
            skill: item.skill,
            description: item.description,
            imageUrl: item.imageUrl,
            pdfUrl: item.pdfUrl
          })
        }
      })

      await Promise.all(savePromises)

      // Refresh portfolios
      const updatedPortfolios = await portfolioApi.getUserPortfolios(userId)
      setPortfolioItems(updatedPortfolios.map(p => ({
        id: p.id,
        name: p.name || '',
        project: p.project || '',
        skill: p.skill || '',
        description: p.description || '',
        imageUrl: p.imageUrl || '',
        pdfUrl: p.pdfUrl || ''
      })))

      toast.success('Đã lưu portfolio')
      setIsEditDialogOpen(false)
    } catch (error) {
      toast.error('Không thể lưu portfolio')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải hồ sơ cá nhân...</p>
        </div>
      </div>
    )
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
    <div className='container mx-auto min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
      <div className='px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mb-12 flex flex-col items-center justify-end gap-6 text-center md:flex-row md:justify-between md:text-left'>
          <div className='w-full flex-1'>
            <h1 className='text-3xl font-semibold text-foreground sm:text-4xl'>Hồ sơ cá nhân</h1>
            <p className='mt-3 text-base text-muted-foreground'>Không gian thể hiện bản thân và kinh nghiệm của bạn</p>
          </div>
          <div className='flex gap-3'>
            <Button onClick={() => setIsChangePasswordDialogOpen(true)} variant='outline' size='lg'>
              <KeyRound className='mr-2 h-5 w-5' />
              Đổi mật khẩu
            </Button>
            <Button onClick={() => setIsEditDialogOpen(true)} variant='shine' size='lg'>
              <Edit className='mr-2 h-5 w-5' />
              Chỉnh sửa profile
            </Button>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-[360px_1fr]'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            <div className='overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md'>
              <ProfileHeader
                name={profileData.name}
                status={profileData.status}
                avatar={profileData.avatar}
                rating={profileData.rating}
                reviewCount={profileData.reviewCount}
              />
              <div className='space-y-4 p-6'>
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
            <div className='overflow-hidden rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md'>
              <Tabs defaultValue='intro' className='w-full'>
                <div className='sticky top-0 z-10 border-b border-border/20 bg-card/20 px-6 pb-4 pt-6 backdrop-blur-sm'>
                  <ProfileTabs userRole={userRole} />
                </div>

                <TabsContent value='intro' className='mt-0 space-y-6 px-6 pb-6 pt-4'>
                  <ProfileIntroTab bio={profileData.bio} />
                </TabsContent>

                {userRole === 2 && (
                  <TabsContent value='portfolio' className='mt-0 space-y-6 px-6 pb-6 pt-4'>
                    <ProfilePortfolioTab portfolio={profileData.portfolio} />
                  </TabsContent>
                )}

                <TabsContent value='reviews' className='mt-0 space-y-6 px-6 pb-6 pt-4'>
                  <ProfileReviewsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='flex h-[90vh] !w-5xl min-w-5xl flex-col gap-0 overflow-hidden rounded-2xl border border-border/30 bg-card/30 p-0 backdrop-blur-md'>
            <DialogHeader className='shrink-0 border-b border-border/20 bg-card/20 px-6 pb-4 pt-6 backdrop-blur-sm'>
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
              <div className='shrink-0 border-b border-border/20 bg-card/20 px-6 pb-2 pt-4 backdrop-blur-sm'>
                <TabsList className={`grid w-full ${userRole === 2 ? 'grid-cols-2' : 'grid-cols-1'} rounded-xl bg-card/40 p-1 text-muted-foreground`}>
                  <TabsTrigger
                    value='profile'
                    className='rounded-lg px-6 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                  >
                    Thông tin Profile
                  </TabsTrigger>
                  {userRole === 2 && (
                    <TabsTrigger
                      value='portfolio'
                      className='rounded-lg px-6 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'
                    >
                      Portfolio
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value='profile' className='mt-0 flex-1 min-h-0 overflow-y-auto px-6 scrollbar-hide'>
                <ProfileEditForm
                  defaultValues={formDefaultValues}
                  onSubmit={handleSaveProfile}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </TabsContent>

              {userRole === 2 && (
                <TabsContent value='portfolio' className='mt-0 flex-1 min-h-0 overflow-y-auto px-6 scrollbar-hide'>
                  <PortfolioEditTab
                    initialItems={portfolioItems}
                    onSave={handleSavePortfolio}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                </TabsContent>
              )}
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={isChangePasswordDialogOpen}
          onOpenChange={setIsChangePasswordDialogOpen}
        />
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
