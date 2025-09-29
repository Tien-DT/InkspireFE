// app/routes.ts
import { type RouteConfig, route, layout, index } from '@react-router/dev/routes'

export default [
  layout('./layouts/MainLayout/MainLayout.tsx', [
    // Index route tại "/"
    index('./routes/home.tsx'),

    // Public pages
    route('about', './routes/about.tsx'),
    route('jobs-freelancer', './routes/jobs-freelancer.tsx'),
    route('search-freelancer', './routes/search-freelancer.tsx'),

    // Protected pages (yêu cầu đăng nhập)
    // layout('./layouts/ProtectedLayout.tsx', [
    route('dashboard-freelancer', './routes/dashboard-freelancer.tsx'),
    route('post-project', './routes/post-project.tsx'),
    route('post-new-project', './routes/post-new-project.tsx'),
    route('manage-project', './routes/manage-project.tsx'),
    route('payment', './routes/payment.tsx'),
    route('chat', './routes/chat.tsx'),
    route('banking-qr', './routes/banking-qr.tsx'),
    
    // Freelancer specific routes
    route('freelancer-dashboard', './routes/freelancer-dashboard.tsx'),
    route('freelancer-profile', './routes/freelancer-profile.tsx'),
    route('freelancer-projects', './routes/freelancer-projects.tsx')
    // ])
  ]),
  
  // Admin routes with AdminLayout
  layout('./components/admin/AdminLayout.tsx', [
    route('admin', './routes/admin-dashboard.tsx'),
    route('admin/users', './routes/admin-users.tsx'),
    route('admin/projects', './routes/admin-projects.tsx')
  ]),

  layout('./layouts/auth-layout.tsx', [
    route('login', './routes/login/login-page.tsx'),
    route('register', './routes/register/register-page.tsx')
  ])
] satisfies RouteConfig
