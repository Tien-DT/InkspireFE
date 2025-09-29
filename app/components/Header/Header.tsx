import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import logo from '~/assets/logo.svg'
import { Input } from '~/components/ui/input'
import { Search } from 'lucide-react'
import path from '~/constants/path'

export function Header() {
  return (
    <header className='bg-white border-b border-border'>
      <div className='container mx-auto px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-8'>
            <Link to='/'>
              <img src={logo} alt='Logo' className='h-12 w-auto md:h-14 object-fill inline-block' />
            </Link>
            <nav className='hidden md:flex items-center space-x-6'>
              <Link to="/post-project" className='text-sm text-muted-foreground hover:text-foreground'>
                Đăng tuyển dụng
              </Link>
              <Link to={path.jobsFreelancer} className='text-sm text-muted-foreground hover:text-foreground'>
                Tìm việc làm
              </Link>
              <Link to="/about" className='text-sm text-muted-foreground hover:text-foreground'>
                Cách thức hoạt động
              </Link>
            </nav>
          </div>

          <div className='flex items-center space-x-4'>
            <form className='relative'>
              <Input type='search' placeholder='Tìm kiếm...' className='md:w-[100px] lg:w-[300px] pr-8' />
              <Button className='absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent shadow-none hover:bg-transparent'>
                <Search className='h-5 w-5 text-gray-400' />
              </Button>
            </form>
            <Button variant='ghost' size='sm' asChild>
              <Link to={path.login}>Đăng nhập</Link>
            </Button>
            <Button size='sm' asChild>
              <Link to={path.register}>Đăng ký</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
