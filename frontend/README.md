# Jobify — Frontend

A precision instrument for the developer job hunt. Jobify scores every opening
against your real skill set, then helps you run the search like an engineer:
match‑aware browsing, a drag‑and‑drop application pipeline, and a shortlist.

This is the React frontend for the Jobify Go API.

---

## Highlights

- **Skill‑match scoring** — a signature circular gauge on every role, computed
  client‑side with the exact Jaccard formula the Go backend uses, so list and
  detail views stay consistent.
- **Application pipeline** — a drag‑and‑drop Kanban board (`saved → applied →
  interview → offer → closed`) with optimistic status updates.
- **Command palette** — `⌘K` / `Ctrl+K` to jump to any page or role.
- **Dark / light themes** — deep terminal‑grade dark by default, warm light
  mode, switched with no flash of the wrong theme.
- **Crafted states** — skeleton loaders, empty states, error boundaries, a
  themed 404, animated route transitions.
- **Fully responsive** — collapsible sidebar on desktop, drawer navigation on
  mobile.

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | React 18 + TypeScript (strict) + Vite             |
| Styling        | Tailwind CSS v3 + CSS custom‑property design tokens |
| Animation      | Framer Motion                                     |
| Server state   | TanStack Query                                    |
| Client state   | Zustand                                           |
| Routing        | React Router v6 (lazy routes)                     |
| Primitives     | Radix UI, hand‑customised                         |
| Forms          | React Hook Form + Zod                             |
| Drag & drop    | dnd‑kit                                           |
| Charts         | Recharts                                          |
| HTTP           | Axios (auth + refresh interceptors)               |
| Notifications  | Sonner                                            |
| Icons / Fonts  | Lucide · Geist + Geist Mono                       |

## Prerequisites

- **Node.js 18+** and npm
- **The Jobify Go API running on `http://localhost:8080`**, with its Postgres
  and Redis (the repo's `docker/docker-compose.yml`) up and migrations + seed
  applied. The frontend talks to it through a dev proxy.

## Quick start

```bash
cd frontend
npm install
cp .env.example .env      # defaults already point at the local API
npm run dev
```

Open **http://localhost:5173**.

Vite proxies every `/api` request to the Go backend, so there are no CORS
concerns in development.

## Demo accounts

The seeded database ships with ready‑to‑use logins (password `Test1234!`):

| Role      | Email                  |
| --------- | ---------------------- |
| Developer | `alex.kim@gmail.com`   |
| Admin     | `admin@jobify.dev`     |

The sign‑in screen has one‑tap buttons that fill these in. Admin accounts can
additionally create, edit and delete roles.

## Environment variables

| Variable             | Default                 | Purpose                                    |
| -------------------- | ----------------------- | ------------------------------------------ |
| `VITE_API_BASE_URL`  | `/api/v1`               | Path the app calls (proxied in dev).       |
| `VITE_API_PROXY`     | `http://localhost:8080` | Where the Vite dev server forwards `/api`. |

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Vite dev server.               |
| `npm run build`    | Type‑check and build for production.     |
| `npm run preview`  | Preview the production build.            |
| `npm run typecheck`| Run the TypeScript compiler only.        |
| `npm run lint`     | Lint the source.                         |
| `npm run format`   | Format the source with Prettier.         |

## Project structure

```
src/
  api/          Typed Axios client, endpoints and backend type mirrors
  components/
    ui/         Primitives (Button, Dialog, Select, …)
    layout/     App shell — sidebar, header, mobile nav, background
    common/     Shared pieces (MatchRing, SkillTag, CommandPalette, …)
  features/
    auth/       Sign in / register
    dashboard/  Overview, pipeline chart, top matches
    jobs/       Explore, role detail, role form (admin)
    applications/  Kanban pipeline tracker
    saved/      Shortlist
    profile/    Skills & preferences editor
  hooks/        Zustand stores and TanStack Query hooks
  lib/          Utilities — match scoring, formatting, design constants
  providers/    Query client, error boundary, route guard
```

## Notes

- **Auth** — access + refresh tokens are persisted in `localStorage`; the Axios
  client refreshes access tokens transparently and signs the user out cleanly
  when a refresh fails.
- **Match scoring** — `GET /jobs` does not return a per‑role match, so the score
  on cards is computed on the client (`src/lib/match.ts`) using the same
  formula as the API. The role detail page uses the server‑computed value.
- **Design tokens** — colours, both themes, radii and shadows are CSS custom
  properties in `src/index.css`, consumed through Tailwind.
