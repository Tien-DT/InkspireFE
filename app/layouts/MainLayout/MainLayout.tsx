import React, { memo } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { useAuth } from '~/contexts/AuthContext'
import { UserRole } from '~/types/user.type'
import { toast } from 'sonner'
import { LoadingState } from '~/components/ui/spinner'

interface MainLayoutProps {
  children?: React.ReactNode
}

function MainLayoutInner({ children }: MainLayoutProps) {
  const { profile, authReady } = useAuth()
  const location = useLocation()

  // Wait for auth to be ready
  if (!authReady) {
    return <LoadingState message='Đang tải...' size='md' variant='blast' className='min-h-screen' />
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
    </div>
  )
}

const MainLayout = memo(MainLayoutInner)
export default MainLayout
