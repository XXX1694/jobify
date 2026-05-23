#!/usr/bin/env bash
# Fast-start the Jobify dev stack: Postgres + Redis (Docker), Go API, Vite web.
# Ctrl+C stops the API and frontend; the database containers stay running.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

[ -f .env ] || { echo "x .env not found - copy .env.example to .env first."; exit 1; }

if lsof -iTCP:8080 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "x port 8080 is already in use - stop the running API and retry."
  exit 1
fi

# Export .env so docker-compose interpolation and the Go API both pick it up.
set -a; . ./.env; set +a

# Kill the API and frontend (this process group) on exit; leave the DB containers.
trap 'kill 0' EXIT

echo "> starting Postgres + Redis ..."
docker compose -f docker/docker-compose.yml up -d postgres redis

echo "> starting Go API    -> http://localhost:8080"
go run ./cmd/api &

echo "> starting Vite web  -> http://localhost:5173"
( cd frontend && npm run dev ) &

echo
echo "  Jobify dev stack is up. Press Ctrl+C to stop."
wait
