# Deployment Guide - Health Hub ECG

This guide covers deploying the Health Hub ECG learning platform to production environments.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment option with built-in Next.js optimization.

#### Prerequisites
- Vercel account
- GitHub repository
- PostgreSQL database (Supabase, Neon, or Railway)

#### Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_S3_BUCKET=your-bucket-name
   ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Preview deployments for pull requests

### Option 2: Railway

Railway provides full-stack deployment with database included.

#### Steps

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Add Database**
   - Add PostgreSQL service
   - Railway will provide `DATABASE_URL` automatically

3. **Configure Environment**
   ```env
   NEXTAUTH_URL=https://your-app.railway.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### Option 3: DigitalOcean App Platform

#### Steps

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Database**
   - Add PostgreSQL database
   - Set environment variables

3. **Deploy**
   - App Platform handles the deployment automatically

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Get Connection String**
   ```bash
   # From Supabase dashboard → Settings → Database
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

3. **Run Migrations**
   ```bash
   # In your deployment environment
   pnpm db:push
   pnpm db:seed
   ```

### Option 2: Neon

1. **Create Database**
   - Go to [neon.tech](https://neon.tech)
   - Create new project

2. **Get Connection String**
   ```bash
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb
   ```

### Option 3: Railway PostgreSQL

1. **Add Service**
   - In Railway dashboard
   - Add PostgreSQL service

2. **Connection**
   - Railway provides `DATABASE_URL` automatically

## 📁 File Storage Setup

### Option 1: AWS S3

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://health-hub-ecg-uploads
   ```

2. **Set CORS Policy**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://your-domain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Create IAM User**
   - Create user with S3 access
   - Attach policy for bucket access

### Option 2: Cloudinary

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)

2. **Get Credentials**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Option 3: Local Storage (Development Only)

For development, files are stored locally in `/uploads` directory.

## 🔐 Authentication Setup

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project

2. **Enable OAuth Consent Screen**
   - Go to APIs & Services → OAuth consent screen
   - Configure consent screen

3. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     ```
     https://your-domain.com/api/auth/callback/google
     ```

4. **Set Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## 🚀 Production Deployment Checklist

### Pre-deployment

- [ ] Set up production database
- [ ] Configure file storage (S3/Cloudinary)
- [ ] Set up Google OAuth
- [ ] Configure environment variables
- [ ] Set up domain and SSL
- [ ] Configure monitoring (Sentry, etc.)

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-secret-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=health-hub-ecg-uploads

# App Configuration
APP_URL=https://your-domain.com
APP_NAME=Health Hub ECG

# Security
JWT_SECRET=your-jwt-secret
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15

# Email (Optional)
EMAIL_FROM=noreply@your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

### Post-deployment

- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Test user registration/login
- [ ] Test ECG upload functionality
- [ ] Verify certificate generation
- [ ] Test quiz functionality
- [ ] Set up monitoring alerts
- [ ] Configure backup strategy

## 🔧 Deployment Scripts

### Automated Deployment Script

Create `scripts/deploy.sh`:

```bash
#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Seed database if needed
echo "🌱 Seeding database..."
npm run db:seed

# Test the build
echo "🧪 Running tests..."
npm run test

echo "✅ Deployment completed successfully!"
```

### Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/health_hub_ecg
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=health_hub_ecg
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Sentry** - Error tracking and performance monitoring
2. **Vercel Analytics** - Web vitals and performance metrics
3. **Google Analytics** - User behavior tracking
4. **Uptime Robot** - Uptime monitoring

### Sentry Setup

1. **Install Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

3. **Set Environment Variable**
   ```env
   SENTRY_DSN=your-sentry-dsn
   ```

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:

- **Linting and Formatting**: Code quality checks
- **Testing**: Unit, integration, and E2E tests
- **Security Scanning**: Vulnerability scanning
- **Building**: Production build verification
- **Deployment**: Automatic deployment to staging/production

### Required Secrets

Add these secrets to your GitHub repository:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
SLACK_WEBHOOK_URL=your-slack-webhook-url
```

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
psql $DATABASE_URL

# Reset database
npx prisma db push --force-reset
npx prisma db seed
```

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

#### File Upload Issues
- Check S3 bucket permissions
- Verify CORS configuration
- Check file size limits

#### Authentication Issues
- Verify Google OAuth configuration
- Check redirect URIs
- Verify environment variables

### Performance Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
   };
   ```

2. **Optimize Images**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-domain.com'],
       formats: ['image/webp', 'image/avif'],
     },
   };
   ```

3. **Database Optimization**
   - Add database indexes
   - Use connection pooling
   - Enable query caching

## 📞 Support

For deployment issues:

1. Check the logs in your hosting platform
2. Review environment variables
3. Test locally with production settings
4. Create a GitHub issue with deployment logs

---

**Happy Deploying! 🚀**

