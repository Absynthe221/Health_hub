# Health Hub ECG Platform - Production Deployment Guide

## 🚀 **Complete Production Deployment Setup**

This guide provides step-by-step instructions for deploying the Health Hub ECG Platform to production.

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: 18.0.0 or higher
- **PostgreSQL**: 13.0 or higher
- **Redis**: 6.0 or higher (optional but recommended)
- **Python**: 3.8 or higher (for AI pipeline)
- **FFmpeg**: Latest version (for media processing)
- **Docker**: 20.0 or higher (optional)

### **External Services**
- **OpenAI API Key**: For AI-powered features
- **SMTP Server**: For email notifications
- **Domain Name**: For production URL
- **SSL Certificate**: For HTTPS

## 🛠️ **Step 1: Environment Setup**

### **1.1 Clone and Setup Repository**
```bash
git clone <your-repository-url>
cd Health_Hub
npm install
```

### **1.2 Configure API Keys**
```bash
# Run the interactive setup script
npm run setup:api-keys

# Or manually create .env.local with your configuration
cp .env.example .env.local
# Edit .env.local with your production values
```

### **1.3 Required Environment Variables**
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key"

# AI Services
OPENAI_API_KEY="your-openai-api-key"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Redis (Optional)
REDIS_URL="redis://host:port"
```

## 🗄️ **Step 2: Database Setup**

### **2.1 PostgreSQL Database**
```bash
# Create database
createdb healthhub_ecg

# Or using Docker
docker run --name healthhub-postgres \
  -e POSTGRES_DB=healthhub_ecg \
  -e POSTGRES_USER=healthhub \
  -e POSTGRES_PASSWORD=your-password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### **2.2 Database Migration**
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate:deploy

# Setup initial data
npm run db:setup
```

### **2.3 Verify Database**
```bash
# Check database connection
npx prisma db pull

# View database in Prisma Studio
npm run db:studio
```

## 🏗️ **Step 3: Build and Deploy**

### **3.1 Automated Deployment**
```bash
# Complete production deployment
npm run deploy:production

# Or step by step
npm run build
npm run db:migrate:deploy
npm run db:setup
npm start
```

### **3.2 Manual Deployment**
```bash
# Install dependencies
npm ci --production=false

# Build application
npm run build

# Start production server
npm start
```

## 🐳 **Step 4: Docker Deployment (Optional)**

### **4.1 Docker Build**
```bash
# Build production image
docker build -f Dockerfile.production -t healthhub-ecg:latest .

# Run container
docker run -d \
  --name healthhub-ecg \
  -p 3000:3000 \
  --env-file .env.local \
  healthhub-ecg:latest
```

### **4.2 Docker Compose**
```bash
# Create environment file
cp .env.example .env.production

# Edit with your production values
nano .env.production

# Deploy with Docker Compose
docker-compose -f docker-compose.production.yml up -d
```

## 🌐 **Step 5: Web Server Configuration**

### **5.1 Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy to Next.js
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
    
    # Static files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **5.2 PM2 Process Manager**
```bash
# Install PM2
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'healthhub-ecg',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 **Step 6: Production Optimization**

### **6.1 Performance Optimization**
```bash
# Enable compression
npm install compression

# Setup CDN (optional)
# Configure your CDN to serve static assets

# Database indexing
npx prisma db push
```

### **6.2 Monitoring Setup**
```bash
# Install monitoring tools
npm install @sentry/nextjs

# Configure logging
mkdir -p logs
chmod 755 logs
```

### **6.3 Backup Strategy**
```bash
# Database backup script
cat > backup-db.sh << EOF
#!/bin/bash
pg_dump healthhub_ecg > backup_$(date +%Y%m%d_%H%M%S).sql
EOF

chmod +x backup-db.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

## ✅ **Step 7: Verification**

### **7.1 Health Checks**
```bash
# Test application health
curl https://your-domain.com/api/health

# Test database connection
npm run db:studio

# Test AI services
curl -X POST https://your-domain.com/api/ai/generateQuiz \
  -H "Content-Type: application/json" \
  -d '{"slideContent":"test","questionCount":1}'
```

### **7.2 Performance Testing**
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# Monitor resource usage
htop
iostat -x 1
```

## 🔒 **Step 8: Security Hardening**

### **8.1 Security Checklist**
- [ ] SSL certificate installed and configured
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API keys secured and rotated
- [ ] Firewall configured
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting setup

### **8.2 Security Headers**
```javascript
// Add to next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];
```

## 📊 **Step 9: Monitoring & Maintenance**

### **9.1 Application Monitoring**
```bash
# Install monitoring tools
npm install @sentry/nextjs

# Configure error tracking
# Add to your application code
```

### **9.2 Log Management**
```bash
# Setup log rotation
cat > /etc/logrotate.d/healthhub << EOF
/path/to/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF
```

### **9.3 Regular Maintenance**
```bash
# Database maintenance
npm run db:migrate:deploy

# Update dependencies
npm audit
npm update

# Clear cache
npm run cache:clear
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check database status
systemctl status postgresql

# Test connection
psql -h localhost -U healthhub -d healthhub_ecg
```

#### **Build Failures**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### **AI Services Not Working**
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

## 📞 **Support**

### **Getting Help**
- Check the logs: `tail -f logs/app.log`
- Review deployment report: `cat deployment-report.json`
- Test health endpoint: `curl https://your-domain.com/api/health`

### **Performance Issues**
- Monitor resource usage
- Check database query performance
- Review application logs for errors
- Test AI service response times

---

## 🎉 **Deployment Complete!**

Your Health Hub ECG Platform is now ready for production use. Users can access the platform at `https://your-domain.com` and start their ECG learning journey.

### **Next Steps**
1. **User Onboarding**: Set up user registration and authentication
2. **Content Management**: Add more ECG modules and content
3. **Analytics**: Monitor user engagement and learning progress
4. **Scaling**: Optimize for increased user load
5. **Updates**: Keep the platform updated with new features

**🎯 Your world-class ECG learning platform is now live and ready to transform healthcare education!**

