import { Suspense } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Route } from './+types/root'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '~/components/ui/sonner'
import { AuthProvider } from '~/contexts/AuthContext'
import { ChatProvider } from '~/contexts/ChatContext'
import { VideoCallProvider } from '~/contexts/VideoCallContext'
import AuthErrorBoundary from '~/components/errors/AuthErrorBoundary'
import PersistLogin from '~/components/PersistLogin'
import './app.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false
    }
  }
})

export const links: Route.LinksFunction = () => [
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <VideoCallProvider>
            <AuthErrorBoundary autoRedirectToLogin loginPath='/login'>
              <PersistLogin>
                <ThemeProvider attribute='class' defaultTheme='light' enableSystem storageKey='vite-ui-theme'>
                  <Suspense
                    fallback={
                      <div className='min-h-screen bg-background animate-pulse'>
                        <div className='container mx-auto px-4 py-8'>
                          <div className='h-8 w-[250px] bg-muted rounded mb-4' />
                          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <div key={i} className='p-4 rounded-lg border bg-card'>
                                <div className='h-4 w-3/4 bg-muted rounded mb-2' />
                                <div className='h-4 w-1/2 bg-muted rounded mb-4' />
                                <div className='space-y-2'>
                                  <div className='h-4 w-full bg-muted rounded' />
                                  <div className='h-4 w-5/6 bg-muted rounded' />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <Outlet />
                  </Suspense>
                  <Toaster />
                </ThemeProvider>
              </PersistLogin>
            </AuthErrorBoundary>
          </VideoCallProvider>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
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
