#!/bin/bash

echo "🗄️  Health Hub - Database Setup Script"
echo "======================================"
echo ""

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=" .env.local 2>/dev/null; then
    echo "✅ DATABASE_URL found in .env.local"
else
    echo "❌ DATABASE_URL not found in .env.local"
    echo ""
    echo "Please add your database connection string:"
    echo "1. Get from Supabase: https://supabase.com"
    echo "2. Add to .env.local:"
    echo '   DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"'
    echo ""
    exit 1
fi

# Check if NEXTAUTH_SECRET is set
if grep -q "NEXTAUTH_SECRET=" .env.local 2>/dev/null; then
    echo "✅ NEXTAUTH_SECRET found"
else
    echo "⚠️  NEXTAUTH_SECRET not found"
    echo "Generating one for you..."
    SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env.local
    echo "✅ Added NEXTAUTH_SECRET to .env.local"
fi

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🔧 Step 2: Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Step 3: Pushing schema to database..."
npx prisma db push

echo ""
echo "🌱 Step 4: Seeding database with initial data..."
npm run db:seed

echo ""
echo "✅ Step 5: Verifying setup..."
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.count().then(count => { console.log('✅ Database connected! Users in database:', count); prisma.\$disconnect(); }).catch(err => { console.error('❌ Connection failed:', err.message); process.exit(1); });"

echo ""
echo "======================================"
echo "🎊 DATABASE SETUP COMPLETE!"
echo "======================================"
echo ""
echo "📊 Your database now has:"
echo "   - 3 users (admin, instructor, learner)"
echo "   - 173 slides from 2 modules"
echo "   - Sample progress data"
echo ""
echo "🌐 Open Prisma Studio to view data:"
echo "   npx prisma studio"
echo ""
echo "🚀 Restart your dev server:"
echo "   npm run dev"
echo ""

