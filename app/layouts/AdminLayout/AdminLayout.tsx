import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router'
import logo from '~/assets/logo.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator
} from '~/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Home,
  Users2,
  FolderKanban,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  Settings,
  BarChart3,
  SquarePen,
  LogOut,
  Banknote
} from 'lucide-react'
import { useAuth } from '~/contexts/AuthContext'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'
import { UserRole } from '~/types/user.type'
import { LoadingState } from '~/components/ui/spinner'
import { PATH } from '~/constants/path'

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Trang chủ', icon: Home, end: true },
  { to: '/admin/users', label: 'Quản lý người dùng', icon: Users2 },
  { to: '/admin/projects', label: 'Quản lý dự án', icon: FolderKanban },
  { to: '/admin/subscriptions', label: 'Quản lý gói đăng ký', icon: CreditCard },
  { to: '/admin/transactions', label: 'Giao dịch & Thanh toán', icon: CreditCard },
  { to: '/admin/withdraws', label: 'Yêu cầu rút tiền', icon: Banknote },
  { to: '/admin/moderation', label: 'Kiểm duyệt nội dung', icon: ShieldCheck },
  { to: '/admin/support', label: 'Hỗ trợ & Phản hồi', icon: LifeBuoy },
  { to: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings },
  { to: '/admin/reports', label: 'Báo cáo & Phân tích', icon: BarChart3 },
  { to: '/admin/reviews', label: 'Tạo review sách', icon: SquarePen }
]

function SidebarNavItem({ to, label, icon: Icon, end }: NavItem) {
  const location = useLocation()
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className='text-sm'>
        <Link to={to} aria-current={isActive ? 'page' : undefined}>
          <Icon className='mr-2 size-4' />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function AdminLayout() {
  const { profile, logout, isAuthenticated, authReady } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Wait for auth to be ready
  if (!authReady) {
    return <LoadingState message='Đang kiểm tra quyền truy cập...' size='md' variant='blast' className='min-h-screen' />
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    toast.error('Vui lòng đăng nhập để truy cập trang Admin')
    return (
      <Navigate
        to={PATH.login}
        replace
        state={{
          from: location.pathname,
          message: 'Vui lòng đăng nhập để truy cập trang Admin'
        }}
      />
    )
  }

  // Check if user has ADMIN role (role = 3)
  if (profile?.role !== UserRole.ADMIN) {
    toast.error('Bạn không có quyền truy cập trang Admin')
    return (
      <Navigate
        to={PATH.home}
        replace
        state={{
          message: 'Bạn không có quyền truy cập trang Admin'
        }}
      />
    )
  }

  const initial = (profile?.email || 'U').charAt(0).toUpperCase()

  const handleLogout = () => {
    logout()
    toast.success('Đăng xuất thành công')
    navigate('/')
  }

  return (
    <SidebarProvider>
      <Sidebar className='border-r'>
        <SidebarHeader className='px-3 py-4'>
          <div className='flex items-center justify-center gap-2 px-1'>
            <img src={logo} alt='Inkspire' className='h-20 w-auto' />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarNavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton asChild className='py-2' size={'lg'}>
                <div className='flex cursor-pointer items-center'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src='' alt={initial || 'User'} />
                    <AvatarFallback className='text-xs'>{initial}</AvatarFallback>
                  </Avatar>
                  <span className={cn('ml-2 truncate', !profile?.email && 'text-muted-foreground')}>
                    {profile?.email || 'Người dùng'}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
