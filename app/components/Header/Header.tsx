import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import logo from '~/assets/logo.svg'
import { Input } from '~/components/ui/input'
import { BellDot, MessageSquareDot, Search, User } from 'lucide-react'
import { PATH } from '~/constants/path'
import { useAuth } from '~/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '../ui/badge'

export function Header() {
  const { userName, isAuthenticated, authReady } = useAuth()

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

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src='' alt={userName || 'User'} />
                        <AvatarFallback>{(userName || 'U').charAt(0).toUpperCase()}</AvatarFallback>
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
                      <Link to={PATH.manageProject}>Quản lý dự án</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={PATH.managePostProject}>Quản lý bài đăng</Link>
                    </DropdownMenuItem>
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
