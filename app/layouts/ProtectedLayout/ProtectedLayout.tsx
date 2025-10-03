import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '~/contexts/AuthContext'
import { PATH } from '~/constants/path'
import { RecruitmentFormProvider } from '~/contexts/RecruitmentFormContext'

export default function ProtectedLayout() {
  const { isAuthenticated, authReady } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <p className='text-sm text-muted-foreground'>Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    )
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

  return (
    <RecruitmentFormProvider>
      <Outlet />
    </RecruitmentFormProvider>
  )
}
