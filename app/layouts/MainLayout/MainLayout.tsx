import React, { memo } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { useAuth } from '~/contexts/AuthContext'
import { UserRole } from '~/types/user.type'
import { toast } from 'sonner'
import { IncomingCallToast } from '~/components/call/IncomingCallToast'
import { VideoCallDialog } from '~/components/call/VideoCallDialog'

interface MainLayoutProps {
  children?: React.ReactNode
}

function MainLayoutInner({ children }: MainLayoutProps) {
  const { profile, authReady } = useAuth()
  const location = useLocation()

  // Nếu authReady chưa true, hydrateFallback sẽ hiển thị
  if (!authReady) {
    return null
  }

  // Redirect ADMIN to /admin if they try to access public pages
  if (profile?.role === UserRole.ADMIN) {
    toast.error('Admin chỉ có thể truy cập trang quản trị')
    return (
      <Navigate
        to='/admin'
        replace
        state={{
          from: location.pathname,
          message: 'Admin chỉ có thể truy cập trang quản trị'
        }}
      />
    )
  }

  return (
    <div>
      <Header />
      {children}
      <main>
        <Outlet />
      </main>
      <Footer />

      {/* Global Call Components - Show on all pages */}
      <IncomingCallToast />
      <VideoCallDialog />
    </div>
  )
}

const MainLayout = memo(MainLayoutInner)
export default MainLayout
