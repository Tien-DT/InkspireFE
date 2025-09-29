import { Bell, ChevronDown, MessageSquare, Search, User } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'

export default function FreelancerHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[73px]">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <div className="w-[149px] h-[149px] relative -my-[38px]">
                <img 
                  src="/assets/logo.svg" 
                  alt="Inkspire Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/jobs-freelancer" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Tìm việc làm
            </a>
            <a 
              href="/portfolio" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Portfolio của tôi
            </a>
            <a 
              href="/my-projects" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dự án của tôi
            </a>
          </nav>

          {/* Right section with search and user actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 w-[381px] h-[40px] bg-white border border-gray-200 rounded"
              />
            </div>

            {/* Message notification */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <MessageSquare className="h-[27px] w-[27px] text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* Bell notification */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-[27px] w-[27px] text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <User className="h-[27px] w-[27px] text-gray-600" />
                  <ChevronDown className="h-[18px] w-[18px] text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ của tôi</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}