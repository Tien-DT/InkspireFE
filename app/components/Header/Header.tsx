import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import logo from '~/assets/logo.png'
import { Input } from '~/components/ui/input'
import {
  BellDot,
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
import { PATH } from '~/constants/path'
import { useAuth } from '~/contexts/AuthContext'
import { useWallet } from '~/hooks/useWallet'
import { usePremiumStatus } from '~/hooks/usePremiumStatus'
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

export function Header() {
  const { userName, isAuthenticated, authReady, profile } = useAuth()
  const { data: wallet } = useWallet(profile?.id, isAuthenticated)
  const { data: isPremium } = usePremiumStatus(profile?.id, isAuthenticated)
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine if user is a client (CLIENT role) or freelancer (other roles)
  const isClient = profile?.role === UserRole.CLIENT
  const isFreelancer = profile?.role !== undefined && profile?.role !== UserRole.CLIENT

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

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-border shadow-sm'
          : 'bg-white border-border/50'
      }`}
    >
      <div className='container mx-auto px-4 lg:px-6'>
        <div className='flex h-16 items-center justify-between gap-4'>
          {/* Logo & Navigation */}
          <div className='flex items-center gap-6 lg:gap-8'>
            <Link to='/' className='flex items-center transition-transform hover:scale-105 h-14 w-36 overflow-hidden'>
              <img src={logo} alt='Inkspire Logo' className='h-full w-full object-cover object-center' />
            </Link>
            <nav className='hidden md:flex items-center gap-1'>
              {profile?.role !== UserRole.FREELANCER && (
                <Button variant='ghost' size='sm' asChild className='text-sm font-medium'>
                  <Link to={PATH.postProject}>Đăng tuyển dụng</Link>
                </Button>
              )}
              {profile?.role !== UserRole.CLIENT && (
                <Button variant='ghost' size='sm' asChild className='text-sm font-medium'>
                  <Link to={PATH.jobsFreelancer}>Tìm việc làm</Link>
                </Button>
              )}
              <Button variant='ghost' size='sm' asChild className='text-sm font-medium'>
                <a href='#how-it-works'>Cách thức hoạt động</a>
              </Button>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className='flex items-center space-x-10'>
            {/* Search Bar */}
            <form className='relative hidden sm:block'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10' />
              <Input
                type='search'
                placeholder='Tìm kiếm...'
                className='h-9 w-[380px] lg:w-[380px] pl-9 pr-4 shadow-md hover:shadow-lg focus:shadow-lg transition-shadow bg-background/50 backdrop-blur-sm'
              />
            </form>

            {authReady && isAuthenticated ? (
              <div className='flex items-center gap-5'>
                {/* Notifications */}
                <Button variant='ghost' size='icon' className='relative h-9 w-9 hover:bg-muted'>
                  <BellDot className='h-5 w-5' />
                  <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white'>
                    3
                  </span>
                </Button>

                {/* Messages */}
                <Button variant='ghost' size='icon' className='relative h-9 w-9 hover:bg-muted' asChild>
                  <Link to='/chat'>
                    <MessageSquareDot className='h-5 w-5' />
                    <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white'>
                      5
                    </span>
                  </Link>
                </Button>

                {/* Wallet */}
                <Link
                  to={PATH.payment}
                  className='group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/60 transition-all duration-200 shadow-sm hover:shadow-md'
                >
                  <Wallet className='h-4 w-4 text-emerald-600 transition-transform group-hover:scale-110' />
                  <span className='text-sm font-semibold text-emerald-700 tabular-nums'>
                    {wallet ? formatCurrency(wallet.balance) : '0 ₫'}
                  </span>
                </Link>

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
                          {isPremium && (
                            <Badge variant='featured' className='h-5 px-1.5 text-[10px]'>
                              <Crown className='h-3 w-3 mr-0.5' />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className='text-xs leading-none text-muted-foreground truncate'>{profile?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className='my-1' />
                    <DropdownMenuItem asChild className='cursor-pointer'>
                      <Link to={PATH.profile} className='flex items-center px-2 py-2 rounded-md'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 mr-3'>
                          <User className='h-4 w-4 text-primary' />
                        </div>
                        <span className='font-medium'>Thông tin cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className='cursor-pointer'>
                      <Link to={PATH.dashboard} className='flex items-center px-2 py-2 rounded-md'>
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
                      <DropdownMenuItem asChild className='cursor-pointer'>
                        <Link to={PATH.managePostProject} className='flex items-center px-2 py-2 rounded-md'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10 mr-3'>
                            <FileText className='h-4 w-4 text-green-600' />
                          </div>
                          <span className='font-medium'>Quản lý bài đăng</span>
                        </Link>
                      </DropdownMenuItem>
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
                            <span className='font-medium'>Ví & Rút tiền</span>
                          </Link>
                        </DropdownMenuItem>
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
                <Button
                  size='sm'
                  className='bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm'
                  asChild
                >
                  <Link to={PATH.register}>Đăng ký</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
