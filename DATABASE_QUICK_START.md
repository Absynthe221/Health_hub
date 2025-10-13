# 🚀 DATABASE QUICK START GUIDE

## ⚡ 3-Minute Setup

### **Step 1: Get Supabase Database (Free)**
```
1. Visit: https://supabase.com
2. Sign up with GitHub
3. Create new project: "healthhub-ecg"
4. Wait 2 minutes for provisioning
5. Go to Settings → Database → Connection String (URI)
6. Copy the connection string
```

### **Step 2: Configure Environment**
```bash
# Create/edit .env.local
echo 'DATABASE_URL="YOUR_SUPABASE_CONNECTION_STRING"' >> .env.local
echo 'NEXTAUTH_SECRET="'$(openssl rand -base64 32)'"' >> .env.local
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local
```

### **Step 3: Run Setup**
```bash
npm run db:setup
```

That's it! ✅

---

## 📝 Manual Setup (if script fails)

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema to database
npx prisma db push

# 3. Seed with data
npm run db:seed

# 4. Verify
npm run db:verify
```

---

## 🎯 Test Your Database

### **View Data Visually**
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### **Test API Endpoints**
```bash
# Get all modules
curl http://localhost:3000/api/db/modules

# Get all users
curl http://localhost:3000/api/db/users
```

### **Login with Default Users**
- **Admin:** admin@healthhub.com / password123
- **Instructor:** instructor@healthhub.com / password123
- **Learner:** learner@healthhub.com / password123

---

## 📊 What You Get

After setup, your database will have:
- ✅ **3 users** (admin, instructor, learner)
- ✅ **173 slides** (from 2 modules)
- ✅ **Sample progress data**
- ✅ **27 database tables** (all relationships configured)
- ✅ **9 API endpoints** (ready to use)

---

## 🔧 Common Commands

```bash
# View database schema
npx prisma studio

# Verify database
npm run db:verify

# Re-seed database (clears existing data)
npm run db:seed

# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema changes
npx prisma db push
```

---

## 🆘 Troubleshooting

**"DATABASE_URL not found"**
→ Add to `.env.local`

**"Connection failed"**
→ Check Supabase connection string format:
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**"Module JSON not found"**
→ Ensure `public/modules/module-1-basic-ecg-interpretations/module.json` exists

**"bcryptjs error"**
→ Run: `npm install bcryptjs`

---

## 📚 Full Documentation

- **Complete Setup:** `DATABASE_SETUP_COMPLETE.md`
- **API Reference:** `app/api/db/README.md`
- **Implementation Details:** `DATABASE_IMPLEMENTATION_SUMMARY.md`

---

## 🎊 Success Indicators

You'll know setup worked when:
- ✅ `npm run db:verify` shows 3 users, 173 slides
- ✅ Prisma Studio opens and shows data
- ✅ `curl http://localhost:3000/api/db/modules` returns JSON
- ✅ You can login with default credentials

---

**Total Time:** 25 minutes  
**Difficulty:** Easy  
**Prerequisites:** Node.js installed

🚀 **Let's get started!**

