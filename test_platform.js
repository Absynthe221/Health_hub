#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Health Hub ECG Platform...\n');

// Test 1: Check if comprehensive modules file exists
console.log('1. Checking comprehensive modules file...');
const modulesPath = path.join(__dirname, 'data', 'ecg_modules_comprehensive.json');
if (fs.existsSync(modulesPath)) {
  const modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
  console.log(`   ✅ Found ${modules.length} modules`);
  
  // Check module structure
  const sampleModule = modules[0];
  const requiredFields = ['moduleId', 'title', 'description', 'slides', 'instructorName'];
  const hasAllFields = requiredFields.every(field => sampleModule.hasOwnProperty(field));
  
  if (hasAllFields) {
    console.log('   ✅ Module structure is valid');
  } else {
    console.log('   ❌ Module structure is invalid');
  }
} else {
  console.log('   ❌ Comprehensive modules file not found');
}

// Test 2: Check if student components exist
console.log('\n2. Checking student components...');
const studentComponents = [
  'components/student/ModuleCard.jsx',
  'components/student/ProgressTracker.jsx',
  'components/student/SlidePlayer.jsx'
];

studentComponents.forEach(component => {
  const componentPath = path.join(__dirname, component);
  if (fs.existsSync(componentPath)) {
    console.log(`   ✅ ${component} exists`);
  } else {
    console.log(`   ❌ ${component} missing`);
  }
});

// Test 3: Check if API endpoints exist
console.log('\n3. Checking API endpoints...');
const apiEndpoints = [
  'app/api/student/modules/route.js',
  'app/api/student/progress/route.js',
  'app/api/presentations/process/route.js',
  'app/api/modules/upload/route.js'
];

apiEndpoints.forEach(endpoint => {
  const endpointPath = path.join(__dirname, endpoint);
  if (fs.existsSync(endpointPath)) {
    console.log(`   ✅ ${endpoint} exists`);
  } else {
    console.log(`   ❌ ${endpoint} missing`);
  }
});

// Test 4: Check if pages exist
console.log('\n4. Checking pages...');
const pages = [
  'app/dashboard/learner/page.jsx',
  'app/dashboard/admin/page.jsx',
  'app/ecg-training/[moduleId]/page.jsx'
];

pages.forEach(page => {
  const pagePath = path.join(__dirname, page);
  if (fs.existsSync(pagePath)) {
    console.log(`   ✅ ${page} exists`);
  } else {
    console.log(`   ❌ ${page} missing`);
  }
});

// Test 5: Check if uploads directory exists
console.log('\n5. Checking uploads directory...');
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('   ✅ Uploads directory exists');
} else {
  console.log('   ❌ Uploads directory missing');
  // Create it
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('   ✅ Created uploads directory');
}

// Test 6: Check if data directory exists
console.log('\n6. Checking data directory...');
const dataDir = path.join(__dirname, 'data');
if (fs.existsSync(dataDir)) {
  console.log('   ✅ Data directory exists');
} else {
  console.log('   ❌ Data directory missing');
  // Create it
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('   ✅ Created data directory');
}

console.log('\n🎉 Platform test completed!');
console.log('\n📋 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Login as admin: admin@healthhub.com / password123');
console.log('3. Upload presentations in the Admin Dashboard');
console.log('4. Login as student: student@healthhub.com / password123');
console.log('5. View modules and presentations in the Student Dashboard');



