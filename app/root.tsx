import { useEffect } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Route } from './+types/root'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '~/components/ui/sonner'
import { AuthProvider } from '~/contexts/AuthContext'
import { ChatProvider } from '~/contexts/ChatContext'
import { VideoCallProvider } from '~/contexts/VideoCallContext'
import { NotificationProvider } from '~/contexts/NotificationContext'
import AuthErrorBoundary from '~/components/errors/AuthErrorBoundary'
import { registerServiceWorker } from '~/utils/registerServiceWorker'
import { useNotificationRefetch } from '~/hooks/useNotificationRefetch'
import './app.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      // refetchOnWindowFocus: false, // OLD: Disabled auto refetch
      refetchOnWindowFocus: true, // NEW: Auto refetch khi focus vào window
      refetchOnReconnect: true, // NEW: Auto refetch khi reconnect internet
      refetchInterval: false, // Không poll mặc định (từng query sẽ tự config)
      retry: 1, // Retry 1 lần nếu fail
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
    }
  }
})

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: '/logo.png' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export { HydrateFallback as hydrateFallback } from '~/components/ui'

// Inner component to use hooks after providers are mounted
function AppContent() {
  // 🔄 Smart notification refetch - Khi có notification mới → Auto refetch data liên quan
  useNotificationRefetch()

  return (
    <>
      <Outlet />
      <Toaster richColors={true} position='bottom-right' />
    </>
  )
}

export default function App() {
  // Register service worker for push notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      registerServiceWorker()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <VideoCallProvider>
              <AuthErrorBoundary autoRedirectToLogin loginPath='/login'>
                <ThemeProvider attribute='class' defaultTheme='light' enableSystem storageKey='vite-ui-theme'>
                  <AppContent />
                </ThemeProvider>
              </AuthErrorBoundary>
            </VideoCallProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? 'Comming Soon' : 'Error'
    details = error.status === 404 ? 'Tính năng sẽ ra mắt sau!' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
