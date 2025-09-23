import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('', 'routes/auth/layout.tsx', [
    route('login', 'routes/login/login-page.tsx'),
    route('register', 'routes/register/register-page.tsx')
  ])
] satisfies RouteConfig
