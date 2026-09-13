# CULTx

**CULTx** is an agricultural operating platform for growers, cooperatives, buyers, agribusinesses, logistics providers, finance teams, researchers, and public-sector users. The platform combines authenticated operational workspaces, farm intelligence, commercial workflows, and advisory services in a responsive web application.

> CULTx starts with an intentionally empty workspace. It does **not** seed farms, inventory, telemetry, listings, contracts, crop diagnoses, notifications, or generated advice. Each signed-in user works only with data associated with their own account.

## Capabilities

| Area | Capabilities |
| --- | --- |
| Identity and access | Supabase email/password registration and sign-in, persisted sessions, profile roles, and backend bearer-token validation. |
| Operational data | User-owned farms, market listings, contracts, documents, sensor records, recommendations, commodity prices, and notifications persisted to Supabase. |
| Realtime | User-scoped notification inserts are delivered through Supabase Realtime without a page refresh. |
| Agricultural workflows | Farm dashboards, digital twins, precision agriculture, soil telemetry, irrigation controls, climate, document, marketplace, finance, logistics, trade, cooperative, agribusiness, and government views. |
| Advisory routes | Authenticated server routes for the copilot, crop diagnostics, contract audits, policy simulations, forecasts, and compliance reports. Unavailable AI services return an explicit error instead of fabricated results. |

## Architecture

```text
React + Vite client
  ├─ Supabase Auth (email/password sessions)
  ├─ Supabase PostgREST (profiles, workspaces, notifications)
  ├─ Supabase Realtime (user notification inserts)
  └─ Express API (authenticated Gemini service routes)
       └─ Supabase Auth validation + profile-role authorization
```

### Supabase data model

The migration in `supabase/migrations/20260913000000_cultx_auth_and_realtime.sql` creates:

- `public.profiles`: one role-bearing profile per `auth.users` account.
- `public.workspaces`: a JSONB operational workspace per user, synchronized by the frontend.
- `public.notifications`: user-scoped notification records published through Supabase Realtime.

Row Level Security is enabled on every table. A user may access only records whose user identifier equals `auth.uid()`.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Motion, D3, and Recharts.
- **Backend:** Express and TypeScript.
- **Identity, database, realtime:** Supabase Auth, Postgres, PostgREST, and Realtime.
- **Optional advisory provider:** Google Gemini via `@google/genai`.

## Getting started

### Prerequisites

- Node.js 22 or later.
- npm 10 or later.
- Access to the CULTx Supabase project.
- A Gemini API key if AI service routes should be enabled.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy the example file:

```bash
cp .env.example .env
```

Set the required browser variables:

```dotenv
VITE_SUPABASE_URL="https://anityrvwhyocvnvyxmqp.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
```

Set this optional server variable when enabling AI routes:

```dotenv
GEMINI_API_KEY="your_gemini_api_key"
```

The Supabase publishable key is safe for browser use. **Never** place a Supabase `service_role` key in a Vite environment variable or client-side file; RLS policies are the data-protection boundary for browser access.

### 3. Apply the Supabase migration

Apply `supabase/migrations/20260913000000_cultx_auth_and_realtime.sql` to the target Supabase project with the Supabase CLI, dashboard SQL editor, or your approved migration pipeline before registering users or storing operational data.

The migration creates the data tables and RLS policies, provisions a default `farmer` profile for every new Supabase user, and adds notifications to the Realtime publication.

### 4. Run locally

```bash
npm run dev
```

The development server listens on `http://localhost:3000` by default.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Express/Vite development server. |
| `npm run lint` | Run TypeScript type checks without emitting files. |
| `npm run build` | Build the Vite client and bundle the Express server in `dist/`. |
| `npm start` | Run the production server after a successful build. |
| `npm run preview` | Serve the Vite client build locally. |
| `npm run clean` | Remove build output. |

## Authentication and authorization

1. The client signs users in directly with Supabase Auth and retains the Supabase session locally.
2. API calls attach the active access token as `Authorization: Bearer <token>`.
3. Express validates the token through Supabase Auth, obtains the profile role, and applies route-level role checks.
4. Workspace and notification requests go directly to Supabase under the user's JWT, where RLS applies a second authorization boundary.

Supported roles are `farmer`, `cooperative`, `buyer`, `agribusiness`, `logistics`, `finance`, `government`, `researcher`, `input_supplier`, and `superadmin`. New users receive `farmer`; privileged roles must only be assigned through a verified, audited administrative process.

## Realtime notifications

The client opens a Supabase Realtime channel filtered to the current user's notifications. Insert a row into `public.notifications` with a recipient's UUID to deliver it to that user. RLS prevents recipients from reading other users' notifications.

## AI service behavior

Gemini-powered routes require an authenticated user and `GEMINI_API_KEY` on the server. CULTx does not substitute hard-coded advisory, diagnostic, forecast, policy, audit, or compliance content if Gemini fails. The API returns HTTP `503` with the `AI_UNAVAILABLE` error code, and the client shows the failure transparently.

## Production checklist

- Apply the Supabase migration through a reviewed deployment process.
- Configure Supabase Auth redirect URLs and allowed origins for the production domain.
- Configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `GEMINI_API_KEY` in the deployment secret manager.
- Keep any Supabase service-role key exclusively in server-side secret storage.
- Restrict privileged role changes to an audited administrator workflow.
- Enable monitoring, dependency scanning, backups, incident response, and the controls in [`docs/production-runbook.md`](docs/production-runbook.md).
- Run `npm run lint` and `npm run build` in CI before deploying.

## Repository layout

```text
src/                         React application and feature views
src/context/AppContext.tsx   Authenticated workspace state and synchronization
src/lib/supabase.ts          Supabase Auth, database, and Realtime client adapter
server.ts                    Express API and Gemini endpoints
server/auth.ts               Supabase token validation and role middleware
supabase/migrations/         Database schema, RLS, trigger, and Realtime setup
docs/                        Operational documentation
```

## Responsible use

CULTx provides operational decision support and workflow tooling. Agricultural diagnostics, market guidance, forecasts, legal assessments, and policy outputs should be reviewed by appropriately qualified local professionals before being used as the sole basis for agronomic, commercial, legal, financial, or public-policy decisions.
