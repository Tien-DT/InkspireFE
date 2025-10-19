import { Navigate, Outlet, useLocation } from 'react-router'
import { PATH } from '~/constants/path'
import { RecruitmentFormProvider } from '~/contexts/RecruitmentFormContext'
import { useAuth } from '~/contexts/AuthContext'
import { UserRole } from '~/types/user.type'
import { toast } from 'sonner'

export default function ProtectedLayout() {
  const { isAuthenticated, authReady, profile } = useAuth()
  const location = useLocation()

  if (!authReady) {
    // Nếu authReady chưa true, hydrateFallback sẽ hiển thị
    // Trả về null để tránh duplicate loading UI
    return null
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={PATH.login}
        replace
        state={{
          from: location.pathname,
          message: 'Vui lòng đăng nhập để tiếp tục'
        }}
      />
    )
  }

  // Block ADMIN from accessing non-admin pages
  if (profile?.role === UserRole.ADMIN) {
    toast.error('Admin chỉ có thể truy cập trang quản trị')
    return (
      <Navigate
        to='/admin'
        replace
        state={{
          message: 'Admin chỉ có thể truy cập trang quản trị'
        }}
      />
    )
  }

  return (
    <RecruitmentFormProvider>
      <Outlet />
    </RecruitmentFormProvider>
  )
}
