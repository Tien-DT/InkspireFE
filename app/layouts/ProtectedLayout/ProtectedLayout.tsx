import { Navigate, Outlet, useLocation } from 'react-router'
import { PATH } from '~/constants/path'
import { RecruitmentFormProvider } from '~/contexts/RecruitmentFormContext'
import { useAuth } from '~/contexts/AuthContext'
import { LoadingState } from '~/components/ui/spinner'

export default function ProtectedLayout() {
  const { isAuthenticated, authReady } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return <LoadingState message='Đang kiểm tra phiên đăng nhập...' size='md' variant='blast' className='min-h-screen' />
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
