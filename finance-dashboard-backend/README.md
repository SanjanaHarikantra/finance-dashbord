# Finance Dashboard Backend

A backend assignment project for a finance dashboard system built with Node.js, Express, MongoDB, and Mongoose. It demonstrates user and role management, financial record processing, dashboard summary APIs, validation, and backend-level access control.

## Features

- Bootstrap admin registration for first-time setup
- JWT-based authentication
- Role-based access control for `viewer`, `analyst`, and `admin`
- Admin user management with active/inactive status handling
- Financial record CRUD with filtering, pagination, sorting, and soft delete
- Dashboard summary API with income, expenses, net balance, category totals, monthly trends, and recent activity
- Centralized error handling and request validation

## Role Behavior

- `viewer`: can access dashboard summary data only
- `analyst`: can access financial records and dashboard insights
- `admin`: full access to users, records, and dashboard data

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start the server:

```bash
npm run dev
```

Or:

```bash
npm start
```

## API Overview

### Auth

- `POST /api/auth/register`
  - Bootstrap-only route. Creates the first user as an admin.
- `POST /api/auth/login`
  - Logs in an active user and returns a JWT.
- `GET /api/auth/me`
  - Returns the currently authenticated user.

### Users

All `/api/users` routes require an authenticated admin.

- `GET /api/users`
  - Supports `page`, `limit`, `role`, `status`, and `search`
- `POST /api/users`
  - Create a new user
- `GET /api/users/:id`
  - Fetch one user
- `PATCH /api/users/:id`
  - Update `name`, `role`, `status`, or `password`

### Financial Records

`GET` routes require `admin` or `analyst`. Write routes require `admin`.

- `GET /api/records`
  - Supports `page`, `limit`, `type`, `category`, `startDate`, `endDate`, `search`, `sortBy`, and `sortOrder`
- `POST /api/records`
- `GET /api/records/:id`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`
  - Soft delete only

### Dashboard

Accessible by `viewer`, `analyst`, and `admin`.

- `GET /api/dashboard/summary`
  - Supports optional `startDate` and `endDate`

## Example Payloads

### Bootstrap Admin

```json
{
  "name": "System Admin",
  "email": "admin@example.com",
  "password": "strongpass"
}
```

### Login

```json
{
  "email": "admin@example.com",
  "password": "strongpass"
}
```

### Create User

```json
{
  "name": "Finance Analyst",
  "email": "analyst@example.com",
  "password": "strongpass",
  "role": "analyst",
  "status": "active"
}
```

### Create Financial Record

```json
{
  "amount": 2450.75,
  "type": "income",
  "category": "Consulting",
  "date": "2026-04-01",
  "notes": "April retainer payment"
}
```

## Assumptions and Tradeoffs

- Self-registration is allowed only once to bootstrap the initial admin account.
- User management after bootstrap is handled by admins only.
- Viewer users can access summary data but not the raw financial record listing.
- Financial record deletion is implemented as soft delete to preserve analytical consistency.
- Validation is implemented manually to keep the dependency footprint small.

## Suggested Submission Notes

If you submit this project for evaluation, highlight:

- the role model and why it was chosen
- the bootstrap-admin flow
- the soft-delete decision for financial records
- how summary analytics are computed with MongoDB aggregation
- how validation and centralized error handling were structured
