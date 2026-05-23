# Local development

`./dev.sh` starts the whole stack with one command — Postgres + Redis (in
Docker), the Go API, and the React frontend.

## Requirements

- **Docker** — runs Postgres + Redis
- **Go** and **Node 18+** — run the API and the frontend

## Run it

```sh
./dev.sh
```

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173   |
| API      | http://localhost:8080   |

The frontend proxies `/api` → the API. `Ctrl+C` stops the API and frontend; the
database containers keep running (`make docker-down` to stop those too).

Sign in with `admin@jobify.dev` / `Test1234!` (admin) or
`alex.kim@gmail.com` / `Test1234!` (developer).

## Configuration

Backend settings live in `.env` (git-ignored, created from `.env.example`).
It is loaded both by `dev.sh` and by the Go API itself, so `make run` also works.

## Running a piece on its own

```sh
make run                       # API only
cd frontend && npm run dev      # frontend only
```

## Optional: a global shortcut

Add to `~/.zshrc` to start the stack from any directory:

```sh
jobify() { (cd ~/Documents/jobify && ./dev.sh); }
```
