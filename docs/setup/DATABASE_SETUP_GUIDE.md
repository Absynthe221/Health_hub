# 🗄️ DATABASE SETUP GUIDE - Step by Step

## ✅ Database Setup for Health Hub

**Time Required:** 30-45 minutes  
**Cost:** FREE  
**Recommended:** Supabase

---

## 🚀 OPTION 1: SUPABASE (Recommended - FREE)

### **Why Supabase:**
- ✅ FREE tier (500 MB database, perfect for start)
- ✅ PostgreSQL (what we need)
- ✅ Instant setup (no credit card for free tier)
- ✅ Auto backups
- ✅ Dashboard for management
- ✅ Based in Europe (good for UK users)

### **Step-by-Step Setup:**

#### **Step 1: Create Supabase Account (5 minutes)**
1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest) or email
4. Verify email if needed

#### **Step 2: Create New Project (3 minutes)**
1. Click "New Project"
2. Fill in:
   - **Name:** healthhub-ecg
   - **Database Password:** (generate strong password - SAVE THIS!)
   - **Region:** Choose closest to UK (e.g., "West EU - Ireland")
3. Click "Create new project"
4. Wait ~2 minutes for database to provision

#### **Step 3: Get Connection String (2 minutes)**
1. In your project dashboard, click "Settings" (left sidebar)
2. Click "Database"
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you created in Step 2

#### **Step 4: Add to Environment (5 minutes)**
1. Open your project in terminal/code editor
2. Create/edit `.env.local` file:
   ```bash
   cd /Users/som/Health_Hub
   nano .env.local
   ```

3. Add this line (replace with YOUR connection string):
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

4. Save file (Ctrl+O, Enter, Ctrl+X in nano)

#### **Step 5: Run Database Migrations (10 minutes)**
```bash
# Install Prisma CLI if not already installed
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma db push

# Seed initial data
npm run db:seed
```

#### **Step 6: Verify Connection (2 minutes)**
```bash
# Test database connection
npx prisma db pull

# Should show: "✔ Introspected X models..."
```

---

## 🚀 OPTION 2: NEON (Alternative FREE Option)

### **Step-by-Step:**
1. Go to: https://neon.tech
2. Sign up with GitHub
3. Create new project: "healthhub-ecg"
4. Copy connection string
5. Add to .env.local as DATABASE_URL
6. Run migrations (same as Supabase Step 5)

---

## 🚀 OPTION 3: Railway (Includes Hosting)

### **Step-by-Step:**
1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project
4. Add PostgreSQL service (click "Add Service" → "Database" → "PostgreSQL")
5. Connection string appears automatically in environment variables
6. Deploy your app to Railway
7. Run migrations from Railway console

---

## 🔧 AFTER DATABASE SETUP

### **Update Your .env.local File:**

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://postgres:password@host:5432/database"

# Authentication (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Optional (can add later)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

### **Generate Auth Secret:**
```bash
# Run this command
openssl rand -base64 32

# Copy the output
# Paste as NEXTAUTH_SECRET in .env.local
```

---

## 📋 DATABASE COMMANDS REFERENCE

### **Essential Commands:**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (create tables)
npx prisma db push

# Open Prisma Studio (visual database editor)
npx prisma studio

# Run migrations
npx prisma migrate dev

# Seed database with initial data
npm run db:seed

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## 🎯 WHAT HAPPENS AFTER SETUP

Once database is set up, your platform will:
- ✅ Store user accounts (instead of mock data)
- ✅ Track real progress
- ✅ Save quiz scores
- ✅ Store certificates
- ✅ Enable authentication
- ✅ Persist all changes

---

## 🆘 TROUBLESHOOTING

### **Issue: Connection fails**
```bash
# Test connection manually
npx prisma db pull
```

**Common fixes:**
- Check password is correct (no special characters issues)
- Verify database is running (check Supabase dashboard)
- Check firewall/network settings
- Ensure connection string format is correct

### **Issue: Migrations fail**
```bash
# Reset and try again
npx prisma migrate reset
npx prisma db push
```

### **Issue: .env.local not loading**
```bash
# Restart dev server
pkill -f "next dev"
npm run dev
```

---

## ✅ VERIFICATION CHECKLIST

After setup, verify:
- [ ] Database created in Supabase/Neon
- [ ] Connection string added to .env.local
- [ ] Prisma generate completed
- [ ] Migrations run successfully
- [ ] Tables created (check Prisma Studio)
- [ ] Dev server restarted
- [ ] Can create test user

---

## 🎊 YOU'RE READY WHEN:

✅ Database URL in .env.local  
✅ Migrations completed  
✅ Tables visible in Prisma Studio  
✅ Dev server running  
✅ No connection errors  

**Then you can start using real data instead of mocks!**

---

*Setup Time: 30-45 minutes*  
*Cost: $0 (FREE tier)*  
*Recommended: Supabase*  
*Next Step: Test with real data*

