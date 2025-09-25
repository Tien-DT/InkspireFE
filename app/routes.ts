// app/routes.ts
import { type RouteConfig, route, layout, index } from '@react-router/dev/routes'

export default [
  layout('./layouts/MainLayout/MainLayout.tsx', [
    // Index route tại "/"
    index('./routes/home.tsx'),

    // Child route "/about"
    route('about', './routes/about.tsx'),
    route('dashboard-freelancer', './routes/dashboard-freelancer.tsx')
  ])
] satisfies RouteConfig
