import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import logo from '~/assets/logo.svg'
import { Input } from '~/components/ui/input'
import { BellDot, MessageSquareDot, Search, User, Wallet } from 'lucide-react'
import { PATH } from '~/constants/path'
import { useAuth } from '~/contexts/AuthContext'
import { useWallet } from '~/hooks/useWallet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '../ui/badge'
import { UserRole } from '~/types/user.type'

export function Header() {
  const { userName, isAuthenticated, authReady, profile } = useAuth()
  const { data: wallet } = useWallet(profile?.id, isAuthenticated)

  // Determine if user is a client (CLIENT role) or freelancer (other roles)
  const isClient = profile?.role === UserRole.CLIENT
  const isFreelancer = profile?.role !== undefined && profile?.role !== UserRole.CLIENT

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
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
    <header className='bg-white border-b border-border'>
      <div className='container mx-auto px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <Link to='/'>
              <img src={logo} alt='Logo' className='h-12 w-auto md:h-14 object-fill inline-block' />
            </Link>
            <nav className='hidden md:flex items-center space-x-6'>
              <Link to={PATH.postProject} className='text-sm text-muted-foreground hover:text-foreground'>
                Đăng tuyển dụng
              </Link>
              <Link to={PATH.jobsFreelancer} className='text-sm text-muted-foreground hover:text-foreground'>
                Tìm việc làm
              </Link>
              <Link to='#' className='text-sm text-muted-foreground hover:text-foreground'>
                Cách thức hoạt động
              </Link>
            </nav>
          </div>

          <div className='flex items-center space-x-4'>
            <form className='relative'>
              <Input type='search' placeholder='Tìm kiếm...' className='md:w-[100px] lg:w-[300px] pr-8' />
              <Button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent shadow-none hover:bg-transparent'
              >
                <Search className='h-5 w-5 text-gray-400' />
              </Button>
            </form>
            {authReady && isAuthenticated ? (
              <div className='flex items-center space-x-4'>
                {/* Notifications */}
                <Button variant='ghost' size='icon' className='relative'>
                  <BellDot className='h-5 w-5' />
                  <Badge variant='destructive' className='absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px]'>
                    3
                  </Badge>
                </Button>

                {/* Messages */}
                <Button variant='ghost' size='icon' className='relative'>
                  <Link to='/chat'>
                    <MessageSquareDot className='h-5 w-5' />
                    <Badge variant='destructive' className='absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px]'>
                      5
                    </Badge>
                  </Link>
                </Button>

                {/* Wallet */}
                <Link
                  to={PATH.payment}
                  className='flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200'
                >
                  <Wallet className='h-4 w-4 text-emerald-600' />
                  <span className='text-sm font-semibold text-emerald-700'>
                    {wallet ? formatCurrency(wallet.balance) : '0 ₫'}
                  </span>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='relative h-10 w-10 rounded-full p-0'>
                      <Avatar className='h-10 w-10 border-2 border-white shadow-lg ring-2 ring-purple-100'>
                        <AvatarImage src='' alt={userName || 'User'} />
                        <AvatarFallback className='bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-bold'>
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link to={PATH.profile} className='flex items-center'>
                        <User className='mr-2 h-4 w-4' />
                        Thông tin cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={PATH.dashboard}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={PATH.manageProjects}>Quản lý dự án</Link>
                    </DropdownMenuItem>
                    {isClient && (
                      <DropdownMenuItem>
                        <Link to={PATH.managePostProject}>Quản lý bài đăng</Link>
                      </DropdownMenuItem>
                    )}
                    {isFreelancer && (
                      <DropdownMenuItem>
                        <Link to={PATH.manageApplications}>Quản lý ứng tuyển</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className='text-destructive'>
                      <Link to={PATH.logout}>Đăng xuất</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : authReady ? (
              <>
                <Button variant='ghost' size='sm' asChild>
                  <Link to={PATH.login}>Đăng nhập</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link to={PATH.register}>Đăng ký</Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
