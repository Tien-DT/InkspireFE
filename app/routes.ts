import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('about', 'routes/about.tsx'),
  route('login', 'routes/login/login-page.tsx'),
  route('register', 'routes/register/register-page.tsx'),
  route('auth/google', 'routes/auth/google.tsx'),
  route('relogin', 'routes/relogin.tsx'),
  route('logout', 'routes/logout.tsx')
] satisfies RouteConfig
