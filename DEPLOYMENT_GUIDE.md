# 🚀 Deployment Guide - Finance Dashboard

## Table of Contents
1. [Production Setup Checklist](#production-setup-checklist)
2. [Deploy Backend](#deploy-backend)
3. [Deploy Frontend](#deploy-frontend)
4. [Deployment Platforms](#deployment-platforms)
5. [Security Best Practices](#security-best-practices)

---

## Production Setup Checklist

Before deploying, ensure:

- ✅ Remove test data or secure it
- ✅ Update environment variables
- ✅ Enable HTTPS/SSL
- ✅ Configure CORS properly
- ✅ Set strong JWT secret
- ✅ Use production MongoDB instance
- ✅ Enable error logging
- ✅ Set secure password hashing
- ✅ Review access control rules

---

## Deploy Backend

### **Option 1: Deploy to Render (Easiest)**

#### Step 1: Prepare Backend
```bash
cd finance-dashboard-backend

# Update package.json with start script
# Ensure it has: "start": "node server.js"
```

#### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Click "New +" → "Web Service"

#### Step 3: Connect Repository
1. Select your GitHub repository
2. Choose branch: `main`
3. Build command: `npm install`
4. Start command: `npm start`

#### Step 4: Configure Environment
1. Click "Advanced" → "Environment Variables"
2. Add these variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-db
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

3. Click "Create Web Service" → Done!

---

### **Option 2: Deploy to Railway (Fast)**

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login & Initialize
```bash
railway login
cd finance-dashboard-backend
railway init
```

#### Step 3: Add Environment Variables
```bash
railway variables set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
```

#### Step 4: Deploy
```bash
railway up
```

Backend URL will be provided!

---

### **Option 3: Deploy to Heroku (Classic)**

#### Step 1: Create Account
Go to https://www.heroku.com

#### Step 2: Install Heroku CLI
```bash
# Windows
npm install -g heroku

# macOS/Linux
brew tap heroku/brew && brew install heroku
```

#### Step 3: Deploy
```bash
cd finance-dashboard-backend
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

---

## Deploy Databases

### **MongoDB Atlas (Cloud MongoDB)**

#### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create a new cluster

#### Step 2: Get Connection String
1. Click "Connect"
2. Choose "Connect your application"
3. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Replace `<password>` with your password

#### Step 3: Update Backend .env
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-db
```

#### Step 4: Run Seed Script (Optional)
```bash
# Seed production database with test data
npm run seed
```

---

## Deploy Frontend

### **Option 1: Deploy to Vercel (Recommended for React)**

#### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

#### Step 2: Import Project
1. Click "New Project"
2. Select your GitHub repository
3. Select "finance-dashboard-frontend" folder
4. Click "Deploy"

#### Step 3: Configure Environment
1. Go to "Settings" → "Environment Variables"
2. Add:
```
VITE_API_URL=https://your-backend-url.com
```

3. Redeploy

Frontend URL: `https://your-project.vercel.app`

---

### **Option 2: Deploy to Netlify**

#### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub

#### Step 2: Connect Repository
1. Click "Add new site" → "Import an existing project"
2. Select GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`

#### Step 3: Build Settings
```
Build command: npm run build
Base directory: finance-dashboard-frontend
Publish directory: finance-dashboard-frontend/dist
```

#### Step 4: Environment Variables
```
VITE_API_URL=https://your-backend-url.com
```

---

### **Option 3: Deploy to AWS S3 + CloudFront**

#### Step 1: Build Frontend
```bash
cd finance-dashboard-frontend
npm run build
# Creates dist/ folder
```

#### Step 2: Create S3 Bucket
1. Go to AWS S3
2. Create bucket: `my-finance-dashboard`
3. Enable "Static website hosting"
4. Upload contents of `dist/` folder

#### Step 3: CloudFront Distribution
1. Create CloudFront distribution
2. Point to S3 bucket
3. Set CNAME: `app.yourdomain.com`

#### Step 4: Update Backend CORS
```javascript
// server.js
app.use(cors({
  origin: 'https://app.yourdomain.com',
  credentials: true
}))
```

---

## Complete Deployment Setup

### **Full Production Deployment**

```bash
# 1. Update Backend .env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/finance-db
JWT_SECRET=your-super-secret-key-minimum-32-characters
NODE_ENV=production
CORS_ORIGIN=https://app.yourdomain.com
PORT=5000

# 2. Build Frontend
cd finance-dashboard-frontend
npm run build
# Creates optimized dist/ folder

# 3. Deploy Backend (Render/Railway/Heroku)
cd ../finance-dashboard-backend
# Follow platform instructions above

# 4. Deploy Frontend (Vercel/Netlify/S3)
# Deploy dist/ folder

# 5. Update Frontend .env.production
VITE_API_URL=https://your-backend-api-url.com
```

---

## Security Best Practices

### **1. Environment Variables**
```bash
# NEVER commit these to GitHub!
# Use platform's secret management:

# Backend secrets:
JWT_SECRET=generate-strong-random-key-here
MONGO_URI=mongodb+srv://username:password@host/db
NODE_ENV=production

# Frontend env:
VITE_API_URL=https://api.yourdomain.com
```

### **2. Generate Strong JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **3. CORS Configuration**
```javascript
// Only allow your frontend domain
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### **4. Rate Limiting (Optional)**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### **5. HTTPS/SSL**
- All production URLs must use HTTPS
- Use free SSL from Let's Encrypt
- Platforms like Vercel, Render handle it automatically

---

## Post-Deployment Checklist

- ✅ Test login functionality
- ✅ Create/read/update/delete records
- ✅ Test all user roles (admin, analyst, viewer)
- ✅ Verify database connections
- ✅ Check error logging
- ✅ Monitor performance
- ✅ Set up backups
- ✅ Enable HTTPS
- ✅ Test on mobile devices
- ✅ Monitor for errors (Sentry, LogRocket)

---

## URLs After Deployment

```
Frontend:  https://app.yourdomain.com
Backend:   https://api.yourdomain.com
Database:  MongoDB Atlas connection string
```

---

## Quick Deployment Summary

| Platform | Backend | Frontend | Cost |
|----------|---------|----------|------|
| **Render** | ⭐⭐⭐⭐⭐ | Separate | $7/month |
| **Railway** | ⭐⭐⭐⭐⭐ | Not ideal | Pay-as-you-go |
| **Vercel** | Not ideal | ⭐⭐⭐⭐⭐ | Free |
| **Netlify** | Not ideal | ⭐⭐⭐⭐⭐ | Free |
| **Heroku** | ⭐⭐⭐⭐ | Separate | $7/month |
| **AWS** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Variable |

---

## Recommended Full-Stack Deployment

**Best Practice:** Deploy both on same platform

### **Option A: Both on Render**
1. Backend: Render Web Service
2. Frontend: Render Static Site
3. Database: MongoDB Atlas
4. Cost: ~$7/month

### **Option B: Backend on Railway, Frontend on Vercel**
1. Backend: Railway
2. Frontend: Vercel (free)
3. Database: MongoDB Atlas
4. Cost: ~$5-10/month

### **Option C: Both on AWS/Heroku**
1. Backend: EC2/Heroku
2. Frontend: S3 + CloudFront/Heroku
3. Database: RDS/MongoDB Atlas
4. Cost: Variable (can be free tier)

---

## Troubleshooting Deployment

### **Backend won't connect to MongoDB**
```
Check: Correct MONGO_URI in environment variables
Check: IP whitelist in MongoDB Atlas (Security → Network Access)
Check: Username/password is correct
```

### **Frontend can't reach backend**
```
Check: VITE_API_URL points to correct backend URL
Check: Backend CORS_ORIGIN matches frontend domain
Check: Backend is running and healthy
```

### **Build fails**
```
Check: All dependencies are installed (npm install)
Check: No TypeScript errors (npm run build)
Check: Environment variables are set
```

---

## Monitoring & Logging

### **Setup Error Tracking**
```bash
npm install sentry
```

### **Database Backups**
- MongoDB Atlas: Automatic backups included
- Set up daily backups in Atlas dashboard

### **Performance Monitoring**
- Use Render/Railway built-in monitoring
- Set up error alerts

---

Need help with specific deployment platform? 😊
