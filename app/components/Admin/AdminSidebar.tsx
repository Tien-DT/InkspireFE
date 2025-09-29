import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  Shield, 
  TrendingUp,
  Wallet,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface SidebarItem {
  title: string
  icon: React.ReactNode
  href: string
  badge?: string | number
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Tổng quan',
    icon: <Home className="h-5 w-5" />,
    href: '/admin-dashboard'
  },
  {
    title: 'Quản lý người dùng',
    icon: <Users className="h-5 w-5" />,
    href: '/admin-users',
    badge: '47'
  },
  {
    title: 'Quản lý dự án',
    icon: <FileText className="h-5 w-5" />,
    href: '/admin-projects',
    badge: '23'
  },
  {
    title: 'Báo cáo & Thống kê',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/admin-reports'
  },
  {
    title: 'Tài chính',
    icon: <Wallet className="h-5 w-5" />,
    href: '/admin-finance'
  },
  {
    title: 'Tin nhắn & Hỗ trợ',
    icon: <MessageSquare className="h-5 w-5" />,
    href: '/admin-messages',
    badge: '12'
  },
  {
    title: 'Bảo mật',
    icon: <Shield className="h-5 w-5" />,
    href: '/admin-security'
  },
  {
    title: 'Cài đặt',
    icon: <Settings className="h-5 w-5" />,
    href: '/admin-settings'
  }
]

interface AdminSidebarProps {
  className?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function AdminSidebar({ 
  className, 
  collapsed = false,
  onToggleCollapse 
}: AdminSidebarProps) {
  const location = useLocation()

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">InkSpire</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={cn("h-8 w-8 p-0", collapsed && "hidden")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-100 text-blue-700 border border-blue-200" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
            >
              <span className="flex-shrink-0">
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      isActive 
                        ? "bg-blue-200 text-blue-800" 
                        : "bg-red-100 text-red-800"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Button for collapsed state */}
      {collapsed && onToggleCollapse && (
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 mx-auto"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@inkspire.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}