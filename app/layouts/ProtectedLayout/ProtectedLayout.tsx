import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '~/contexts/AuthContext'
import { PATH } from '~/constants/path'

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login page with return url
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

  return <Outlet />
}
