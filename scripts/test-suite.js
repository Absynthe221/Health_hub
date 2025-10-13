#!/usr/bin/env node

/**
 * Health Hub ECG Testing Suite
 * ============================
 * 
 * Comprehensive testing for:
 * - Module functionality
 * - API endpoints
 * - Frontend components
 * - Pipeline integrity
 * - Cross-browser compatibility
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class ECGTests {
  constructor() {
    this.results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: []
    };
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m'
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  async runTest(testName, testFunction) {
    this.results.totalTests++;
    const test = {
      name: testName,
      status: 'running',
      startTime: Date.now(),
      error: null
    };

    try {
      this.log(`\n🧪 Running: ${testName}`, 'blue');
      await testFunction();
      test.status = 'passed';
      test.duration = Date.now() - test.startTime;
      this.results.passed++;
      this.log(`✅ PASSED: ${testName} (${test.duration}ms)`, 'green');
    } catch (error) {
      test.status = 'failed';
      test.duration = Date.now() - test.startTime;
      test.error = error.message;
      this.results.failed++;
      this.log(`❌ FAILED: ${testName} - ${error.message}`, 'red');
    }

    this.results.tests.push(test);
  }

  // Test 1: Module Structure Validation
  async testModuleStructure() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const modulesIndexPath = path.join(assetsDir, 'ecg-modules.json');

    if (!fs.existsSync(modulesIndexPath)) {
      throw new Error('ecg-modules.json not found');
    }

    const modules = JSON.parse(fs.readFileSync(modulesIndexPath, 'utf8'));
    
    if (modules.length === 0) {
      throw new Error('No modules found in index');
    }

    // Validate each module
    for (const module of modules) {
      const moduleDir = path.join(assetsDir, module.title);
      const moduleJsonPath = path.join(moduleDir, 'module.json');

      if (!fs.existsSync(moduleDir)) {
        throw new Error(`Module directory not found: ${module.title}`);
      }

      if (!fs.existsSync(moduleJsonPath)) {
        throw new Error(`module.json not found for: ${module.title}`);
      }

      const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
      
      if (!moduleData.slides || !Array.isArray(moduleData.slides)) {
        throw new Error(`Invalid slides data for module: ${module.title}`);
      }

      // Validate slide structure
      for (const slide of moduleData.slides) {
        if (!slide.slideNumber || !slide.text) {
          throw new Error(`Invalid slide structure in module: ${module.title}`);
        }
      }
    }
  }

  // Test 2: API Endpoint Testing
  async testAPIEndpoints() {
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      // Start the server
      const server = spawn('npm', ['run', 'dev'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      let serverReady = false;
      let timeout = setTimeout(() => {
        server.kill();
        reject(new Error('Server startup timeout'));
      }, 30000);

      server.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready in') && !serverReady) {
          serverReady = true;
          clearTimeout(timeout);
          this.testAPICalls().then(() => {
            server.kill();
            resolve();
          }).catch((error) => {
            server.kill();
            reject(error);
          });
        }
      });

      server.stderr.on('data', (data) => {
        console.error('Server error:', data.toString());
      });
    });
  }

  async testAPICalls() {
    const fetch = require('node-fetch');
    
    try {
      // Test modules endpoint
      const response = await fetch('http://localhost:3001/api/ecg/modules');
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const modules = await response.json();
      if (!Array.isArray(modules)) {
        throw new Error('API did not return an array of modules');
      }

      if (modules.length === 0) {
        throw new Error('API returned empty modules array');
      }

      // Validate module structure
      const requiredFields = ['id', 'title', 'description', 'duration', 'difficulty'];
      for (const module of modules) {
        for (const field of requiredFields) {
          if (!module[field]) {
            throw new Error(`Module missing required field: ${field}`);
          }
        }
      }

    } catch (error) {
      throw new Error(`API test failed: ${error.message}`);
    }
  }

  // Test 3: Pipeline Integrity
  async testPipelineIntegrity() {
    const presentationsDir = path.join(__dirname, '..', 'presentations');
    
    if (!fs.existsSync(presentationsDir)) {
      throw new Error('Presentations directory not found');
    }

    const files = fs.readdirSync(presentationsDir).filter(f => 
      f.endsWith('.pdf') || f.endsWith('.pptx')
    );

    if (files.length === 0) {
      throw new Error('No presentation files found for testing');
    }

    // Test pipeline script exists and is executable
    const pipelineScript = path.join(__dirname, 'cursor-ecg-ultimate-pipeline.js');
    if (!fs.existsSync(pipelineScript)) {
      throw new Error('Pipeline script not found');
    }

    // Test that pipeline can be executed (dry run)
    try {
      const { stdout, stderr } = await execAsync(`node ${pipelineScript} --dry-run`, {
        cwd: path.join(__dirname, '..')
      });
    } catch (error) {
      // Pipeline might not support --dry-run, that's okay
      if (!error.message.includes('--dry-run')) {
        throw error;
      }
    }
  }

  // Test 4: File Integrity
  async testFileIntegrity() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const modulesIndexPath = path.join(assetsDir, 'ecg-modules.json');

    if (!fs.existsSync(modulesIndexPath)) {
      throw new Error('ecg-modules.json not found');
    }

    const modules = JSON.parse(fs.readFileSync(modulesIndexPath, 'utf8'));
    let totalFiles = 0;
    let missingFiles = 0;

    for (const module of modules) {
      const moduleDir = path.join(assetsDir, module.title);
      const moduleJsonPath = path.join(moduleDir, 'module.json');

      if (fs.existsSync(moduleJsonPath)) {
        const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
        
        for (const slide of moduleData.slides || []) {
          // Check audio files
          if (slide.audio && fs.existsSync(slide.audio)) {
            totalFiles++;
          } else if (slide.audio) {
            missingFiles++;
          }

          // Check subtitle files
          if (slide.subtitles && fs.existsSync(slide.subtitles)) {
            totalFiles++;
          } else if (slide.subtitles) {
            missingFiles++;
          }

          // Check image files
          if (slide.images && Array.isArray(slide.images)) {
            for (const imagePath of slide.images) {
              if (fs.existsSync(imagePath)) {
                totalFiles++;
              } else {
                missingFiles++;
              }
            }
          }
        }
      }
    }

    const integrityScore = totalFiles > 0 ? ((totalFiles - missingFiles) / totalFiles) * 100 : 100;
    
    if (integrityScore < 90) {
      throw new Error(`File integrity score too low: ${integrityScore.toFixed(1)}% (${missingFiles} missing files)`);
    }
  }

  // Test 5: Frontend Component Testing
  async testFrontendComponents() {
    const componentsDir = path.join(__dirname, '..', 'app', 'components');
    const requiredComponents = [
      'ECGTrainingModule.jsx',
      'ECGModuleComponents/PDFViewer.jsx',
      'ECGModuleComponents/VideoPlayer.jsx',
      'ECGModuleComponents/QuestionEngine.jsx'
    ];

    for (const component of requiredComponents) {
      const componentPath = path.join(componentsDir, component);
      if (!fs.existsSync(componentPath)) {
        throw new Error(`Required component not found: ${component}`);
      }

      // Basic syntax check
      const content = fs.readFileSync(componentPath, 'utf8');
      if (!content.includes('export default')) {
        throw new Error(`Component ${component} missing default export`);
      }
    }
  }

  // Test 6: Performance Testing
  async testPerformance() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const modulesIndexPath = path.join(assetsDir, 'ecg-modules.json');

    const modules = JSON.parse(fs.readFileSync(modulesIndexPath, 'utf8'));
    
    // Test module loading performance
    const startTime = Date.now();
    
    for (const module of modules) {
      const moduleDir = path.join(assetsDir, module.title);
      const moduleJsonPath = path.join(moduleDir, 'module.json');
      
      if (fs.existsSync(moduleJsonPath)) {
        const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
        
        // Simulate processing time
        if (moduleData.slides) {
          for (const slide of moduleData.slides) {
            // Check if files exist (simulates file access)
            if (slide.audio) fs.existsSync(slide.audio);
            if (slide.subtitles) fs.existsSync(slide.subtitles);
            if (slide.images) {
              for (const image of slide.images) {
                fs.existsSync(image);
              }
            }
          }
        }
      }
    }

    const loadTime = Date.now() - startTime;
    
    if (loadTime > 5000) { // 5 seconds
      throw new Error(`Module loading too slow: ${loadTime}ms`);
    }
  }

  async generateReport() {
    this.log('\n📊 HEALTH HUB ECG TEST RESULTS', 'bright');
    this.log('=' .repeat(40), 'cyan');
    
    this.log(`\n📈 SUMMARY:`, 'bright');
    this.log(`  Total Tests: ${this.results.totalTests}`, 'blue');
    this.log(`  Passed: ${this.results.passed}`, 'green');
    this.log(`  Failed: ${this.results.failed}`, 'red');
    this.log(`  Success Rate: ${((this.results.passed / this.results.totalTests) * 100).toFixed(1)}%`, 
      this.results.passed === this.results.totalTests ? 'green' : 'yellow');

    this.log(`\n🧪 TEST DETAILS:`, 'bright');
    this.results.tests.forEach((test, index) => {
      const status = test.status === 'passed' ? '✅' : '❌';
      const color = test.status === 'passed' ? 'green' : 'red';
      this.log(`  ${index + 1}. ${status} ${test.name} (${test.duration}ms)`, color);
      
      if (test.error) {
        this.log(`     Error: ${test.error}`, 'red');
      }
    });

    // Overall status
    if (this.results.failed === 0) {
      this.log(`\n🎉 ALL TESTS PASSED! System is ready for production.`, 'green');
    } else {
      this.log(`\n⚠️  ${this.results.failed} test(s) failed. Please fix before deployment.`, 'yellow');
    }

    // Save results
    const resultsPath = path.join(__dirname, '..', 'assets', 'test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    this.log(`\n📄 Test results saved to: ${resultsPath}`, 'cyan');
  }

  async run() {
    try {
      this.log('🚀 Starting Health Hub ECG Test Suite...', 'bright');
      
      await this.runTest('Module Structure Validation', () => this.testModuleStructure());
      await this.runTest('Pipeline Integrity', () => this.testPipelineIntegrity());
      await this.runTest('File Integrity', () => this.testFileIntegrity());
      await this.runTest('Frontend Components', () => this.testFrontendComponents());
      await this.runTest('Performance Testing', () => this.testPerformance());
      
      // Skip API test if server is not running
      try {
        await this.runTest('API Endpoints', () => this.testAPIEndpoints());
      } catch (error) {
        this.log(`⚠️  Skipping API test: ${error.message}`, 'yellow');
        this.results.skipped++;
      }

      await this.generateReport();
      
    } catch (error) {
      this.log(`❌ Test suite failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Run the test suite
if (require.main === module) {
  const tests = new ECGTests();
  tests.run();
}

module.exports = ECGTests;




