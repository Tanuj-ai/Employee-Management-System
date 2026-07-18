# Employee Management System (EMS)

A full-stack Employee Management System with authentication, role-based access control, employee CRUD, organizational hierarchy, and a dashboard.

## Tech Stack

**Backend** — `backend/`
- Node.js + Express 5 + TypeScript
- MongoDB + Mongoose (ODM)
- JWT (httpOnly cookie) for auth, bcrypt for password hashing
- Zod for request validation
- Multer + Cloudinary for profile image uploads
- helmet, cors, morgan for security/logging

**Frontend** — `frontend/`
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui components
- axios for API calls, react-hook-form + zod for forms
- recharts for dashboard charts
- xlsx / jspdf for Excel/PDF export

Chosen because this stack gives a typed, batteries-included REST API (Express + Mongoose + Zod) paired with a modern React framework (Next.js App Router) that already ships routing, image optimization, and edge middleware (`proxy.ts` in Next 16) needed for auth-gated pages.

## Folder Structure

```
backend/
  src/
    config/       # DB connection
    controllers/   # route handlers
    middleware/    # auth (protect/authorize), upload, error handler
    models/        # Mongoose schemas (User, Employee, Counter)
    routes/        # Express routers
    services/      # employee ID generation, hierarchy/circular-reference checks
    utils/         # ApiError, asyncHandler, JWT helper, Cloudinary config
    validators/    # Zod schemas
    scripts/seed.ts # seeds a Super Admin user
frontend/
  app/            # Next.js App Router pages (login, dashboard, dashboard/employees, dashboard/organization, dashboard/profile)
  components/     # dashboard, employees, organization, layout, ui (shadcn)
  lib/            # axios instance, AuthContext
  services/       # API client functions (auth, employee)
  types/          # shared TS types
  utils/          # Excel/PDF export helpers
  proxy.ts        # Next.js 16 edge "proxy" (formerly middleware) — gates /dashboard/*
docs/
  API.md          # full endpoint reference
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- A running MongoDB instance (local or Atlas)
- A Cloudinary account (for profile image uploads) — optional for local testing if you don't upload photos

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm run seed            # creates the Super Admin user (admin@ems.com / admin123)
npm run dev              # starts the API on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # starts the app on http://localhost:3000
```

The frontend's API base URL is currently hardcoded to `http://localhost:5000/api` in `frontend/lib/axios.ts` (see Known Limitations).

## Test Credentials

| Role | Email | Password | Notes |
|---|---|---|---|
| Super Admin | `admin@ems.com` | `admin123` | Created by `npm run seed` in `backend/` |
| HR Manager | — | — | Create via the Super Admin's "Add Employee" flow with role `HR_MANAGER`, then create a matching login user, or via `npm run seed` extension |
| Employee | — | — | Create an Employee record, then create a `User` document with `role: EMPLOYEE` and `employee: <employeeId>` to link them for self-service login |

> Only the Super Admin is seeded automatically. HR Manager and Employee logins require a `User` document (separate from the `Employee` record) with a matching `email`/`password` and, for Employees, an `employee` ref — there is currently no UI to create these `User` login accounts; they must be created manually (e.g. via a Mongo shell/`mongosh` insert using the same bcrypt-hashing `User` model, or a short one-off script) until an admin-facing "create login" flow exists.

## Roles & Access

- **Super Admin**: full CRUD on employees, delete, assign roles (including Super Admin), assign reporting managers.
- **HR Manager**: create/edit/view employees; cannot delete; cannot assign the Super Admin role (enforced both in the UI and on the backend).
- **Employee**: can only view/edit their own profile via `/dashboard/profile`, and only limited fields (phone, photo) — enforced server-side by a dedicated `GET/PATCH /api/employees/me` pair with its own restricted Zod schema, not just hidden UI.

## Known Limitations

- No UI flow yet to create `User` login accounts for HR Manager/Employee roles (see Test Credentials above) — only employee *records* are created via the UI; the separate `User` auth account must be created manually.
- Frontend API base URL is hardcoded rather than environment-driven (no `frontend/.env`).
- `frontend/` and `backend/` are not unified under one git repository (frontend has its own `.git` with a single scaffold commit; backend has none).
- Route protection in `proxy.ts` is an optimistic cookie-presence check only (per Next.js guidance) — the real authorization is always re-verified by the backend on every API call.
- Bonus features not implemented this session: CSV import, Docker, automated tests, live deployment.
- Organization tree endpoint builds the tree in-memory (O(n²) recursive filter) — fine for small/medium orgs, not optimized for very large employee counts.

## API Documentation

See [`docs/API.md`](docs/API.md) for the full endpoint reference (method, path, auth/role requirements, request body, sample response).
