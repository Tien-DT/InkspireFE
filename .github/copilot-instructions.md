# Inkspire Frontend - AI Agent Guide

A Vietnamese freelance marketplace built with React Router v7 (SSR), TypeScript, TanStack Query, SignalR real-time messaging, and shadcn/ui.

## Architecture Overview

### Routing & Layouts (React Router v7)

- **Routes**: `app/routes.ts` defines all pages with nested layouts; each route is a `*.tsx` file in `app/routes/`
- **Layouts**: Wrap routes for shared UI patterns
  - `MainLayout`: Public header/footer for unauthenticated pages
  - `ProtectedLayout`: Auth gate that waits for `authReady` flag before rendering; redirects to `/login` via `PATH.login` constant
  - `AdminLayout`: Admin sidebar nav; update `NAV_ITEMS` array when adding admin routes
  - `AuthLayout`: Split-panel auth screens (login/register); expose `handle.authPanel` to customize left panel (see `app/routes/login/login-page.tsx`)
- **Navigation sync**: When adding routes, update `app/routes.ts`, `app/constants/path.ts` PATH constants, and relevant sidebar menus in one go

### Authentication & Session Management

- **Auth flow**: `AuthContext` (`app/contexts/AuthContext.tsx`) manages `isAuthenticated`, `profile`, `userName`, `authReady` state
  - Uses localStorage with cross-tab sync via `storage` events
  - Always call `app/utils/auth.ts` helpers (`getAccessTokenFromLS`, `setAccessTokenToLS`, etc.) instead of direct `localStorage` access
- **Silent refresh**: `PersistLogin.tsx` runs on mount; checks token expiry, calls `authApi.refreshToken(refreshToken)`, updates context
- **Token refresh on 401**: `app/lib/axios.ts` interceptor queues requests during refresh, retries with new token, redirects to login on failure
- **Session timeout**: `useSessionManager.ts` tracks user activity (mouse, keyboard, scroll); extends timeout on `session:refreshed` or `api:success` custom events; fires `onTimeout` callback when idle
- **Auth error handling**: Wrap components in `AuthErrorBoundary` (`app/components/errors/AuthErrorBoundary.tsx`) to catch 401/403 errors; auto-clears tokens and redirects to login if `autoRedirectToLogin={true}`

### HTTP & State Management

- **API client**: `app/lib/axios.ts` Axios instance with `VITE_API_URL` base, JWT Bearer header, 401 refresh logic
- **API modules**: `app/apis/*.api.ts` export async functions that return `response.data`; follow patterns in `auth.api.ts` and `project.api.ts`
- **React Query**: All server state via `@tanstack/react-query`
  - Follow naming in `app/hooks/useProjects.ts`: scoped keys `['projects', userId, role]`, invalidate on mutations
  - Use `staleTime`, `enabled`, `retry` options consistently
  - Invalidate queries in mutation `onSuccess` (e.g., `queryClient.invalidateQueries({ queryKey: ['projects'] })`)

### Real-Time Communication (SignalR)

- **Chat**: `app/lib/signalr.ts` singleton service connects to `/hubs/chat` with JWT; manages message events, typing indicators, online status
  - `ChatContext` (`app/contexts/ChatContext.tsx`) wraps app; provides `conversations`, `messages`, `sendMessage`, `joinConversation`, etc.
  - Local cache in `app/utils/chat-storage.ts` (localStorage with sync); update both when changing `Message` or `Conversation` types
- **Video calls**: Same SignalR hub; `VideoCallContext` handles WebRTC (ICE servers, offer/answer/candidate flow); study before modifying call UI

### Forms & Validation

- **Forms**: `react-hook-form` + `zod` schemas in `app/lib/validations/**` (e.g., `post-project.schema.ts`)
- **UI wrappers**: Use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` from `app/components/ui/form.tsx` for consistent error rendering
- **Multi-step forms**: See `RecruitmentFormContext` for sessionStorage persistence; call `resetForm()` after submission

### UI Components & Styling

### UI Components & Styling

- **Primitives**: shadcn-inspired components in `app/components/ui/`; use `cn()` helper from `app/lib/utils.ts` for conditional classes
- **Feature folders**: Colocate related UI in `app/components/Home/`, `app/components/profile/`, `app/components/manage-project/`, etc.
- **Shared components**: Reusable page-level components in `app/components/shared/` (PageHeader, UnifiedStatsCards, FilterTabs)
  - Use these for consistent layouts across management pages (manage-projects, manage-post-project-new)
  - Stats cards follow gradient accent pattern with icons in top-right corner
  - Filter tabs show count badges and use rounded-full pill style
- **Theming**: `next-themes` in `root.tsx` for dark mode; tokens in `app/app.css` and Tailwind config
- **Toasts**: `toast.success()` / `toast.error()` from Sonner (`~/components/ui/sonner.tsx`)
- **Vietnamese UI**: Match existing Vietnamese copy in components and error messages
- **Layout consistency**: Management pages use same structure: header section with badge/title/description/action button, stats cards grid, filter tabs, content section

### Environment & Configuration

- **Required env vars**: `VITE_API_URL`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- **Path alias**: `~/*` resolves to `app/*` (see `tsconfig.json`, `vite.config.ts`)
- **Firebase**: Google OAuth provider setup in `app/lib/firebase.ts`; adjust provider params there (e.g., `prompt: 'select_account'`)

## Development Workflows

### Running the App

- `npm run dev`: React Router dev server at `http://localhost:3000`
- `npm run build`: Generates `build/client/` (static) and `build/server/` (SSR)
- `npm run start`: Serves production build via `react-router-serve`
- `npm run typecheck`: Runs `react-router typegen` + `tsc` for type safety
- `npm run lint` / `npm run lint:fix`: ESLint checks
- `npm run prettier` / `npm run prettier:fix`: Code formatting (2-space, single quotes, no semicolons, 120-char width)

### Pre-Deployment Checks

- `npm run verify-deploy`: Runs `verify-deployment.mjs` to check package.json, build output, and optional dependencies before Vercel deploy
- Deployment: Vercel reads `vercel.json` for build config; outputs to `build/client/`; SSR is disabled in `react-router.config.ts` (`ssr: false`)

### Adding Features

1. **New route**: Add to `app/routes.ts`, create `app/routes/<name>.tsx`, update `PATH` constants, add to relevant layout nav
2. **New API**: Create `app/apis/<domain>.api.ts`, export typed functions, wire to React Query hook in `app/hooks/use<Domain>.ts`
3. **New protected route**: Nest under `ProtectedLayout` in `app/routes.ts`; component auto-receives auth context
4. **New form**: Define zod schema in `app/lib/validations/`, use `useForm` + shadcn form components
5. **New real-time feature**: Register SignalR handler in `signalRChatService.registerHandlers()`, update `ChatContext` or `VideoCallContext`

## Project-Specific Conventions

- **TypeScript**: Strict types everywhere; define interfaces in `app/types/*.type.ts`; add enums for status/role constants
- **SSR safety**: Always check `typeof window !== 'undefined'` before accessing `localStorage`, `document`, or `window` APIs in contexts/utilities
- **Event-driven sync**: Use custom events (`session:refreshed`, `api:success`, `auth:logout`) to coordinate auth state across tabs and session timeouts
- **Component naming**: PascalCase for components, camelCase for utilities, UPPER_SNAKE_CASE for constants, hooks prefixed with `use`
- **File structure**: Colocate route components (`<route>-page.tsx`), loaders/actions (`data.ts`), and use `~` alias for app imports
- **Testing**: No automated tests yet; rely on `typecheck`, `lint`, and manual QA; when adding tests, use Vitest + React Testing Library

## Key Files to Reference

- `app/root.tsx`: App shell with QueryClient, AuthProvider, ChatProvider, VideoCallProvider, ThemeProvider
- `app/lib/axios.ts`: HTTP client with 401 refresh queue
- `app/contexts/AuthContext.tsx`: Auth state management
- `app/utils/auth.ts`: Token storage helpers, JWT parsing
- `app/hooks/useProjects.ts`: React Query patterns for projects domain
- `app/lib/signalr.ts`: SignalR client for chat and video calls
- `AUTH_FLOW_REPORT.md`, `CODE_QUALITY_AUDIT.md`: Detailed auth flow and quality guidelines
