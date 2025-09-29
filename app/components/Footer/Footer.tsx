import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router'
import logo from '~/assets/logo.svg'
import { cn } from '~/utils/cn'

type FooterSection = {
  title: string
  items: { label: string; to: string }[]
}

const sections: FooterSection[] = [
  {
    title: 'Dành cho',
    items: [
      { label: 'Freelancer', to: '/dashboard-freelancer' },
      { label: 'Khách hàng', to: '/post-project' },
      { label: 'Tìm freelancer', to: '/search-freelancer' }
    ]
  },
  {
    title: 'Dịch vụ',
    items: [
      { label: 'Tìm việc làm', to: '/jobs-freelancer' },
      { label: 'Đăng dự án', to: '/post-project' },
      { label: 'Quản lý dự án', to: '/manage-project' },
      { label: 'Thanh toán', to: '/payment' }
    ]
  },
  {
    title: 'Hỗ trợ',
    items: [
      { label: 'Về chúng tôi', to: '/about' },
      { label: 'Chat hỗ trợ', to: '/chat' },
      { label: 'QR Banking', to: '/banking-qr' },
      { label: 'Phản hồi', to: '/client-feedback' }
    ]
  }
]

const linkClasses = 'text-black hover:text-gray-700 transition-colors'
const colTitleClasses = 'text-black font-semibold mb-4'

const socials = [
  { label: 'Facebook', to: '/', icon: <Facebook /> },
  { label: 'Instagram', to: '/', icon: <Instagram /> },
  { label: 'LinkedIn', to: '/', icon: <Linkedin /> }
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className='bg-white text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand / Intro */}
          <div className='flex flex-col gap-3'>
            <Link to='/'>
              <img src={logo} alt='Logo' className='h-12 w-auto md:h-14 object-fill' />
            </Link>
            <div>
              <p className='text-gray-400 text-sm'>Email: inkspire@gmail.com</p>
              <p className='text-gray-400 text-sm'>Hotline: 0968 491 340</p>
            </div>
            <div className='flex gap-4 mt-4 md:mt-0'>
              {socials.map((s) => (
                <Link key={s.label} to={s.to} className={linkClasses} aria-label={s.label}>
                  <span aria-hidden='true'>{s.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Columns generated from config */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className={colTitleClasses}>{section.title}</h3>
              <ul className='space-y-2 text-sm'>
                {section.items.map((it) => (
                  <li key={it.to}>
                    <Link to={it.to} className={cn(linkClasses, 'text-gray-400')}>
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className='border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between'>
          <p className='text-gray-400 text-sm'>© {year} INKSPIRE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
