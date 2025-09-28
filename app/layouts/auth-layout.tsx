import { Outlet, useMatches } from 'react-router'
import { IconLayoutGrid } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { JobsShowcase } from '~/components/showcase/jobs-showcase'
import { cn } from '~/utils/cn'

type AuthLayoutProps = {
  children: ReactNode
  rightPanel?: ReactNode
  className?: string
}

export type AuthPanelHandle = {
  panelClassName?: string
  contentClassName?: string
  footer?: ReactNode
  brandHref?: string
  rightPanel?: ReactNode
}

type AuthPanelProps = {
  children: ReactNode
  footer?: ReactNode
  className?: string
  contentClassName?: string
  brandHref?: string
}

export function AuthLayout({ children, rightPanel = <JobsShowcase />, className }: AuthLayoutProps) {
  return (
    <div className={cn('grid min-h-screen grid-cols-1 lg:min-h-[100svh] lg:grid-cols-2', className)}>
      {children}
      {rightPanel}
    </div>
  )
}

export function AuthPanel({ children, footer, className, contentClassName, brandHref = '#' }: AuthPanelProps) {
  return (
    <div className={cn('flex flex-col gap-6 p-6 md:p-10 lg:px-12', className)}>
      <div className='flex justify-center gap-2 md:justify-start'>
        <a href={brandHref} className='flex items-center gap-2 font-medium text-slate-900'>
          <div className='flex size-6 items-center justify-center rounded-md bg-emerald-500 text-white'>
            <IconLayoutGrid className='size-4' />
          </div>
          Inkspire
        </a>
      </div>
      <div className='flex flex-1 items-center justify-center'>
        <div className={cn('w-full max-w-md space-y-8', contentClassName)}>{children}</div>
      </div>
      {footer ? footer : null}
    </div>
  )
}

type AuthHandleCarrier = {
  authPanel?: AuthPanelHandle
}

function findPanelHandle(matches: ReturnType<typeof useMatches>): AuthPanelHandle | undefined {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = (matches[index]?.handle as AuthHandleCarrier | undefined)?.authPanel
    if (handle) return handle
  }

  return undefined
}

export function AuthLayoutRoute() {
  const matches = useMatches()
  const [activeHandle, setActiveHandle] = useState<AuthPanelHandle | undefined>(() => findPanelHandle(matches))

  useEffect(() => {
    const nextHandle = findPanelHandle(matches)
    if (nextHandle && nextHandle !== activeHandle) {
      setActiveHandle(nextHandle)
    }
  }, [matches, activeHandle])

  return (
    <AuthLayout rightPanel={activeHandle?.rightPanel}>
      <AuthPanel
        className={activeHandle?.panelClassName}
        contentClassName={activeHandle?.contentClassName}
        footer={activeHandle?.footer}
        brandHref={activeHandle?.brandHref}
      >
        <Outlet />
      </AuthPanel>
    </AuthLayout>
  )
}

export default AuthLayoutRoute
