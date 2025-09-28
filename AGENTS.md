# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts route modules, UI primitives, contexts, and shared logic; `app/routes/*` mirrors URL segments like `login/login-page.tsx`.
- Reuse `app/components/ui` patterns before creating new markup; store helper logic in `app/lib` or `app/utils`.
- Keep enums and constants in `app/constants`; static files live in `public/`.
- The root configs (`react-router.config.ts`, `tsconfig.json`, `vite.config.ts`) drive routing, path aliases (`~/*`), and build output; edit them in sync.

## Build, Test, and Development Commands
- `npm run dev`: React Router dev server with HMR.
- `npm run build`: generates server/client bundles in `build/`.
- `npm run start`: serves the production build via `react-router-serve`.
- `npm run start:csr`: Vite preview for client-only debugging.
- `npm run typecheck`: regenerates route types then runs `tsc`.
- `npm run lint` / `npm run prettier`: static analysis and formatting; add `:fix` or `:write` for autofix.

## Coding Style & Naming Conventions
- Prettier enforces 2-space indents, single quotes, no semicolons, 120-character width; run `npm run prettier:fix` before pushing.
- Name components/hooks in PascalCase, hooks prefixed with `use`, utilities in camelCase, constants in UPPER_SNAKE_CASE.
- Colocate loaders/actions in `<route>/data.ts`; export page components from `<route>-page.tsx`.
- Prefer the `~` alias for app imports to avoid deep relatives.

## Testing Guidelines
- No automated tests yet; when adding coverage, prefer Vitest with React Testing Library in `app/__tests__` or adjacent `*.test.tsx`.
- Until then, rely on `npm run typecheck`, `npm run lint`, and manual QA of affected flows.
- Document new test scripts in `package.json` and amend this guide when tooling lands.

## Commit & Pull Request Guidelines
- Write imperative, scope-tagged commits (`feat: add auth flow`); squash fixups before review.
- PRs should summarise changes, list touched routes, and include UI screenshots or recordings.
- Reference linked work items in the PR body and tick off lint/typecheck results.
- Share repro steps or preview URLs for reviewers and call out follow-up tasks explicitly.
