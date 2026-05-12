# BE Quiz Builder

Express + TypeScript + Prisma API. Application code lives under `backend/`.

## Layout

```
├── backend/          # Express app
│   ├── src/
│   ├── prisma/
│   ├── tests/
│   └── package.json
├── docker-compose.yml
└── package.json      # optional scripts that delegate into backend/
```

## Requirements

- Node.js 20+
- npm
- PostgreSQL 14+ (or Docker; see below)

## Setup

From the repository root you can run `npm run …` (scripts forward to `backend/`). Or work inside `backend/`:

1. `cd backend`
2. `npm install`
3. `copy .env.example .env` (Windows) or `cp .env.example .env`
4. From repo root: `docker compose up -d` (starts Postgres)
5. `npm run prisma:migrate`
6. Optional: `npm run prisma:seed`

## Run

- Dev: `npm run dev` (from root) or `cd backend && npm run dev`
- Build: `npm run build`
- Start (after build): `npm run start`
- Health: `GET http://localhost:4000/health`

## Database

- Default connection string is in `backend/.env.example`.
- Docker Postgres: `docker compose up -d` (from repo root)
- Stop: `docker compose down`
- Reset volume: `docker compose down -v`

## Test

- `npm test` (from root) or `cd backend && npm test`

## API

- `POST /quizzes`
- `GET /quizzes`
- `GET /quizzes/:id`
- `DELETE /quizzes/:id`

## Errors

JSON shape:

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "details": {}
}
```
