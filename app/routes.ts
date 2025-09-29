// app/routes.ts
import { type RouteConfig, route, layout, index } from '@react-router/dev/routes'

export default [
  // Main layout - cho tất cả trang công khai và được bảo vệ
  layout('./layouts/MainLayout/MainLayout.tsx', [
    // Homepage
    index('./routes/home.tsx'),

    // Public pages
    route('about', './routes/about.tsx'),
    route('jobs-freelancer', './routes/jobs-freelancer.tsx'),
    route('search-freelancer', './routes/search-freelancer.tsx'),

    // Client pages (protected)
    route('post-project', './routes/post-project.tsx'),
    route('post-new-project', './routes/post-new-project.tsx'),
    route('manage-project', './routes/manage-project.tsx'),
    route('payment', './routes/payment.tsx'),
    route('client-feedback', './routes/client-feedback.tsx'),
    
    // Freelancer pages (protected)
    route('dashboard-freelancer', './routes/dashboard-freelancer.tsx'),
    route('freelancer-dashboard', './routes/freelancer-dashboard.tsx'),
    route('freelancer-profile', './routes/freelancer-profile.tsx'),
    route('freelancer-projects', './routes/freelancer-projects.tsx'),
    
    // Common features
    route('chat', './routes/chat.tsx'),
    route('banking-qr', './routes/banking-qr.tsx')
  ]),
  
  // Admin routes - with AdminLayout including sidebar
  layout('./layouts/AdminLayout/AdminLayout.tsx', [
    route('admin', './routes/admin-dashboard.tsx'),
    route('admin/users', './routes/admin-users.tsx'),
    route('admin/projects', './routes/admin-projects.tsx'),
    route('admin/transactions', './routes/admin-transactions.tsx'),
    route('admin/content-moderation', './routes/admin-content-moderation.tsx'),
    route('admin/support-feedback', './routes/admin-support-feedback.tsx'),
    route('admin/system-settings', './routes/admin-system-settings.tsx'),
    route('admin/reports-analytics', './routes/admin-reports-analytics.tsx'),
    route('admin/book-review-creator', './routes/admin-book-review-creator.tsx')
  ]),

  // Authentication routes - separate layout for login/register
  layout('./layouts/auth-layout.tsx', [
    route('login', './routes/login/login-page.tsx'),
    route('register', './routes/register/register-page.tsx')
  ]),
  
  // Utility routes
  route('logout', './routes/logout.tsx'),
  route('relogin', './routes/relogin.tsx')
] satisfies RouteConfig
