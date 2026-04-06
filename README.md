# FinFlow

FinFlow is a full-stack financial management dashboard with role-based access control.

- Backend: Node.js + Express + Prisma + PostgreSQL
- Frontend: Next.js (App Router) + React + Tailwind CSS
- Auth: JWT (access + refresh)
- Roles: ADMIN, ANALYST, VIEWER

This README is designed so anyone can run and test the project quickly, including with seeded demo users.

## Table of Contents

- Features
- Tech Stack
- Project Structure
- Role Permissions
- Quick Start (Local Development)
- Environment Variables
- Seeded Test Accounts (Email + Password)
- API Basics
- Complete API Reference
- Frontend Routes
- Testing Guide (Manual and API)
- Known Notes / Important Behaviors
- Troubleshooting

## Features

- JWT-based authentication with access and refresh tokens.
- Role-based authorization across API and UI.
- User management (admin-only): create users, list users, change roles, toggle status, delete users.
- Financial records module: create, read, update, soft delete records.
- Filter records by type, category, and date range.
- Dashboard summary metrics (income, expenses, net balance).
- Health checks for backend and database.
- Seed script with demo users and sample financial data.

## Tech Stack

### Backend

- Express 4
- Prisma ORM
- PostgreSQL
- Zod validation
- JWT + bcryptjs

### Frontend

- Next.js 16
- React 19
- Axios
- Tailwind CSS
- react-hot-toast

## Project Structure

```text
FinFlow/
	backend/
		prisma/
		src/
			controllers/
			services/
			routes/
			middlewares/
	frontend/
		src/
			app/
			api/
			components/
			context/
```

## Role Permissions

| Module | ADMIN | ANALYST | VIEWER |
|---|---|---|---|
| Auth: Login / Refresh / Me | Yes | Yes | Yes |
| Auth: Register | Yes (public route) | Yes (public route) | Yes (public route) |
| Dashboard Summary | Yes | Yes | Yes |
| Category Breakdown | Yes | Yes | No |
| Monthly Trends | Yes | Yes | No |
| Recent Activity | Yes | Yes | Yes |
| Records: List / Get By Id | Yes | Yes | Yes |
| Records: Create / Update / Delete | Yes | No | No |
| Users: All operations | Yes | No | No |

## Quick Start (Local Development)

### 1) Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL running locally or remotely

### 2) Install dependencies

From project root:

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 3) Configure environment variables

Create these files:

- backend/.env
- frontend/.env.local

Use the examples in the Environment Variables section below.

### 4) Prepare database

```bash
cd backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 5) Run backend

```bash
cd backend
pnpm dev
```

Expected backend URL (example):

- http://localhost:5000

### 6) Run frontend

```bash
cd frontend
pnpm dev
```

Expected frontend URL (example):

- http://localhost:3000

## Environment Variables

### backend/.env

```env
NODE_ENV=development
SERVER_PORT=5000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finflow?schema=public"

FRONTEND_LOCAL_URL="http://localhost:3000"
FRONTEND_SERVER_URL="https://your-frontend-domain.com"

BACKEND_LOCAL_URL="http://localhost:5000"
BACKEND_SERVER_URL="https://your-backend-domain.com"

JWT_SESSION_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-long-random-secret"

# Optional (used by helper utility file)
JWT_SESSION_EXPIRES_IN="7d"
JWT_REFRESH_EXPIRES_IN="7d"
```

### frontend/.env.local

```env
NEXT_PUBLIC_BACKEND_LOCAL_URL="http://localhost:5000/api"
NEXT_PUBLIC_BACKEND_SERVER_URL="https://your-backend-domain.com/api"
```

Important: frontend API calls expect the backend base URL to already include /api.

## Seeded Test Accounts (Email + Password)

After running pnpm prisma:seed in backend, these users are available:

| Role | Email | Password | Status |
|---|---|---|---|
| ADMIN | admin@finflow.com | admin123 | ACTIVE |
| ANALYST | analyst@finflow.com | analyst123 | ACTIVE |
| VIEWER | viewer@finflow.com | viewer123 | ACTIVE |
| ANALYST | inactive@finflow.com | inactive123 | INACTIVE |

Testing note:

- Inactive users cannot log in and receive 403 User is inactive.

## API Basics

### Base URL

- Local: http://localhost:5000/api

### Auth Header

Protected routes require:

```http
Authorization: Bearer <accessToken>
```

### Standard Success Response

```json
{
	"success": true,
	"message": "...",
	"data": {}
}
```

### Standard Error Response

```json
{
	"success": false,
	"message": "...",
	"errors": []
}
```

## Complete API Reference

### Health

1. GET /health
- Access: Public
- Description: Backend service health.

2. GET /health/db
- Access: Public
- Description: Database connectivity health.

### Auth

1. POST /api/auth/register
- Access: Public
- Body:

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"password": "secret123",
	"role": "VIEWER",
	"status": "ACTIVE"
}
```

2. POST /api/auth/login
- Access: Public
- Body:

```json
{
	"email": "admin@finflow.com",
	"password": "admin123"
}
```

- Returns: user, accessToken, refreshToken

3. POST /api/auth/refresh
- Access: Public
- Body:

```json
{
	"refreshToken": "<refresh-token>"
}
```

- Returns: new user payload, accessToken, refreshToken

4. GET /api/auth/me
- Access: Any authenticated role
- Returns: current authenticated user profile

### Users (Admin-only)

1. POST /api/users
- Access: ADMIN
- Body:

```json
{
	"name": "New User",
	"email": "new.user@example.com",
	"password": "strongpass",
	"role": "VIEWER",
	"status": "ACTIVE"
}
```

2. GET /api/users
- Access: ADMIN
- Returns: all users

3. GET /api/users/:id
- Access: ADMIN
- Returns: single user by id

4. PATCH /api/users/:id/role
- Access: ADMIN
- Body:

```json
{
	"role": "ANALYST"
}
```

5. PATCH /api/users/:id/status
- Access: ADMIN
- Body: optional (status is toggled server-side)
- Behavior: ACTIVE <-> INACTIVE toggle

6. DELETE /api/users/:id
- Access: ADMIN
- Behavior: hard delete user

### Financial Records

1. POST /api/records
- Access: ADMIN
- Body:

```json
{
	"amount": 1200.5,
	"type": "EXPENSE",
	"category": "Food",
	"date": "2026-04-06T10:30:00.000Z",
	"notes": "Weekly groceries"
}
```

2. GET /api/records
- Access: ADMIN, ANALYST, VIEWER
- Query params (optional):
	- type: INCOME or EXPENSE
	- category: string
	- startDate: ISO datetime
	- endDate: ISO datetime

Example:

GET /api/records?type=EXPENSE&category=Food&startDate=2026-04-01T00:00:00.000Z&endDate=2026-04-30T23:59:59.999Z

3. GET /api/records/:id
- Access: ADMIN, ANALYST, VIEWER

4. PUT /api/records/:id
- Access: ADMIN
- Body: partial record fields (same schema as create, all optional)

5. DELETE /api/records/:id
- Access: ADMIN
- Behavior: soft delete (isDeleted = true)

### Dashboard

1. GET /api/dashboard/summary
- Access: ADMIN, ANALYST, VIEWER
- Returns: totalIncome, totalExpenses, netBalance

2. GET /api/dashboard/category-breakdown
- Access: ADMIN, ANALYST
- Returns: per-category income and expense totals

3. GET /api/dashboard/monthly-trends
- Access: ADMIN, ANALYST
- Returns: last 6 months income/expense trend data

4. GET /api/dashboard/recent-activity
- Access: ADMIN, ANALYST, VIEWER
- Query params:
	- limit (optional, default 10)

## Frontend Routes

- /login
	- Public login page.
- /dashboard
	- Authenticated landing page with summary cards.
- /records
	- Record listing and filters.
	- Create/edit/delete actions visible to ADMIN only.
- /users
	- ADMIN only user management page.

## Testing Guide (Manual and API)

### A) Quick UI testing

1. Start backend and frontend.
2. Open http://localhost:3000/login.
3. Log in with one seeded account.
4. Verify role-based behavior:
	 - ADMIN can access Users and can mutate records.
	 - ANALYST/VIEWER cannot access Users.
	 - VIEWER cannot access restricted dashboard sections.

### B) Quick API testing with curl

1. Login and capture token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@finflow.com","password":"admin123"}'
```

2. Use accessToken on protected routes:

```bash
curl http://localhost:5000/api/users \
	-H "Authorization: Bearer <accessToken>"
```

3. Create a record:

```bash
curl -X POST http://localhost:5000/api/records \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <accessToken>" \
	-d '{"amount":999.99,"type":"EXPENSE","category":"Food","date":"2026-04-06T10:30:00.000Z","notes":"Test record"}'
```

### C) Recommended Postman flow

1. Create environment variable baseUrl = http://localhost:5000/api.
2. Send POST {{baseUrl}}/auth/login with seeded credentials.
3. Save accessToken and refreshToken from response.
4. Add Authorization Bearer token in protected requests.
5. Test each endpoint from the API reference above.

## Known Notes / Important Behaviors

- Frontend currently calls POST /auth/logout, but backend does not expose this route.
	- This does not block logout UX because client-side tokens are cleared regardless.
- /api/users/:id/status toggles status on server side.
	- Body status sent by client is currently not used by backend logic.
- Record deletion is soft delete; user deletion is hard delete.
- Register endpoint is public.
	- For production, restrict registration to admin flows only.

## Troubleshooting

1. CORS blocked request
- Verify FRONTEND_LOCAL_URL in backend/.env exactly matches frontend origin.

2. API base URL is not defined
- Ensure frontend/.env.local includes NEXT_PUBLIC_BACKEND_LOCAL_URL or NEXT_PUBLIC_BACKEND_SERVER_URL.

3. Unauthorized on protected endpoints
- Ensure Authorization header format is Bearer <accessToken>.
- Re-login if token expired.

4. Database connection issues
- Verify DATABASE_URL and that PostgreSQL is running.
- Run prisma migrate and seed again.

## License

See LICENSE file in this repository.