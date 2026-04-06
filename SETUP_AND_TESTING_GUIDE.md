# Finance Dashboard - Complete Setup & Testing Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd finance-dashboard-backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your-secret-key-here" > .env

# Start the server
npm run dev
```

**Expected output:**
```
[nodemon] 3.1.14
Server running on port 5000
MongoDB Connected
```

### 2. Seed Test Data (Optional but Recommended)

```bash
# Still in finance-dashboard-backend directory
npm run seed
```

This creates:
- 4 test users with different roles
- 30 sample financial records
- Two months of historical data

### 3. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd finance-dashboard-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
VITE v5.4.21  ready in XX ms
➜  Local:   http://localhost:5173/
```

Open your browser to `http://localhost:5173`

---

## Testing Different Roles

### Test User Credentials (After Running Seed)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@example.com | Password123 | Everything |
| **Analyst** | analyst@example.com | Password123 | Records + Dashboard |
| **Viewer** | viewer@example.com | Password123 | Dashboard only |
| **Inactive** | inactive@example.com | Password123 | No access (account frozen) |

### Testing Each Role

#### 1. Test as Admin
```
1. Login: admin@example.com / Password123
2. Should see:
   - Dashboard (✓)
   - Records list (✓)
   - Add New Record button (✓)
   - Users management tab (✓)
3. Can:
   - Create records ✓
   - Edit records ✓
   - Delete records ✓
   - Manage users ✓
```

#### 2. Test as Analyst
```
1. Login: analyst@example.com / Password123
2. Should see:
   - Dashboard (✓)
   - Records list (✓)
   - Add New Record button (✓)
   - NO Users tab (✗)
3. Can:
   - View records ✓
   - BUT cannot create/edit/delete (will throw 403 error)
```

#### 3. Test as Viewer
```
1. Login: viewer@example.com / Password123
2. Should see:
   - Dashboard (✓)
   - NO Records tab (✗)
   - NO Users tab (✗)
3. Can:
   - View dashboard summary only
   - Cannot access records
```

#### 4. Test Inactive User
```
1. Login: inactive@example.com / Password123
2. Will fail with: "Inactive users cannot access this resource"
```

---

## API Testing with cURL

### Authentication

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123"
  }'

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### List Records
```bash
curl -X GET "http://localhost:5000/api/records?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Dashboard Summary
```bash
curl -X GET "http://localhost:5000/api/dashboard/summary" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create a Record
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 1500,
    "type": "income",
    "category": "Salary",
    "date": "2026-04-06",
    "notes": "Monthly salary"
  }'
```

### List Users (Admin Only)
```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

---

## Database Information

### MongoDB Connection
- **Default URI:** `mongodb://localhost:27017/finance-dashboard`
- **Collections:** `users`, `financialrecords`

### View Data with MongoDB

```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/finance-dashboard

# View users
db.users.find()

# View records
db.financialrecords.find().limit(5)

# Check record count by type
db.financialrecords.aggregate([
  { $match: { isDeleted: false } },
  { $group: { _id: "$type", count: { $sum: 1 } } }
])
```

---

## Common Issues & Solutions

### "MongoDB Connected" Never Appears
- **Cause:** MongoDB is not running
- **Solution:** 
  ```bash
  # On Windows with MongoDB installed:
  net start MongoDB
  
  # Or with Docker:
  docker run -d -p 27017:27017 mongo
  ```

### "Unable to fetch records" Error
- **Check:** Is your user "admin" or "analyst"?
  - "viewer" role can only access dashboard
  - "analyst" and "admin" can access records
- **Check:** Is your account status "active"?
  - Use admin account to check user status

### CORS Error in Frontend
- **Cause:** Backend might not be running
- **Solution:** Ensure `npm run dev` is running in backend directory

### "Invalid or expired token"
- **Cause:** Token expired or corrupted
- **Solution:** Log out and log back in to get a fresh token

---

## Verification Checklist

After setup, verify:

- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] Frontend loads at http://localhost:5173
- [ ] Can login as admin@example.com
- [ ] Can view dashboard
- [ ] Can view records
- [ ] Can create a new record
- [ ] Can edit a record
- [ ] Can delete a record
- [ ] Can access Users tab
- [ ] Analyst account cannot create records (403)
- [ ] Viewer account cannot access records (403)

---

## File Structure

```
finance-dashboard-backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── authController.js        # Auth logic
│   ├── recordController.js      # Record CRUD
│   ├── dashboardController.js   # Analytics
│   └── userController.js        # User management
├── middleware/
│   ├── authMiddleware.js        # JWT & role checks
│   └── errorMiddleware.js       # Error handling
├── models/
│   ├── User.js                  # User schema
│   └── FinancialRecord.js       # Record schema
├── routes/
│   ├── authRoutes.js
│   ├── recordRoutes.js
│   ├── dashboardRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── error.js                 # Error classes
│   ├── validators.js            # Input validation
│   └── sanitize.js              # Data sanitization
├── .env                         # Environment variables
├── server.js                    # Express app entry
├── seed.js                      # Test data seeder
└── README.md
```

---

## Key Features to Test

### 1. Financial Record Filtering
```bash
# By type
GET /api/records?type=income

# By category
GET /api/records?category=Salary

# By date range
GET /api/records?startDate=2026-01-01&endDate=2026-03-31

# With search
GET /api/records?search=monthly
```

### 2. Dashboard Analytics
- View total income + expenses + net balance
- See category-wise breakdown
- Check monthly trends
- View recent transactions

### 3. User Management
- Create new users with roles
- Update user roles
- Deactivate users
- View user list with pagination

### 4. Access Control
- Admin can do everything
- Analyst cannot modify records
- Viewer cannot access records
- Inactive users blocked

---

## Development Tips

### Enable Debug Logging
```bash
# Set in .env
DEBUG=*
npm run dev
```

### Clear Database & Reseed
```bash
# Delete all data and start fresh
npm run seed
```

### Nodemon Auto-Restart
The backend auto-restarts when files change. Just save the file.

### Check Backend Status
```bash
curl http://localhost:5000/
# Should return: {"message":"Finance Dashboard API is running."}
```

---

## Next Steps

1. **Explore the code** - Review how RBAC is implemented
2. **Modify roles** - Try adding new roles in validators.js
3. **Add analytics** - Extend dashboard with more metrics
4. **Write tests** - Add unit/integration tests
5. **Deploy** - Take it to production!

---

## Support

For issues:
1. Check the browser console (F12)
2. Check backend terminal for errors
3. Ensure MongoDB is running
4. Verify .env file has correct values
5. Review the ASSESSMENT.md for implementation details
