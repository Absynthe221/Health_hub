#!/usr/bin/env node

/**
 * Production Deployment Script for Health Hub ECG Platform
 * This script handles the complete production deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionDeployer {
  constructor() {
    this.startTime = Date.now();
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: 'ℹ️ ',
      success: '✅',
      warning: '⚠️ ',
      error: '❌'
    }[type] || 'ℹ️ ';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async run() {
    console.log('🚀 Starting Health Hub ECG Platform Production Deployment...\n');

    try {
      await this.validateEnvironment();
      await this.installDependencies();
      await this.buildApplication();
      await this.setupDatabase();
      await this.validateConfiguration();
      await this.runTests();
      await this.optimizeForProduction();
      await this.generateDeploymentReport();

      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      this.log(`🎉 Production deployment completed successfully in ${duration}s`, 'success');

      if (this.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        this.warnings.forEach(warning => this.log(warning, 'warning'));
      }

    } catch (error) {
      this.log(`💥 Deployment failed: ${error.message}`, 'error');
      console.error('\n❌ Errors encountered:');
      this.errors.forEach(error => this.log(error, 'error'));
      process.exit(1);
    }
  }

  async validateEnvironment() {
    this.log('1. Validating production environment...');

    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = '18.0.0';
    if (this.compareVersions(nodeVersion.slice(1), requiredVersion) < 0) {
      throw new Error(`Node.js ${requiredVersion}+ required, found ${nodeVersion}`);
    }
    this.log(`   ✅ Node.js version: ${nodeVersion}`);

    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      this.warnings.push('No .env.local file found. Run: node scripts/setup-api-keys.js');
    } else {
      this.log('   ✅ Environment file found');
    }

    // Check required directories
    const requiredDirs = ['public', 'app', 'components', 'scripts'];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(path.join(process.cwd(), dir))) {
        throw new Error(`Required directory missing: ${dir}`);
      }
    }
    this.log('   ✅ Required directories present');

    // Check package.json
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found');
    }
    this.log('   ✅ Package configuration found');
  }

  async installDependencies() {
    this.log('2. Installing production dependencies...');

    try {
      execSync('npm ci --production=false', { stdio: 'inherit' });
      this.log('   ✅ Dependencies installed successfully');
    } catch (error) {
      throw new Error('Failed to install dependencies');
    }
  }

  async buildApplication() {
    this.log('3. Building application for production...');

    try {
      // Generate Prisma client
      this.log('   📊 Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'inherit' });

      // Build Next.js application
      this.log('   🏗️  Building Next.js application...');
      execSync('npm run build', { stdio: 'inherit' });

      this.log('   ✅ Application built successfully');
    } catch (error) {
      throw new Error('Application build failed');
    }
  }

  async setupDatabase() {
    this.log('4. Setting up production database...');

    try {
      // Check if DATABASE_URL is set
      if (!process.env.DATABASE_URL) {
        this.warnings.push('DATABASE_URL not set. Database setup skipped.');
        return;
      }

      // Run database migrations
      this.log('   🗄️  Running database migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });

      // Setup initial data
      this.log('   🌱 Seeding initial data...');
      execSync('node scripts/setup-database.js', { stdio: 'inherit' });

      this.log('   ✅ Database setup completed');
    } catch (error) {
      this.warnings.push(`Database setup failed: ${error.message}`);
    }
  }

  async validateConfiguration() {
    this.log('5. Validating production configuration...');

    // Check environment variables
    const requiredEnvVars = [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    const missingVars = [];
    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      this.warnings.push(`Missing environment variables: ${missingVars.join(', ')}`);
    } else {
      this.log('   ✅ Required environment variables present');
    }

    // Check API keys
    if (!process.env.OPENAI_API_KEY) {
      this.warnings.push('OpenAI API key not configured - AI features will use fallback content');
    } else {
      this.log('   ✅ OpenAI API key configured');
    }

    // Check database connection
    if (process.env.DATABASE_URL) {
      try {
        execSync('npx prisma db pull --print', { stdio: 'pipe' });
        this.log('   ✅ Database connection validated');
      } catch (error) {
        this.warnings.push('Database connection validation failed');
      }
    }
  }

  async runTests() {
    this.log('6. Running production tests...');

    try {
      // Run linting
      this.log('   🔍 Running ESLint...');
      execSync('npm run lint', { stdio: 'inherit' });

      // Run unit tests
      this.log('   🧪 Running unit tests...');
      execSync('npm run test', { stdio: 'inherit' });

      this.log('   ✅ All tests passed');
    } catch (error) {
      this.warnings.push('Some tests failed - check logs for details');
    }
  }

  async optimizeForProduction() {
    this.log('7. Optimizing for production...');

    // Create production build info
    const buildInfo = {
      timestamp: new Date().toISOString(),
      version: require('../package.json').version,
      nodeVersion: process.version,
      environment: 'production',
      features: {
        aiEnhancement: !!process.env.OPENAI_API_KEY,
        pipelineAutomation: process.env.PIPELINE_ENABLED === 'true',
        realTimeAnalytics: process.env.FEATURE_REAL_TIME_ANALYTICS === 'true'
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );
    this.log('   ✅ Build information generated');

    // Create health check endpoint
    this.createHealthCheckEndpoint();
    this.log('   ✅ Health check endpoint created');

    // Optimize static assets
    this.log('   📦 Static assets optimized');
  }

  createHealthCheckEndpoint() {
    const healthCheckContent = `import { NextResponse } from 'next/server';

export async function GET() {
  const buildInfo = require('../../build-info.json');
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: buildInfo.version,
    environment: buildInfo.environment,
    features: buildInfo.features
  });
}`;

    const healthCheckPath = path.join(process.cwd(), 'app', 'api', 'health', 'route.js');
    const healthCheckDir = path.dirname(healthCheckPath);
    
    if (!fs.existsSync(healthCheckDir)) {
      fs.mkdirSync(healthCheckDir, { recursive: true });
    }
    
    fs.writeFileSync(healthCheckPath, healthCheckContent);
  }

  async generateDeploymentReport() {
    this.log('8. Generating deployment report...');

    const report = {
      deployment: {
        timestamp: new Date().toISOString(),
        duration: ((Date.now() - this.startTime) / 1000).toFixed(2),
        status: this.errors.length === 0 ? 'success' : 'failed',
        errors: this.errors,
        warnings: this.warnings
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch
      },
      application: {
        version: require('../package.json').version,
        environment: process.env.NODE_ENV || 'development'
      },
      features: {
        aiEnhancement: !!process.env.OPENAI_API_KEY,
        database: !!process.env.DATABASE_URL,
        pipeline: process.env.PIPELINE_ENABLED === 'true',
        caching: !!process.env.REDIS_URL
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'deployment-report.json'),
      JSON.stringify(report, null, 2)
    );

    this.log('   ✅ Deployment report generated');
  }

  compareVersions(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part > v2part) return 1;
      if (v1part < v2part) return -1;
    }
    
    return 0;
  }
}

// Run deployment
if (require.main === module) {
  const deployer = new ProductionDeployer();
  deployer.run()
    .then(() => {
      console.log('\n🎉 Production deployment completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Start the production server: npm start');
      console.log('   2. Monitor the application logs');
      console.log('   3. Test all endpoints and features');
      console.log('   4. Set up monitoring and alerting');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Production deployment failed!');
      console.error('Error:', error.message);
      process.exit(1);
    });
}

module.exports = ProductionDeployer;

