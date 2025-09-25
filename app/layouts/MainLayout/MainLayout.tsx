import React, { memo } from 'react'
import { Outlet } from 'react-router'
import Footer from '~/components/Footer'
import Header from '~/components/Header'

interface MainLayoutProps {
  children?: React.ReactNode
}

function MainLayoutInner({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

const MainLayout = memo(MainLayoutInner)
export default MainLayout
