# 🚀 Quick Start (5 Minutes)

## Step 1: Start Backend (1 minute)
```bash
cd finance-dashboard-backend
npm install  # if not already done
npm run dev
```

✅ You should see:
```
Server running on port 5000
MongoDB Connected
```

## Step 2: Seed Test Data (30 seconds)
In a new terminal:
```bash
cd finance-dashboard-backend
npm run seed
```

✅ You should see:
```
✅ Database seeded successfully!
Test User Credentials:
─────────────────────
Admin:    admin@example.com / Password123
Analyst:  analyst@example.com / Password123
Viewer:   viewer@example.com / Password123
Inactive: inactive@example.com / Password123
```

## Step 3: Start Frontend (30 seconds)
In a new terminal:
```bash
cd finance-dashboard-frontend
npm install  # if not already done
npm run dev
```

✅ You should see:
```
VITE v5.4.21  ready in XX ms
Local:   http://localhost:5173/
```

## Step 4: Test the App (3 minutes)

1. **Open browser** → http://localhost:5173
2. **Login as Admin** → admin@example.com / Password123
3. **Click Dashboard** → See financial summary
4. **Click Records** → See 30 sample transactions
5. **Click Users** → Manage user accounts
6. **Add New Record** → Create an income or expense record

---

## What Each Role Can Do

### Admin (admin@example.com)
- ✅ View dashboard
- ✅ View records
- ✅ Create/edit/delete records
- ✅ Manage users

### Analyst (analyst@example.com)
- ✅ View dashboard
- ✅ View records
- ❌ Cannot create/edit/delete records
- ❌ Cannot access users

### Viewer (viewer@example.com)
- ✅ View dashboard only
- ❌ Cannot access records
- ❌ Cannot access users

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "MongoDB Connected" not showing | Start MongoDB or run `npm run seed` |
| Can't login | Run `npm run seed` to create test users |
| Records not showing | Make sure you're logged in as admin or analyst |
| Frontend shows errors | Check browser console (F12) for details |
| Port 5000 in use | Change PORT in .env or kill process on that port |

---

## Documentation Files

Read these after the quick start:

1. **PROJECT_SUMMARY.md** - Complete overview of what was built
2. **SETUP_AND_TESTING_GUIDE.md** - Detailed setup and testing
3. **API_REFERENCE.md** - All API endpoints with examples
4. **ASSESSMENT.md** - How backend meets requirements
5. **finance-dashboard-backend/README.md** - Backend details
6. **finance-dashboard-frontend/README.md** - Frontend details

---

## Key Features

✅ **User Management** - Create users, assign roles
✅ **Role-Based Access** - Admin, Analyst, Viewer roles
✅ **Financial Records** - Create, edit, delete transactions
✅ **Dashboard** - View income, expenses, trends
✅ **Filtering** - Filter by type, category, date range
✅ **Search** - Search records and users
✅ **Authentication** - JWT token-based login
✅ **Error Handling** - Clear error messages
✅ **Responsive Design** - Works on desktop and mobile

---

## Testing Different Users

```bash
# Test as Admin (full access)
Email: admin@example.com
Password: Password123

# Test as Analyst (can view records, cannot create)
Email: analyst@example.com
Password: Password123

# Test as Viewer (dashboard only)
Email: viewer@example.com
Password: Password123

# Test as Inactive (no access)
Email: inactive@example.com
Password: Password123
# Expected: "Inactive users cannot access this resource"
```

---

## Database

Sample data includes:
- 4 test users (admin, analyst, viewer, inactive)
- 30 financial records (income and expenses)
- 2 months of historical data
- Sample categories: Salary, Food, Utilities, etc.

---

## Next Steps

1. ✅ Get the app running (follow steps above)
2. ✅ Test different user roles
3. ✅ Try creating, editing, deleting records
4. ✅ Try filtering and searching
5. Read the full documentation
6. Review the code architecture
7. Deploy to production (optional)

---

## API Testing (Optional)

Test backend API with curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123"}'

# Get dashboard summary
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# List records
curl -X GET "http://localhost:5000/api/records?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

See **API_REFERENCE.md** for all endpoints.

---

## Done! 🎉

Your finance dashboard is running!

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Admin Account:** admin@example.com / Password123

Enjoy exploring the app!
