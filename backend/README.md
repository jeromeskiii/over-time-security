# Lead Capture Backend

Next.js + Prisma + PostgreSQL backend for lead capture and sales pipeline management.

## Endpoints

- `POST /api/leads` - create lead
- `GET /api/leads` - list leads (`?status=new|contacted|quoted|won|lost` optional)
- `PATCH /api/leads/:id` - update lead status
- `POST /api/auth/login` - create admin/guard session cookie
- `POST /api/auth/logout` - clear session cookie

## Dashboard

- `GET /login/admin` - admin login page
- `GET /login/guard` - guard login page
- `GET /dashboard` - sales dashboard UI (admin)
- `GET /guard` - guard mobile portal (guard/admin)

## Setup

1. Install deps

```bash
cd backend
npm install
```

2. Create env file

```bash
cp .env.example .env
```

Set these auth values in `.env` before running:

- `AUTH_COOKIE_SECRET`
- `ADMIN_ACCESS_PASSWORD`
- `GUARD_ACCESS_PASSWORD`

3. Create DB schema + client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Start backend

```bash
npm run dev
```

Backend runs on `http://localhost:3001`.
