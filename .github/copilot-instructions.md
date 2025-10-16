# Inkspire Frontend - AI Agent Guide

Vietnamese freelance marketplace built with React Router v7 (CSR mode), TypeScript, TanStack Query, SignalR real-time messaging, and shadcn/ui.

## Architecture Overview

### Routing & Layouts (React Router v7)

React Router v7 in **CSR mode** (`ssr: false` in `react-router.config.ts`). Routes defined in `app/routes.ts` with nested layout pattern:

```typescript
// app/routes.ts structure
layout('./layouts/MainLayout/MainLayout.tsx', [
  index('./routes/home.tsx'),
  layout('./layouts/ProtectedLayout/ProtectedLayout.tsx', [
    route('profile', './routes/profile.tsx')
    // Protected routes...
  ])
])
```

**Layout Hierarchy**:

- `MainLayout`: Public header/footer wrapper for all top-level routes
- `ProtectedLayout`: Auth gate—waits for `authReady` flag, redirects to `/login` if unauthenticated (pass `from` URL param for post-login redirect)
- `AdminLayout`: Admin sidebar nav; update `NAV_ITEMS` array when adding admin routes
- `AuthLayout`: Split-panel auth screens (login/register); expose `handle.authPanel` to customize left panel

**Adding Routes Checklist**:

1. Add to `app/routes.ts` under appropriate layout
2. Create route file in `app/routes/<name>.tsx` or `app/routes/<name>/<name>-page.tsx`
3. Update `app/constants/path.ts` PATH constants
4. Update relevant layout nav (MainLayout header, AdminLayout sidebar)

### Authentication & Session Management

**Auth State**: Centralized in `AuthContext` (`app/contexts/AuthContext.tsx`)

- `isAuthenticated`, `profile`, `userName`, `authReady` (loading flag for protected routes)
- Multi-tab sync via `storage` events and custom `LocalStorageEventTarget`
- Always use `app/utils/auth.ts` helpers (`getAccessTokenFromLS`, `setAccessTokenToLS`, `clearAllAuth`) instead of direct `localStorage` access for SSR safety

**Auth Flow**:

1. `PersistLogin.tsx` runs on mount; checks token expiry, calls `authApi.refreshToken(refreshToken)` if expired
2. `app/lib/axios.ts` interceptor auto-refreshes on 401 with **request queueing** to prevent race conditions:
   ```typescript
   // Lock mechanism in axios.ts
   let isRefreshing = false
   let waiters: Array<(token: string) => void> = []
   ```
3. On refresh failure, clears auth and redirects to `/login?from=<currentPath>`

**Session Timeout**: `useSessionManager.ts` tracks activity (mouse, keyboard, scroll); extends timeout on `session:refreshed` or `api:success` custom events; calls `onTimeout` when idle

**Error Boundaries**: Wrap protected routes in `AuthErrorBoundary` (`app/components/errors/AuthErrorBoundary.tsx`) to catch 401/403 errors and auto-redirect to login if `autoRedirectToLogin={true}`

**SSR Safety**: All auth utils check `typeof window !== 'undefined'` before accessing `localStorage`, `document`, or `window`

### HTTP & State Management

**Axios Client** (`app/lib/axios.ts`):

- Base URL from `VITE_API_URL`, JWT Bearer header auto-attached
- Interceptor queues requests during token refresh to prevent duplicate refresh calls
- Retry original request after successful refresh

**API Layer Pattern** (`app/apis/*.api.ts`):

```typescript
// Always export async functions that return response.data
export const userApi = {
  getUserById: async (userId: string): Promise<UserProfileResponse> => {
    const response = await axiosClient.get<UserProfileResponse>(`/api/users/${userId}`)
    return response.data
  }
}
```

**React Query Patterns** (`app/hooks/use*.ts`):

- Scoped query keys: `['projects', userId, role]`, `['user-profile', userId]`
- Use `staleTime`, `enabled`, `retry` consistently
- Invalidate in mutation `onSuccess`:
  ```typescript
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    queryClient.invalidateQueries({ queryKey: ['project'] })
  }
  ```
- Polling pattern: `refetchInterval` with conditional logic (see `useGetComplaint`)

### Real-Time Communication (SignalR)

**SignalR Service** (`app/lib/signalr.ts`):

- Singleton `signalRChatService` connects to `/hubs/chat` with JWT
- Auto-reconnect with exponential backoff (max 5 attempts)
- Registers server event handlers: `MessageCreated`, `UserTyping`, `CallOffer`, etc.

**Chat Context** (`app/contexts/ChatContext.tsx`):

- Wraps app in `root.tsx`; provides `conversations`, `messages`, `sendMessage`, `joinConversation`, etc.
- **Local cache** via `app/utils/chat-storage.ts` (localStorage with SSR guards); sync state across tabs
- Always update both SignalR state and localStorage when modifying `Message` or `Conversation` types

**Video Calls**:

- Same SignalR hub; `VideoCallContext` handles WebRTC (offer/answer/candidate flow, ICE servers)
- Study `app/lib/signalr.ts` call methods before modifying call UI

**Adding Real-Time Features**:

1. Add event handler to `signalRChatService.registerClientHandlers()` in `signalr.ts`
2. Update `ChatContext` or `VideoCallContext` to consume events
3. Update TypeScript types in `app/types/chat.type.ts` or `app/types/call.type.ts`

### Forms & Validation

**Standard Pattern** (Zod + React Hook Form):

```typescript
// 1. Define schema in app/lib/validations/<feature>.schema.ts
export const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' })
})
export type ProfileFormValues = z.infer<typeof profileFormSchema>

// 2. Use in component
const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
  resolver: zodResolver(profileFormSchema)
})

// 3. Consistent error UI
<Input {...register('name')} aria-invalid={!!errors.name} />
{errors.name && <p className='text-sm text-red-600 mt-1'>{errors.name.message}</p>}
```

**Multi-Step Forms**: See `RecruitmentFormContext` for sessionStorage persistence pattern; call `resetForm()` after successful submission

### UI Components & Styling

**Shared Components** (`app/components/shared/`):

- `PageHeader`: Badge + title + description + action button for management pages
- `UnifiedStatsCards`: Stats grid with gradient accents and icons (see `StatsCardConfig` interface)
- `FilterTabs`: Pill-style tabs with count badges
- `LoadingCard` & `LoadingList`: Unified loading components with shimmer effect (see LOADING_SYSTEM.md)

**Loading System** (⭐ NEW - see `LOADING_SYSTEM.md` for full docs):

```tsx
// Use LoadingList for list pages
import { LoadingList } from '~/components/shared'
{
  isLoading && <LoadingList count={5} variant='default' />
}

// Use LoadingCard for single items
import { LoadingCard } from '~/components/shared'
{
  isLoading && <LoadingCard variant='default' />
}

// Variants: 'compact' | 'default' | 'detailed'
// - compact: Simple list items, notifications
// - default: Job/project cards (most common)
// - detailed: Profile/showcase cards
```

**Spinner System** (⭐ NEW - see `SPINNER_SYSTEM.md` for infinite loading):

```tsx
// Page loading với gradient spinner (recommended)
import { LoadingState } from '~/components/ui/spinner'
{isLoading && <LoadingState message='Đang tải...' size='lg' variant='gradient' />}

// Full page overlay
import { LoadingOverlay } from '~/components/ui/spinner'
{isProcessing && <LoadingOverlay message='Đang xử lý...' />}

// Inline spinner
import { Spinner } from '~/components/ui/spinner'
<Spinner size='md' variant='gradient' />

// Button loading (tích hợp sẵn)
<Button isLoading={isSubmitting}>Gửi</Button>
```

**Base Skeleton** (`app/components/ui/skeleton.tsx`):

- Shimmer animation (2s infinite)
- Dark mode responsive (`bg-muted/50`)
- Gradient shimmer: `white/60` (light), `white/10` (dark)

**Specific Skeletons** (`app/components/skeletons/`):

- All refactored to use shared `LoadingCard`
- Available: JobCardSkeleton, ProjectCardSkeleton, ApplicationCardSkeleton, RecruitmentPostSkeleton
- Use `*ListSkeleton` exports for multiple items

**Management Page Layout Pattern**:

```tsx
<main className='min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-10'>
  <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 md:px-6 lg:px-10'>
    <section className='rounded-3xl border border-border/40 bg-card/95 p-6 shadow-md backdrop-blur-sm md:p-10'>
      <PageHeader badge='...' title='...' description='...' actionLabel='...' actionHref={PATH.x} />
      <div className='mt-8 space-y-6'>
        <UnifiedStatsCards cards={statsCards} isLoading={isLoading} />
        <FilterTabs options={filterOptions} activeFilter={filter} onFilterChange={setFilter} />
      </div>
    </section>
    <section className='rounded-3xl border border-border/40 bg-card/95 p-6 shadow-md md:p-8'>{/* Content */}</section>
  </div>
</main>
```

**Design Tokens**:

- Container: `max-w-[1200px] mx-auto`
- Border radius: `rounded-3xl` (sections), `rounded-2xl` (cards), `rounded-full` (buttons)
- Spacing: `gap-8` (sections), `gap-6` (internal), `p-6 md:p-10` (header), `p-6 md:p-8` (content)
- Typography: `text-3xl md:text-4xl` (page titles), `text-xl` (card titles), `text-xs uppercase tracking-wide text-muted-foreground` (labels)

**Theming**: `next-themes` in `root.tsx` for dark mode; tokens in `app/app.css` and Tailwind config

**UI Library**: shadcn/ui components only (`app/components/ui/`); use `cn()` helper for conditional classes; **no MUI, Ant Design, or other libraries**

**Vietnamese UI**: All user-facing text in Vietnamese; match existing copy in components and error messages

### Environment & Configuration

**Required Env Vars** (`.env`):

- `VITE_API_URL`: Backend API base URL
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`: Google OAuth

**Path Alias**: `~/*` resolves to `app/*` (configured in `tsconfig.json`, `vite.config.ts`)

**Firebase**: Google OAuth provider in `app/lib/firebase.ts`; adjust provider params there (e.g., `prompt: 'select_account'`)

## Development Workflows

### Running & Building

- `npm run dev`: React Router dev server at `http://localhost:5173` (Vite default)
- `npm run build`: Generates `build/client/` (static assets) and `build/server/` (unused in CSR mode)
- `npm run start`: Production server via `react-router-serve`
- `npm run start:csr`: Vite preview for client-only debugging

### Code Quality

- `npm run typecheck`: Runs `react-router typegen` + `tsc` for type safety
- `npm run lint` / `npm run lint:fix`: ESLint (React hooks, refresh rules)
- `npm run prettier` / `npm run prettier:fix`: 2-space indent, single quotes, no semicolons, 120-char width

### Pre-Deployment

- `npm run verify-deploy`: Runs `verify-deployment.mjs` to check package.json, build output, optional dependencies
- Deployment: Vercel (`vercel.json` config); outputs to `build/client/`; SSR disabled in `react-router.config.ts`

### Adding Features Checklist

**New Route**:

1. Add to `app/routes.ts` under appropriate layout
2. Create `app/routes/<name>/<name>-page.tsx`
3. Update `app/constants/path.ts` PATH constants
4. Add to layout nav (MainLayout header, AdminLayout sidebar)

**New API**:

1. Create `app/apis/<domain>.api.ts` with typed async functions
2. Define response/request types in `app/types/<domain>.type.ts`
3. Wire to React Query hook in `app/hooks/use<Domain>.ts`
4. Follow naming: `queryKey: ['<domain>', <id>, <param>]`, invalidate on mutations

**New Protected Route**:

1. Nest under `ProtectedLayout` in `app/routes.ts`
2. Wrap in `AuthErrorBoundary` if handling sensitive auth errors

**New Form**:

1. Define Zod schema in `app/lib/validations/<feature>.schema.ts`
2. Use `react-hook-form` + `zodResolver`
3. Apply consistent error UI pattern (see Forms & Validation above)

**New Real-Time Feature**:

1. Add event handler to `signalRChatService.registerClientHandlers()` in `signalr.ts`
2. Update `ChatContext` or `VideoCallContext` to consume events
3. Update types in `app/types/chat.type.ts` or `app/types/call.type.ts`

## Project-Specific Conventions

**Naming**:

- Components: PascalCase (`ProfileHeader`, `PageHeader`)
- Hooks: `use` prefix (`useProjects`, `useAuth`)
- Types: PascalCase interfaces (`User`, `Message`, `StatsCardConfig`)
- Constants: UPPER_SNAKE_CASE (`PATH`, `AUTH_CHANGE_EVENT`)
- Utilities: camelCase (`getAccessTokenFromLS`, `cn`)

**File Structure**:

- Route components: `app/routes/<name>/<name>-page.tsx`
- Loaders/actions: `app/routes/<name>/data.ts` (if needed)
- Use `~` alias for app imports to avoid deep relatives

**TypeScript**:

- Strict types everywhere; no `any` (use `unknown` if needed)
- Define interfaces in `app/types/*.type.ts`
- Add enums for status/role constants (see `app/types/user.type.ts` for `UserRole`, `UserStatus`)

**SSR Safety**:

- Always check `typeof window !== 'undefined'` before accessing `localStorage`, `document`, `window` in contexts/utilities
- Use guards in `app/utils/auth.ts`, `app/utils/chat-storage.ts` as reference

**Event-Driven Sync**:

- Custom events for cross-tab state sync: `session:refreshed`, `api:success`, `auth:logout`
- Listen to `storage` events in contexts for multi-tab auth state

**Testing**:

- No automated tests yet; rely on `npm run typecheck`, `npm run lint`, manual QA
- When adding tests: use Vitest + React Testing Library in `app/__tests__` or adjacent `*.test.tsx`

## Key Files Reference

**Core Architecture**:

- `app/root.tsx`: App shell with QueryClient, AuthProvider, ChatProvider, VideoCallProvider, ThemeProvider
- `app/routes.ts`: Route definitions with nested layouts
- `react-router.config.ts`: CSR mode (`ssr: false`), Vercel preset

**Auth & HTTP**:

- `app/lib/axios.ts`: HTTP client with 401 refresh queue and lock mechanism
- `app/contexts/AuthContext.tsx`: Auth state management with multi-tab sync
- `app/utils/auth.ts`: Token storage helpers (SSR-safe), JWT parsing
- `app/components/PersistLogin.tsx`: Silent refresh on mount

**State Management**:

- `app/hooks/useProjects.ts`: React Query pattern reference (scoped keys, invalidation)
- `app/hooks/useAuth.ts`: Auth mutations (login, register, logout)

**Real-Time**:

- `app/lib/signalr.ts`: SignalR client for chat and video calls
- `app/contexts/ChatContext.tsx`: Chat state, message handling, local cache
- `app/utils/chat-storage.ts`: localStorage cache with SSR guards

**UI Patterns**:

- `app/components/shared/`: PageHeader, UnifiedStatsCards, FilterTabs (management page building blocks)
- `app/lib/validations/`: Zod schemas for forms
- `app/components/ui/`: shadcn/ui primitives

**Documentation**:

- `AUTH_FLOW_REPORT.md`: Detailed auth flow analysis and security checklist
- `CODE_QUALITY_AUDIT.md`: TypeScript, naming, validation, error boundary standards
- `UI_UNIFICATION_REPORT.md`: Shared component patterns, design tokens, layout structure
- `AGENTS.md`: Repository-wide coding conventions and guidelines
