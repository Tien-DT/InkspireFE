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
    route('freelancer-projects', './routes/freelancer-projects.tsx'),
    
    // Client feedback system
    route('client-feedback', './routes/client-feedback.tsx')
  ]),
  
  // Admin routes
  route('admin', './routes/admin-dashboard.tsx'),
  route('admin/users', './routes/admin-users.tsx'),
  route('admin/projects', './routes/admin-projects.tsx'),
  route('admin/transactions', './routes/admin-transactions.tsx'),
  route('admin/content-moderation', './routes/admin-content-moderation.tsx'),
  route('admin/support-feedback', './routes/admin-support-feedback.tsx'),
  route('admin/system-settings', './routes/admin-system-settings.tsx'),
  route('admin/reports-analytics', './routes/admin-reports-analytics.tsx'),
  route('admin/book-review-creator', './routes/admin-book-review-creator.tsx'),

  // Auth routes
  layout('./layouts/auth-layout.tsx', [
    route('login', './routes/login/login-page.tsx'),
    route('register', './routes/register/register-page.tsx')
  ])
] satisfies RouteConfig
