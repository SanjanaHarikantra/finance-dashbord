# Finance Dashboard Frontend

A React + Vite frontend application for the Finance Dashboard backend.

## Features

- User authentication (login/register)
- Dashboard with financial summary
- Financial records management (CRUD operations)
- Admin user management
- Role-based access control
- Responsive UI with Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Backend Requirements

Make sure the backend is running on `http://localhost:5000`.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Router:** React Router DOM

## Project Structure

```
src/
├── api.ts
├── App.tsx
├── main.tsx
├── components/
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── EditRecord.tsx
│   ├── Login.tsx
│   ├── NewRecord.tsx
│   ├── Records.tsx
│   ├── Register.tsx
│   └── Users.tsx
└── index.css
```

## Authentication

The app stores JWT tokens in `localStorage` and attaches them to API requests using an Axios interceptor.

## API Integration

All API requests are made to `http://localhost:5000/api`.

## Roles and Permissions

- **Viewer:** Can view dashboard summary
- **Analyst:** Can view and manage records
- **Admin:** Full access including user management
