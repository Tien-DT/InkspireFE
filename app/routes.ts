import { type RouteConfig, route, layout, index } from '@react-router/dev/routes'

export default [
  layout('./layouts/MainLayout/MainLayout.tsx', [
    // Index route
    index('./routes/home.tsx'),

    // Public routes
    route('about', './routes/about.tsx'),
    route('jobs-freelancer', './routes/jobs-freelancer.tsx'),
    route('search-freelancer', './routes/search-freelancer.tsx'),

    // Protected routes
    layout('./layouts/ProtectedLayout/ProtectedLayout.tsx', [
      route('profile', './routes/profile.tsx'),
      route('dashboard-freelancer', './routes/dashboard-freelancer.tsx'),
      route('post-project', './routes/post-project.tsx'),
      route('post-new-project', './routes/post-new-project.tsx'),
      route('post-project-confirm', './routes/post-project-confirm.tsx'),
      route('manage-projects', './routes/manage-projects.tsx'),
      route('project-detail/:projectId', './routes/project-detail.tsx'),
      route('manage-post-project', './routes/manage-post-project-new.tsx'),
      route('manage-applications', './routes/manage-applications-new.tsx'),
      route('payment', './routes/payment.tsx'),
      route('chat', './routes/chat.tsx'),
      route('banking-qr', './routes/banking-qr.tsx'),
      route('manage-jobs', './routes/manage-jobs.tsx'),
      route('post-recruitment', './routes/post-recruitment.tsx')
    ])
  ]),

  // Admin routes
  layout('./layouts/AdminLayout/AdminLayout.tsx', [
    route('admin', './routes/admin/admin-home-page.tsx'),
    route('admin/transactions', './routes/admin/transactions/transactions-page.tsx'),
    route('admin/projects', './routes/admin/projects/projects-page.tsx'),
    route('admin/users', './routes/admin/users/users-page.tsx')
  ]),

  // Auth routes
  layout('./layouts/auth-layout.tsx', [
    route('login', './routes/login/login-page.tsx'),
    route('register', './routes/register/register-page.tsx')
  ]),

  // Auth flow routes (outside MainLayout)
  route('logout', './routes/logout.tsx'),
  route('relogin', './routes/relogin.tsx'),
  route('auth/google', './routes/auth/google.tsx')
] satisfies RouteConfig
