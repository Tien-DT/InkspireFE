// app/routes.ts
import { type RouteConfig, route, layout, index } from '@react-router/dev/routes'

export default [
  layout('./layouts/MainLayout/MainLayout.tsx', [
    // Index route tại "/"
    index('./routes/home.tsx'),

    // Child route "/about"
    route('about', './routes/about.tsx'),
    route('dashboard-freelancer', './routes/dashboard-freelancer.tsx'),
    route('post-project', './routes/post-project.tsx'),
    route('jobs-freelancer', './routes/jobs-freelancer.tsx'),
    route('search-freelancer', './routes/search-freelancer.tsx'),
    route('manage-project', './routes/manage-project.tsx'),
    route('payment', './routes/payment.tsx'),
    route('chat', './routes/chat.tsx'),
    route('banking-qr', './routes/banking-qr.tsx'),
    route('post-new-project', './routes/post-new-project.tsx')
  ])
] satisfies RouteConfig
