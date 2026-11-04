# 🚀 Quick Start Guide

## Prerequisites

✅ Node.js 20+ installed  
✅ npm installed  
✅ Dependencies installed (run `npm install` in both folders)  

---

## Option 1: Manual Start (Recommended)

### Terminal 1 - Backend
```powershell
cd d:\ABC
npm start
```
✅ Backend running on **http://localhost:5000**

### Terminal 2 - Frontend
```powershell
cd "d:\ABC\frontend abc\smart-campus-ticketing"
npm run dev
```
✅ Frontend running on **http://localhost:3000**

### Open Browser
Navigate to: **http://localhost:3000**

---

## Option 2: PowerShell Script

Run the startup script:
```powershell
cd d:\ABC
.\start-dev.ps1
```

This will start both servers automatically.  
Press `Ctrl+C` to stop both.

---

## 🧪 Quick Test

### 1. Check Backend Health
```powershell
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### 2. Check Frontend
Open browser: http://localhost:3000  
Should see the landing page

### 3. Test Full Integration
1. Click **"Sign In"**
2. Enter email: `test@campus.edu`
3. Should redirect to Dashboard
4. Navigate to **"Events"**
5. Should see list of events from database
6. Click an event and try booking tickets

---

## 🗄️ Seed Demo Data (Optional)

If you want sample events in the database:

```powershell
cd d:\ABC
npm run seed
```

This creates:
- 2 demo users (Alice, Bob)
- 8 sample events with various categories and prices

---

## 🛑 Stop Servers

### If running manually:
Press `Ctrl+C` in each terminal

### If using PowerShell script:
Press `Ctrl+C` once (stops both)

---

## 🐛 Troubleshooting

### Backend won't start
1. Check `.env` file exists and is configured
2. Verify Supabase credentials
3. Check port 5000 is not in use

### Frontend won't start
1. Check `.env` file exists
2. Verify `VITE_USE_MOCK=false`
3. Check port 3000 is not in use

### CORS errors
1. Ensure backend is running first
2. Check frontend `.env` has correct API_URL
3. Verify backend CORS allows localhost:3000

### 401 errors
1. Sign in again (token might be expired)
2. Check JWT_SECRET is set in backend `.env`

---

## 📊 Current Status

✅ Backend API: http://localhost:5000  
✅ Frontend App: http://localhost:3000  
✅ Integration: Connected  
✅ Mock Mode: Disabled (using real backend)  
✅ Database: Supabase PostgreSQL  

**System ready to use!** 🎉
