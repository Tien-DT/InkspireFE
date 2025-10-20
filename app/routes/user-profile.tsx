import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Card, CardContent } from '~/components/ui/card'
import { Tabs, TabsContent } from '~/components/ui/tabs'
import { useUserProfile } from '~/hooks/useUser'
import { useChat } from '~/contexts/ChatContext'
import { ProfileHeader } from '~/components/profile/ProfileHeader'
import { ProfileContact } from '~/components/profile/ProfileContact'
import { ProfilePricing } from '~/components/profile/ProfilePricing'
import { ProfileSkills } from '~/components/profile/ProfileSkills'
import { ProfileTabs } from '~/components/profile/ProfileTabs'
import { ProfileErrorState } from '~/components/profile/ProfileStates'
import { ProfileIntroTab } from '~/components/profile/tabs/ProfileIntroTab'
import { ProfilePortfolioTab, ProfileReviewsTab } from '~/components/profile/tabs'

import type { ProfileData, PortfolioItem } from '~/types/profile.type'
import { AuthErrorBoundary } from '~/components/errors/AuthErrorBoundary'

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

function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { createNewConversation } = useChat()
  const [portfolioItems] = useState<PortfolioItem[]>(MOCK_PORTFOLIO)
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Fetch user profile from API using userId from URL
  const { data: userProfileData, isLoading, error } = useUserProfile(userId)

  // Profile data from API - memoized to prevent re-creation
  const profileData = useMemo<ProfileData | null>(() => {
    if (!userProfileData?.data) return null

    return {
      name: `${userProfileData.data.firstName} ${userProfileData.data.lastName}`,
      title: 'Freelancer',
      avatar: '',
      rating: 4.8,
      reviewCount: 0,
      location: 'Việt Nam',
      email: userProfileData.data.email,
      phone: userProfileData.data.phoneNumber || '',
      bio: '',
      priceRange: '500.000 - 800.000 VND',
      status: userProfileData.data.role === 1 ? 'Designer' : 'Developer',
      skills: [],
      portfolio: portfolioItems
    }
  }, [userProfileData, portfolioItems])

  const handleSendMessage = async () => {
    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng')
      return
    }

    console.log('[UserProfile] Creating conversation with userId:', userId)

    try {
      setIsSendingMessage(true)

      // Use ChatContext to create conversation (handles caching, state management)
      const conversation = await createNewConversation(userId)
      console.log('[UserProfile] Conversation created:', conversation)

      toast.success('Tạo cuộc trò chuyện thành công')
      navigate('/chat')
    } catch (error) {
      console.error('[UserProfile] Failed to create conversation:', error)
      toast.error('Không thể tạo cuộc trò chuyện', {
        description: 'Vui lòng thử lại sau.'
      })
    } finally {
      setIsSendingMessage(false)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow p-8 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải thông tin người dùng...</p>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return <ProfileErrorState />
  }

  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Left Sidebar */}
          <div className='lg:col-span-4 space-y-6'>
            <Card className='overflow-hidden border-0 shadow-sm pt-0'>
              <CardContent className='p-0'>
                <ProfileHeader
                  name={profileData.name}
                  title={profileData.title}
                  status={profileData.status}
                  avatar={profileData.avatar}
                  rating={profileData.rating}
                  reviewCount={profileData.reviewCount}
                />
                <ProfileContact
                  location={profileData.location}
                  email={profileData.email}
                  phone={profileData.phone}
                  onSendMessage={handleSendMessage}
                  onViewFullProfile={() => console.log('View full profile')}
                  isSendingMessage={isSendingMessage}
                />
                <ProfilePricing priceRange={profileData.priceRange} status={profileData.status} />
                <ProfileSkills skills={profileData.skills} />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-8'>
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
      </div>
    </div>
  )
}

export default function UserProfile() {
  return (
    <AuthErrorBoundary autoRedirectToLogin={true}>
      <UserProfilePage />
    </AuthErrorBoundary>
  )
}
