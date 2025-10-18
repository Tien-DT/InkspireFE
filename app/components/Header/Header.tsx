import { Link } from 'react-router'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import logo from '~/assets/logo.png'
import { Input } from '~/components/ui/input'
import {
  MessageSquareDot,
  Search,
  User,
  Wallet,
  Crown,
  LogOut,
  LayoutDashboard,
  Briefcase,
  FileText
} from 'lucide-react'
import { NotificationBell } from '~/components/notifications/NotificationBell'
import { ChatPopup } from '~/components/chat/ChatPopup'
import { PATH } from '~/constants/path'
import { useAuth } from '~/contexts/AuthContext'
import { useWallet } from '~/hooks/useWallet'
import { usePremiumStatus } from '~/hooks/usePremiumStatus'
import { useUnreadMessageCount } from '~/hooks/useUnreadMessageCount'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '../ui/badge'
import { UserRole } from '~/types/user.type'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton
} from '~/components/ui/navbar'

export function Header() {
  const { userName, isAuthenticated, authReady, profile } = useAuth()
  const { data: wallet } = useWallet(profile?.id, isAuthenticated)
  const { data: isPremium } = usePremiumStatus(profile?.id, isAuthenticated)
  const unreadCount = useUnreadMessageCount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine if user is a client (CLIENT role) or freelancer (other roles)
  const isClient = profile?.role === UserRole.CLIENT
  const isFreelancer = profile?.role !== undefined && profile?.role !== UserRole.CLIENT && profile?.role !== UserRole.ADMIN
  const isAdmin = profile?.role === UserRole.ADMIN

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Get initials: first letter of first_name + first letter of last_name
  const getUserInitials = (): string => {
    if (!profile?.first_name && !profile?.last_name) {
      return userName ? userName.charAt(0).toUpperCase() : 'U'
    }

    const firstInitial = profile.first_name?.charAt(0).toUpperCase() || ''
    const lastInitial = profile.last_name?.charAt(0).toUpperCase() || ''
    return firstInitial + lastInitial || 'U'
  }

  const userInitials = getUserInitials()

  // Navigation items - Hide all for ADMIN
  const navItems = isAdmin ? [] : [
    ...(profile?.role !== UserRole.FREELANCER ? [{ name: 'Đăng tuyển dụng', link: PATH.postProject }] : []),
    ...(profile?.role !== UserRole.CLIENT ? [{ name: 'Tìm việc làm', link: PATH.jobsFreelancer }] : []),
    { name: 'Cách thức hoạt động', link: '#how-it-works' }
  ]

  return (
    <Navbar className='top-0'>
      {/* Desktop Navigation */}
      <NavBody>
        {/* Logo - Large */}
        <Link
          to='/'
          className='flex items-center transition-transform hover:scale-105 h-10 w-20 overflow-hidden flex-shrink-0'
        >
          <img src={logo} alt='Inkspire Logo' className='h-full w-full object-cover object-center' />
        </Link>

        {/* Navigation Items */}
        {authReady && isAuthenticated && navItems.length > 0 && (
          <NavItems items={navItems} onItemClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Right Section */}
        <div className='flex items-center gap-4 ml-auto'>
          {/* Search Bar */}
          <form className='relative hidden lg:block'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10' />
            <Input type='search' placeholder='Tìm kiếm...' className='h-9 w-[280px] pl-9 pr-4' />
          </form>

          {authReady && isAuthenticated ? (
            <div className='flex items-center gap-3'>
              {/* Hide notifications, messages, wallet for ADMIN */}
              {!isAdmin && (
                <>
                  {/* Notifications */}
                  <NotificationBell />

                  {/* Chat Popup */}
                  <ChatPopup />

                  {/* Wallet */}
                  <Link
                    to={PATH.payment}
                    className='group hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/60 transition-all duration-200 shadow-sm hover:shadow-md'
                  >
                    <Wallet className='h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110' />
                    <span className='text-sm font-semibold text-emerald-700 tabular-nums'>
                      {wallet ? formatCurrency(wallet.balance) : '0 ₫'}
                    </span>
                  </Link>
                </>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-9 w-9 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2'
                  >
                    <Avatar className='h-9 w-9 border-2 border-background shadow-lg ring-2 ring-primary/20 transition-all hover:ring-primary/40 hover:shadow-xl'>
                      <AvatarImage src='' alt={userName || 'User'} />
                      <AvatarFallback className='bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white text-sm font-bold'>
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    {isPremium && (
                      <div className='absolute -bottom-0.5 -right-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-0.5 border-2 border-background shadow-lg animate-pulse'>
                        <Crown className='h-3 w-3 text-white' fill='white' />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-64 p-2 shadow-xl border-border/50'>
                  <DropdownMenuLabel className='font-normal px-2 py-3'>
                    <div className='flex flex-col space-y-1.5'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold leading-none text-foreground'>{userName || 'User'}</p>
                        {isPremium && !isAdmin && (
                          <Badge variant='featured' className='h-5 px-1.5 text-[10px]'>
                            <Crown className='h-3 w-3 mr-0.5' />
                            Premium
                          </Badge>
                        )}
                        {isAdmin && (
                          <Badge variant='default' className='h-5 px-1.5 text-[10px] bg-red-600'>
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className='text-xs leading-none text-muted-foreground truncate'>{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className='my-1' />
                  {isAdmin ? (
                    // Admin menu - only admin dashboard
                    <DropdownMenuItem asChild className='cursor-pointer'>
                      <Link to='/admin' className='flex items-center px-2 py-2 rounded-md'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 mr-3'>
                          <LayoutDashboard className='h-4 w-4 text-red-600' />
                        </div>
                        <span className='font-medium'>Trang quản trị</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    // Regular user menu
                    <>
                      <DropdownMenuItem asChild className='cursor-pointer'>
                        <Link to={PATH.profile} className='flex items-center px-2 py-2 rounded-md'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 mr-3'>
                            <User className='h-4 w-4 text-primary' />
                          </div>
                          <span className='font-medium'>Thông tin cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className='cursor-pointer'>
                        <Link 
                          to={isClient ? PATH.dashboardClient : PATH.dashboardFreelancer} 
                          className='flex items-center px-2 py-2 rounded-md'
                        >
                          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 mr-3'>
                            <LayoutDashboard className='h-4 w-4 text-blue-600' />
                          </div>
                          <span className='font-medium'>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className='cursor-pointer'>
                        <Link to={PATH.manageProjects} className='flex items-center px-2 py-2 rounded-md'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 mr-3'>
                            <Briefcase className='h-4 w-4 text-purple-600' />
                          </div>
                          <span className='font-medium'>Quản lý dự án</span>
                        </Link>
                      </DropdownMenuItem>
                      {isClient && (
                        <>
                          <DropdownMenuItem asChild className='cursor-pointer'>
                            <Link to={PATH.managePostProject} className='flex items-center px-2 py-2 rounded-md'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10 mr-3'>
                                <FileText className='h-4 w-4 text-green-600' />
                              </div>
                              <span className='font-medium'>Quản lý bài đăng</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className='cursor-pointer'>
                            <Link to='/freelancer/wallet' className='flex items-center px-2 py-2 rounded-md'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 mr-3'>
                                <Wallet className='h-4 w-4 text-emerald-600' />
                              </div>
                              <span className='font-medium'>Ví & Rút tiền</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      {isFreelancer && (
                        <>
                          <DropdownMenuItem asChild className='cursor-pointer'>
                            <Link to={PATH.manageApplications} className='flex items-center px-2 py-2 rounded-md'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 mr-3'>
                                <FileText className='h-4 w-4 text-orange-600' />
                              </div>
                              <span className='font-medium'>Quản lý ứng tuyển</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className='cursor-pointer'>
                            <Link to='/freelancer/wallet' className='flex items-center px-2 py-2 rounded-md'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 mr-3'>
                                <Wallet className='h-4 w-4 text-emerald-600' />
                              </div>
                              <span className='font-medium'>Phương thức thanh toán</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  )}
                  <DropdownMenuSeparator className='my-1' />
                  <DropdownMenuItem asChild className='cursor-pointer'>
                    <Link
                      to={PATH.logout}
                      className='flex items-center px-2 py-2 rounded-md text-destructive focus:text-destructive focus:bg-destructive/10'
                    >
                      <div className='flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 mr-3'>
                        <LogOut className='h-4 w-4 text-destructive' />
                      </div>
                      <span className='font-medium'>Đăng xuất</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : authReady ? (
            <div className='flex items-center gap-3'>
              <Button variant='ghost' size='sm' asChild>
                <Link to={PATH.login}>Đăng nhập</Link>
              </Button>
              <NavbarButton href={PATH.register} variant='gradient' className='px-4 py-2 text-sm'>
                Đăng ký
              </NavbarButton>
            </div>
          ) : null}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link to='/' className='flex items-center transition-transform hover:scale-105 h-14 w-32 overflow-hidden'>
            <img src={logo} alt='Inkspire Logo' className='h-full w-full object-cover object-center' />
          </Link>
          <MobileNavToggle isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          {authReady &&
            isAuthenticated &&
            navItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className='text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white w-full'
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          {authReady && isAuthenticated && (
            <>
              <div className='w-full border-t pt-4'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='w-full justify-start flex items-center gap-3 px-2 py-2'>
                      <Avatar className='h-8 w-8 border-2 border-background'>
                        <AvatarImage src='' alt={userName || 'User'} />
                        <AvatarFallback className='bg-gradient-to-br from-primary to-primary/80 text-white text-xs font-bold'>
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col items-start'>
                        <span className='text-sm font-semibold'>{userName || 'User'}</span>
                        <span className='text-xs text-muted-foreground'>{profile?.email}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-56'>
                    <DropdownMenuItem asChild>
                      <Link to={PATH.profile} className='flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        <span>Thông tin cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={PATH.dashboard} className='flex items-center gap-2'>
                        <LayoutDashboard className='h-4 w-4' />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={PATH.logout} className='flex items-center gap-2 text-destructive'>
                        <LogOut className='h-4 w-4' />
                        <span>Đăng xuất</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          {authReady && !isAuthenticated && (
            <div className='w-full border-t pt-4 flex flex-col gap-2'>
              <Button variant='ghost' className='w-full' asChild>
                <Link to={PATH.login}>Đăng nhập</Link>
              </Button>
              <NavbarButton href={PATH.register} variant='gradient' className='w-full'>
                Đăng ký
              </NavbarButton>
            </div>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
