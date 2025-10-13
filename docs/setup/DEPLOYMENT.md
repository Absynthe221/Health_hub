# Health Hub ECG Training Platform - Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment Testing

1. **Module Inventory & Validation**
   ```bash
   npm run inventory
   npm run validate
   npm run test-pipeline
   ```

2. **Full Test Suite**
   ```bash
   npm run test-all
   ```

3. **Production Readiness Check**
   ```bash
   npm run production-ready
   ```

### Deployment Options

## Option 1: Vercel (Recommended)

### Prerequisites
- Vercel account
- GitHub repository connected
- Environment variables configured

### Steps
1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```

3. **Deploy**
   ```bash
   npm run deploy:vercel
   ```

### Vercel Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

## Option 2: Docker Deployment

### Prerequisites
- Docker installed
- Docker Hub account (optional)

### Steps
1. **Build Docker Image**
   ```bash
   npm run deploy:docker
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e OPENAI_API_KEY=your_key \
     -e NEXTAUTH_SECRET=your_secret \
     health-hub-ecg
   ```

3. **Docker Compose (Production)**
   ```yaml
   version: '3.8'
   services:
     health-hub:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - OPENAI_API_KEY=${OPENAI_API_KEY}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
       volumes:
         - ./assets:/app/assets
       restart: unless-stopped
   ```

## Option 3: Traditional Server Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Node.js 20+
- Nginx
- PM2

### Steps
1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/health-hub-ecg.git
   cd health-hub-ecg
   
   # Install dependencies
   npm ci --production
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "health-hub" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Variables

### Required
```bash
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Optional
```bash
OPENAI_API_KEY=your-openai-key
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
```

## Health Monitoring

### Health Check Endpoint
```bash
curl https://your-domain.com/api/health
```

### Expected Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "server": "ok",
    "database": "ok",
    "assets": "ok",
    "modules": "ok (11 modules)"
  }
}
```

## CI/CD Pipeline

### GitHub Actions
The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and includes:

1. **Code Quality Checks**
   - ESLint
   - Prettier
   - TypeScript checking

2. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests
   - Module validation

3. **Security**
   - Dependency audit
   - Snyk security scan

4. **Performance**
   - Lighthouse CI
   - Build optimization

5. **Deployment**
   - Automatic deployment to production
   - Docker image building
   - Health checks

### Manual Deployment
```bash
# Run full test suite
npm run test-all

# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Or build Docker image
npm run deploy:docker
```

## Monitoring & Maintenance

### Logs
```bash
# PM2 logs
pm2 logs health-hub

# Docker logs
docker logs health-hub-ecg

# Vercel logs
vercel logs
```

### Performance Monitoring
- Use Vercel Analytics (if using Vercel)
- Set up Google Analytics
- Monitor API response times
- Track module completion rates

### Backup Strategy
1. **Code**: Git repository
2. **Assets**: Regular backup of `/assets` directory
3. **Database**: Automated backups (if using database)
4. **Environment**: Document all environment variables

## Troubleshooting

### Common Issues

1. **Module Loading Issues**
   ```bash
   # Check module inventory
   npm run inventory
   
   # Validate data structure
   npm run validate
   ```

2. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API Errors**
   ```bash
   # Check health endpoint
   curl http://localhost:3000/api/health
   
   # Check logs
   pm2 logs health-hub
   ```

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - Compress images

2. **Caching**
   - Enable CDN caching
   - Implement Redis caching
   - Use Next.js ISR

3. **Database Optimization**
   - Index frequently queried fields
   - Use connection pooling
   - Implement query optimization

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Input validation implemented
- [ ] Authentication secured
- [ ] Dependencies updated
- [ ] Security headers configured
- [ ] Rate limiting implemented

## Support

For deployment issues:
1. Check the logs
2. Run health checks
3. Verify environment variables
4. Check GitHub Actions status
5. Review this documentation

## Version History

- v1.0.0 - Initial production release
- v1.1.0 - Added comprehensive testing suite
- v1.2.0 - Implemented CI/CD pipeline
- v1.3.0 - Added Docker support




