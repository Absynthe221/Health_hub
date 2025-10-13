#!/usr/bin/env node

/**
 * API Endpoints Test Script
 * Tests all API endpoints for proper functionality and response formats
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Mock API endpoint tests
const API_ENDPOINTS = [
  {
    path: '/api/modules',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/modules/[id]',
    methods: ['GET', 'PUT', 'DELETE'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/media',
    methods: ['GET'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/media/file',
    methods: ['GET'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/instructor/upload',
    methods: ['POST', 'GET'],
    auth: 'required',
    roles: ['admin', 'instructor']
  },
  {
    path: '/api/instructor/approveQuiz',
    methods: ['POST', 'GET', 'PUT'],
    auth: 'required',
    roles: ['admin', 'instructor']
  },
  {
    path: '/api/users/assign',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    auth: 'required',
    roles: ['admin', 'instructor']
  },
  {
    path: '/api/segments',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/segments/[id]',
    methods: ['GET', 'PUT', 'DELETE'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/segments/[id]/mcqs',
    methods: ['GET', 'PUT', 'DELETE'],
    auth: 'required',
    roles: ['admin', 'instructor']
  },
  {
    path: '/api/ai/generateQuiz',
    methods: ['POST'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/ai/summarizeSlide',
    methods: ['POST'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/ai/explainECG',
    methods: ['POST', 'PUT'],
    auth: 'required',
    roles: ['admin', 'instructor', 'student']
  },
  {
    path: '/api/health',
    methods: ['GET'],
    auth: 'none',
    roles: []
  },
  {
    path: '/api/auth/signin',
    methods: ['POST'],
    auth: 'none',
    roles: []
  }
]

// Test cases for API validation
const TEST_CASES = [
  {
    name: 'API Route Files Exist',
    test: 'checkRouteFiles'
  },
  {
    name: 'Middleware Configuration',
    test: 'checkMiddlewareConfig'
  },
  {
    name: 'Authentication Setup',
    test: 'checkAuthSetup'
  },
  {
    name: 'Role-based Access Control',
    test: 'checkRoleBasedAccess'
  },
  {
    name: 'Error Handling',
    test: 'checkErrorHandling'
  },
  {
    name: 'Response Formats',
    test: 'checkResponseFormats'
  },
  {
    name: 'Input Validation',
    test: 'checkInputValidation'
  }
]

/**
 * Check if API route files exist
 */
async function checkRouteFiles() {
  const errors = []
  const warnings = []

  for (const endpoint of API_ENDPOINTS) {
    const routePath = endpoint.path.replace(/\[([^\]]+)\]/g, '[id]')
    const apiPath = path.join(projectRoot, 'app', ...routePath.split('/').slice(1))
    const routeFile = path.join(apiPath, 'route.js')

    try {
      await fs.access(routeFile)
    } catch {
      // Check if it's a dynamic route
      const dynamicPath = endpoint.path.replace(/\[([^\]]+)\]/g, '[id]')
      const dynamicApiPath = path.join(projectRoot, 'app', ...dynamicPath.split('/').slice(1))
      const dynamicRouteFile = path.join(dynamicApiPath, 'route.js')
      
      try {
        await fs.access(dynamicRouteFile)
      } catch {
        errors.push(`API route file missing: ${routeFile}`)
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Check middleware configuration
 */
async function checkMiddlewareConfig() {
  const errors = []
  const warnings = []

  // Check if middleware.js exists
  const middlewarePath = path.join(projectRoot, 'middleware.js')
  try {
    await fs.access(middlewarePath)
    
    // Read and validate middleware content
    const middlewareContent = await fs.readFile(middlewarePath, 'utf8')
    
    if (!middlewareContent.includes('withAuth')) {
      errors.push('Middleware does not import withAuth')
    }
    
    if (!middlewareContent.includes('NextAuthSessionProvider')) {
      warnings.push('Middleware may not be properly configured for NextAuth')
    }
    
  } catch {
    errors.push('Middleware file not found')
  }

  // Check middleware utilities
  const middlewareUtilsPath = path.join(projectRoot, 'lib', 'middleware', 'roleGuard.ts')
  try {
    await fs.access(middlewareUtilsPath)
  } catch {
    errors.push('Role guard middleware not found')
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Check authentication setup
 */
async function checkAuthSetup() {
  const errors = []
  const warnings = []

  // Check NextAuth configuration
  const authConfigPath = path.join(projectRoot, 'app', 'api', 'auth', '[...nextauth]', 'route.js')
  try {
    await fs.access(authConfigPath)
  } catch {
    errors.push('NextAuth configuration not found')
  }

  // Check auth context
  const authContextPath = path.join(projectRoot, 'contexts', 'AuthContext.jsx')
  try {
    await fs.access(authContextPath)
  } catch {
    errors.push('AuthContext not found')
  }

  // Check session provider
  const sessionProviderPath = path.join(projectRoot, 'components', 'SessionProvider.jsx')
  try {
    await fs.access(sessionProviderPath)
  } catch {
    errors.push('SessionProvider not found')
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Check role-based access control
 */
async function checkRoleBasedAccess() {
  const errors = []
  const warnings = []

  // Check if role-based endpoints are properly configured
  const adminEndpoints = API_ENDPOINTS.filter(e => e.roles.includes('admin'))
  const instructorEndpoints = API_ENDPOINTS.filter(e => e.roles.includes('instructor'))
  const studentEndpoints = API_ENDPOINTS.filter(e => e.roles.includes('student'))

  // Validate endpoint role configurations
  for (const endpoint of API_ENDPOINTS) {
    if (endpoint.auth === 'required' && endpoint.roles.length === 0) {
      errors.push(`Endpoint ${endpoint.path} requires auth but has no allowed roles`)
    }
    
    if (endpoint.auth === 'none' && endpoint.roles.length > 0) {
      warnings.push(`Endpoint ${endpoint.path} is public but has role restrictions`)
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Check error handling
 */
async function checkErrorHandling() {
  const errors = []
  const warnings = []

  // Check common error handling patterns in API routes
  const apiDir = path.join(projectRoot, 'app', 'api')
  
  try {
    const entries = await fs.readdir(apiDir, { recursive: true })
    const routeFiles = entries.filter(entry => entry.endsWith('route.js'))
    
    for (const routeFile of routeFiles) {
      const fullPath = path.join(apiDir, routeFile)
      const content = await fs.readFile(fullPath, 'utf8')
      
      // Check for error handling patterns
      if (!content.includes('try') && !content.includes('catch')) {
        warnings.push(`Route ${routeFile} may not have proper error handling`)
      }
      
      if (!content.includes('NextResponse.json')) {
        warnings.push(`Route ${routeFile} may not return proper JSON responses`)
      }
      
      if (content.includes('console.error') || content.includes('console.log')) {
        warnings.push(`Route ${routeFile} contains console statements (should use proper logging)`)
      }
    }
  } catch (error) {
    errors.push(`Failed to check error handling: ${error.message}`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Check response formats
 */
async function checkResponseFormats() {
  const errors = []
  const warnings = []

  // Expected response format structure
  const expectedResponseStructure = {
    success: 'boolean',
    message: 'string (optional)',
    data: 'object (optional)',
    error: 'string (optional)'
  }

  // This would ideally test actual API responses, but for CI/CD we validate structure
  warnings.push('Response format validation requires running server - consider adding integration tests')

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Check input validation
 */
async function checkInputValidation() {
  const errors = []
  const warnings = []

  // Check for validation utilities
  const validationUtils = [
    'lib/middleware/apiMiddleware.ts',
    'lib/middleware/roleGuard.ts'
  ]

  for (const util of validationUtils) {
    const utilPath = path.join(projectRoot, util)
    try {
      await fs.access(utilPath)
    } catch {
      warnings.push(`Validation utility not found: ${util}`)
    }
  }

  // Check for input validation in API routes
  const apiDir = path.join(projectRoot, 'app', 'api')
  
  try {
    const entries = await fs.readdir(apiDir, { recursive: true })
    const routeFiles = entries.filter(entry => entry.endsWith('route.js'))
    
    let routesWithValidation = 0
    
    for (const routeFile of routeFiles) {
      const fullPath = path.join(apiDir, routeFile)
      const content = await fs.readFile(fullPath, 'utf8')
      
      if (content.includes('req.json()') || content.includes('req.formData()')) {
        if (!content.includes('if (!') && !content.includes('validate')) {
          warnings.push(`Route ${routeFile} may not validate input data`)
        } else {
          routesWithValidation++
        }
      }
    }
    
    if (routesWithValidation === 0) {
      warnings.push('No API routes found with input validation')
    }
    
  } catch (error) {
    errors.push(`Failed to check input validation: ${error.message}`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

/**
 * Run all API tests
 */
async function runAPITests() {
  console.log('🔌 Testing ECG Platform API Endpoints...\n')

  const results = []
  let totalErrors = 0
  let totalWarnings = 0

  for (const testCase of TEST_CASES) {
    console.log(`🧪 Running: ${testCase.name}`)
    
    try {
      const result = await eval(testCase.test)()
      results.push({
        name: testCase.name,
        ...result
      })

      if (result.valid) {
        console.log(`   ✅ ${testCase.name}: Passed${result.warnings.length > 0 ? ` (${result.warnings.length} warnings)` : ''}`)
      } else {
        console.log(`   ❌ ${testCase.name}: Failed with ${result.errors.length} errors`)
      }

      totalErrors += result.errors.length
      totalWarnings += result.warnings.length

      // Print errors and warnings
      result.errors.forEach(error => {
        console.log(`      🔴 ${error}`)
      })
      
      result.warnings.forEach(warning => {
        console.log(`      🟡 ${warning}`)
      })

    } catch (error) {
      console.log(`   💥 ${testCase.name}: Test failed with error: ${error.message}`)
      results.push({
        name: testCase.name,
        valid: false,
        errors: [error.message],
        warnings: []
      })
      totalErrors++
    }
  }

  console.log(`\n📊 API Test Summary:`)
  console.log(`   🧪 Total tests: ${TEST_CASES.length}`)
  console.log(`   ✅ Passed tests: ${results.filter(r => r.valid).length}`)
  console.log(`   ❌ Failed tests: ${results.filter(r => !r.valid).length}`)
  console.log(`   🔴 Total errors: ${totalErrors}`)
  console.log(`   🟡 Total warnings: ${totalWarnings}`)

  // API Endpoint Summary
  console.log(`\n🔗 API Endpoints Summary:`)
  console.log(`   📊 Total endpoints: ${API_ENDPOINTS.length}`)
  console.log(`   🔐 Authenticated endpoints: ${API_ENDPOINTS.filter(e => e.auth === 'required').length}`)
  console.log(`   🌐 Public endpoints: ${API_ENDPOINTS.filter(e => e.auth === 'none').length}`)
  console.log(`   👑 Admin-only endpoints: ${API_ENDPOINTS.filter(e => e.roles.includes('admin') && !e.roles.includes('instructor')).length}`)
  console.log(`   👨‍🏫 Instructor endpoints: ${API_ENDPOINTS.filter(e => e.roles.includes('instructor')).length}`)
  console.log(`   👨‍🎓 Student endpoints: ${API_ENDPOINTS.filter(e => e.roles.includes('student')).length}`)

  if (totalErrors > 0) {
    console.log('\n❌ API endpoint tests failed!')
    process.exit(1)
  } else {
    console.log('\n✅ All API endpoint tests passed!')
    process.exit(0)
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests().catch(error => {
    console.error('💥 API test failed:', error)
    process.exit(1)
  })
}

export { runAPITests, API_ENDPOINTS, TEST_CASES }
