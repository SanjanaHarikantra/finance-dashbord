# API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### POST /auth/register
**Description:** Register a new user (bootstrap only - creates first admin)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

**Status Codes:**
- `201` - User created
- `400` - Invalid input
- `409` - Email already exists

---

### POST /auth/login
**Description:** Login user and get JWT token

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `403` - Account inactive

---

### GET /auth/me
**Description:** Get current authenticated user

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "status": "active"
}
```

**Status Codes:**
- `200` - Success
- `401` - No token or invalid token

---

## Financial Records Endpoints

### GET /records
**Description:** List all financial records (requires admin or analyst)

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
```
page=1                  # Page number (default: 1)
limit=10               # Records per page (default: 10)
type=income            # Filter by type: income, expense
category=Salary        # Filter by category
startDate=2026-01-01   # Filter by start date (YYYY-MM-DD)
endDate=2026-03-31     # Filter by end date (YYYY-MM-DD)
search=monthly         # Search in category and notes
sortBy=date            # Sort field: date, amount, category, createdAt
sortOrder=desc         # Sort order: asc or desc (default: desc)
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "amount": 1500,
      "type": "income",
      "category": "Salary",
      "date": "2026-04-06T00:00:00.000Z",
      "notes": "Monthly salary",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"
      },
      "isDeleted": false,
      "createdAt": "2026-04-06T12:00:00.000Z",
      "updatedAt": "2026-04-06T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 30,
    "totalPages": 3
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Insufficient role (viewer cannot access)

---

### POST /records
**Description:** Create a new financial record (requires admin)

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-06",
  "notes": "Monthly salary payment"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-06T00:00:00.000Z",
  "notes": "Monthly salary payment",
  "createdBy": "507f1f77bcf86cd799439012",
  "isDeleted": false,
  "createdAt": "2026-04-06T12:00:00.000Z",
  "updatedAt": "2026-04-06T12:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created
- `400` - Invalid input
- `401` - Unauthorized
- `403` - Insufficient role (analyst cannot create)

---

### GET /records/:id
**Description:** Get a specific financial record

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-06T00:00:00.000Z",
  "notes": "Monthly salary",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Admin User"
  },
  "isDeleted": false,
  "createdAt": "2026-04-06T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Record not found

---

### PATCH /records/:id
**Description:** Update a financial record (requires admin)

**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "amount": 2000,
  "type": "income",
  "category": "Bonus",
  "date": "2026-04-10",
  "notes": "Updated notes"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 2000,
  "type": "income",
  "category": "Bonus",
  "date": "2026-04-10T00:00:00.000Z",
  "notes": "Updated notes",
  "createdBy": "507f1f77bcf86cd799439012",
  "isDeleted": false,
  "updatedAt": "2026-04-06T13:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated
- `400` - Invalid input
- `404` - Record not found

---

### DELETE /records/:id
**Description:** Soft delete a financial record (requires admin)

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response:** `200 OK`
```json
{
  "message": "Record deleted successfully."
}
```

**Status Codes:**
- `200` - Deleted
- `404` - Record not found

---

## Dashboard Endpoints

### GET /dashboard/summary
**Description:** Get financial dashboard summary (viewer, analyst, admin)

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Query Parameters:**
```
startDate=2026-01-01   # Optional: filter from this date
endDate=2026-03-31     # Optional: filter to this date
```

**Response:** `200 OK`
```json
{
  "totalIncome": 15000,
  "totalExpenses": 5000,
  "netIncome": 10000,
  "recordCount": 30,
  "categoryTotals": [
    {
      "category": "Salary",
      "type": "income",
      "total": 15000
    },
    {
      "category": "Food",
      "type": "expense",
      "total": 2000
    }
  ],
  "monthlyTrend": [
    {
      "month": "2026-01",
      "income": 5000,
      "expense": 1500,
      "net": 3500
    }
  ],
  "recentRecords": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "amount": 1500,
      "type": "income",
      "category": "Salary",
      "date": "2026-04-06T00:00:00.000Z",
      "notes": "Monthly salary"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

## User Management Endpoints

### GET /users
**Description:** List all users (admin only)

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**
```
page=1           # Page number (default: 1)
limit=10         # Users per page (default: 10)
role=analyst     # Filter by role: viewer, analyst, admin
status=active    # Filter by status: active, inactive
search=john      # Search by name or email
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Analyst User",
      "email": "analyst@example.com",
      "role": "analyst",
      "status": "active",
      "createdAt": "2026-04-06T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin

---

### POST /users
**Description:** Create a new user (admin only)

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Analyst",
  "email": "newanalyst@example.com",
  "password": "SecurePass123",
  "role": "analyst"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "New Analyst",
  "email": "newanalyst@example.com",
  "role": "analyst",
  "status": "active",
  "createdAt": "2026-04-06T13:00:00.000Z"
}
```

**Status Codes:**
- `201` - Created
- `400` - Invalid input
- `409` - Email already exists

---

### GET /users/:id
**Description:** Get a specific user (admin only)

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Analyst User",
  "email": "analyst@example.com",
  "role": "analyst",
  "status": "active",
  "createdAt": "2026-04-06T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - User not found

---

### PATCH /users/:id
**Description:** Update a user (admin only)

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "role": "viewer",
  "status": "inactive",
  "password": "NewPassword123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Name",
  "email": "analyst@example.com",
  "role": "viewer",
  "status": "inactive",
  "updatedAt": "2026-04-06T13:00:00.000Z"
}
```

**Status Codes:**
- `200` - Updated
- `400` - Invalid input
- `404` - User not found

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required field(s): category."
}
```

### 401 Unauthorized
```json
{
  "message": "Authorization token is required."
}
```

### 403 Forbidden
```json
{
  "message": "You do not have permission for this action."
}
```

### 404 Not Found
```json
{
  "message": "Financial record not found."
}
```

### 409 Conflict
```json
{
  "message": "Duplicate value detected."
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error."
}
```

---

## Role Access Matrix

| Endpoint | Method | Viewer | Analyst | Admin |
|----------|--------|--------|---------|-------|
| /auth/* | * | ✓ | ✓ | ✓ |
| /dashboard/summary | GET | ✓ | ✓ | ✓ |
| /records | GET | ✗ | ✓ | ✓ |
| /records | POST | ✗ | ✗ | ✓ |
| /records/:id | GET | ✗ | ✓ | ✓ |
| /records/:id | PATCH | ✗ | ✗ | ✓ |
| /records/:id | DELETE | ✗ | ✗ | ✓ |
| /users | GET | ✗ | ✗ | ✓ |
| /users | POST | ✗ | ✗ | ✓ |
| /users/:id | GET | ✗ | ✗ | ✓ |
| /users/:id | PATCH | ✗ | ✗ | ✓ |

---

## Testing with cURL Examples

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123"}'
```

### Get Dashboard Summary
```bash
curl -X GET "http://localhost:5000/api/dashboard/summary?startDate=2026-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a Record
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount":500,
    "type":"expense",
    "category":"Food",
    "date":"2026-04-06",
    "notes":"Groceries"
  }'
```

### List Users (Pagination)
```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=5&role=analyst" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```
