import fs from 'fs'
import path from 'path'

describe('JSON Data Validation', () => {
  const dataDir = path.join(process.cwd(), 'data')
  
  describe('learners.json', () => {
    let learners
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'learners.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      learners = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(learners)).toBe(true)
      expect(learners.length).toBeGreaterThan(0)
    })

    test('should have required keys for each learner', () => {
      learners.forEach(learner => {
        expect(learner).toHaveProperty('id')
        expect(learner).toHaveProperty('name')
        expect(learner).toHaveProperty('enrolledCourses')
        expect(Array.isArray(learner.enrolledCourses)).toBe(true)
      })
    })

    test('should have valid learner data structure', () => {
      const learner = learners[0]
      expect(typeof learner.id).toBe('string')
      expect(typeof learner.name).toBe('string')
      expect(typeof learner.email).toBe('string')
      expect(typeof learner.role).toBe('string')
      expect(typeof learner.progress).toBe('object')
      expect(Array.isArray(learner.badges)).toBe(true)
      expect(Array.isArray(learner.quizScores)).toBe(true)
    })
  })

  describe('instructors.json', () => {
    let instructors
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'instructors.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      instructors = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(instructors)).toBe(true)
      expect(instructors.length).toBeGreaterThan(0)
    })

    test('should have required keys for each instructor', () => {
      instructors.forEach(instructor => {
        expect(instructor).toHaveProperty('id')
        expect(instructor).toHaveProperty('name')
        expect(instructor).toHaveProperty('coursesCreated')
        expect(Array.isArray(instructor.coursesCreated)).toBe(true)
      })
    })
  })

  describe('courses.json', () => {
    let courses
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'courses.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      courses = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(courses)).toBe(true)
      expect(courses.length).toBeGreaterThan(0)
    })

    test('should have required keys for each course', () => {
      courses.forEach(course => {
        expect(course).toHaveProperty('id')
        expect(course).toHaveProperty('title')
        expect(course).toHaveProperty('description')
        expect(course).toHaveProperty('modules')
        expect(Array.isArray(course.modules)).toBe(true)
      })
    })
  })

  describe('reports.json', () => {
    let reports
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'reports.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      reports = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(typeof reports).toBe('object')
    })

    test('should have required analytics structure', () => {
      expect(reports).toHaveProperty('activeUsers')
      expect(reports).toHaveProperty('roleDistribution')
      expect(reports).toHaveProperty('courseCompletionRates')
      expect(reports).toHaveProperty('quizPassRates')
      expect(typeof reports.activeUsers).toBe('number')
      expect(typeof reports.roleDistribution).toBe('object')
      expect(Array.isArray(reports.courseCompletionRates)).toBe(true)
      expect(Array.isArray(reports.quizPassRates)).toBe(true)
    })
  })

  describe('leaderboard.json', () => {
    let leaderboard
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'leaderboard.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      leaderboard = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(leaderboard)).toBe(true)
      expect(leaderboard.length).toBeGreaterThan(0)
    })

    test('should have required keys for each entry', () => {
      leaderboard.forEach(entry => {
        expect(entry).toHaveProperty('learnerId')
        expect(entry).toHaveProperty('points')
        expect(entry).toHaveProperty('rank')
        expect(entry).toHaveProperty('name')
        expect(typeof entry.learnerId).toBe('string')
        expect(typeof entry.points).toBe('number')
        expect(typeof entry.rank).toBe('number')
        expect(typeof entry.name).toBe('string')
      })
    })
  })

  describe('notifications.json', () => {
    let notifications
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'notifications.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      notifications = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(notifications)).toBe(true)
      expect(notifications.length).toBeGreaterThan(0)
    })

    test('should have required keys for each notification', () => {
      notifications.forEach(notification => {
        expect(notification).toHaveProperty('id')
        expect(notification).toHaveProperty('message')
        expect(notification).toHaveProperty('readStatus')
        expect(typeof notification.id).toBe('string')
        expect(typeof notification.message).toBe('string')
        expect(typeof notification.readStatus).toBe('boolean')
      })
    })
  })

  describe('ecg-exercises.json', () => {
    let exercises
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'ecg-exercises.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      exercises = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(exercises)).toBe(true)
      expect(exercises.length).toBeGreaterThan(0)
    })

    test('should have required keys for each exercise', () => {
      exercises.forEach(exercise => {
        expect(exercise).toHaveProperty('id')
        expect(exercise).toHaveProperty('title')
        expect(exercise).toHaveProperty('description')
        expect(exercise).toHaveProperty('solution')
        expect(typeof exercise.id).toBe('string')
        expect(typeof exercise.title).toBe('string')
        expect(typeof exercise.description).toBe('string')
        expect(typeof exercise.solution).toBe('string')
      })
    })
  })

  describe('homepage-cta.json', () => {
    let ctaData
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'homepage-cta.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      ctaData = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(typeof ctaData).toBe('object')
    })

    test('should have required CTA structure', () => {
      expect(ctaData).toHaveProperty('primaryCTA')
      expect(ctaData).toHaveProperty('secondaryCTA')
      expect(ctaData).toHaveProperty('headerButtons')
      expect(ctaData).toHaveProperty('heroCTA')
      
      expect(typeof ctaData.primaryCTA.text).toBe('string')
      expect(typeof ctaData.primaryCTA.link).toBe('string')
      expect(typeof ctaData.primaryCTA.style).toBe('string')
      
      expect(Array.isArray(ctaData.headerButtons)).toBe(true)
      ctaData.headerButtons.forEach(button => {
        expect(button).toHaveProperty('text')
        expect(button).toHaveProperty('link')
        expect(button).toHaveProperty('style')
      })
    })
  })

  describe('training-program.json', () => {
    let trainingData
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'training-program.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      trainingData = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(typeof trainingData).toBe('object')
    })

    test('should have required training program structure', () => {
      expect(trainingData).toHaveProperty('trainingProgram')
      expect(trainingData.trainingProgram).toHaveProperty('title')
      expect(trainingData.trainingProgram).toHaveProperty('description')
      expect(trainingData.trainingProgram).toHaveProperty('modules')
      
      expect(typeof trainingData.trainingProgram.title).toBe('string')
      expect(typeof trainingData.trainingProgram.description).toBe('string')
      expect(Array.isArray(trainingData.trainingProgram.modules)).toBe(true)
    })

    test('should have valid training modules', () => {
      const modules = trainingData.trainingProgram.modules
      expect(modules.length).toBeGreaterThan(0)
      
      modules.forEach(module => {
        expect(module).toHaveProperty('id')
        expect(module).toHaveProperty('title')
        expect(module).toHaveProperty('description')
        expect(module).toHaveProperty('roles')
        expect(module).toHaveProperty('assessment')
        expect(module).toHaveProperty('progressTracking')
        
        expect(typeof module.id).toBe('string')
        expect(typeof module.title).toBe('string')
        expect(typeof module.description).toBe('string')
        expect(Array.isArray(module.roles)).toBe(true)
        expect(typeof module.assessment).toBe('object')
        expect(typeof module.progressTracking).toBe('boolean')
      })
    })

    test('should have valid assessment structures', () => {
      const modules = trainingData.trainingProgram.modules
      
      modules.forEach(module => {
        const assessment = module.assessment
        expect(assessment).toHaveProperty('type')
        expect(assessment).toHaveProperty('passMark')
        
        expect(['quiz', 'practical', 'scenario']).toContain(assessment.type)
        
        if (assessment.type === 'quiz') {
          expect(assessment).toHaveProperty('questions')
          expect(typeof assessment.questions).toBe('number')
        }
        
        if (assessment.type === 'practical') {
          expect(assessment).toHaveProperty('criteria')
          expect(Array.isArray(assessment.criteria)).toBe(true)
        }
        
        if (assessment.type === 'scenario') {
          expect(assessment).toHaveProperty('cases')
          expect(typeof assessment.cases).toBe('number')
        }
      })
    })
  })

  describe('users.json', () => {
    let usersData
    
    beforeAll(() => {
      const filePath = path.join(dataDir, 'users.json')
      const fileContent = fs.readFileSync(filePath, 'utf8')
      usersData = JSON.parse(fileContent)
    })

    test('should be valid JSON', () => {
      expect(Array.isArray(usersData)).toBe(true)
    })

    test('should have required user structure', () => {
      usersData.forEach(user => {
        expect(user).toHaveProperty('userID')
        expect(user).toHaveProperty('firstName')
        expect(user).toHaveProperty('lastName')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('role')
        expect(user).toHaveProperty('assignedModules')
        expect(user).toHaveProperty('progress')
        expect(user).toHaveProperty('certificates')
        expect(user).toHaveProperty('lastLogin')
        expect(user).toHaveProperty('status')
        
        expect(typeof user.userID).toBe('string')
        expect(typeof user.firstName).toBe('string')
        expect(typeof user.lastName).toBe('string')
        expect(typeof user.email).toBe('string')
        expect(typeof user.role).toBe('string')
        expect(Array.isArray(user.assignedModules)).toBe(true)
        expect(typeof user.progress).toBe('object')
        expect(Array.isArray(user.certificates)).toBe(true)
        expect(typeof user.status).toBe('string')
      })
    })

    test('should have valid progress structure', () => {
      usersData.forEach(user => {
        const progress = user.progress
        expect(progress).toHaveProperty('completed')
        expect(progress).toHaveProperty('inProgress')
        expect(progress).toHaveProperty('notStarted')
        
        expect(Array.isArray(progress.completed)).toBe(true)
        expect(Array.isArray(progress.inProgress)).toBe(true)
        expect(Array.isArray(progress.notStarted)).toBe(true)
      })
    })

    test('should have valid certificate structure', () => {
      usersData.forEach(user => {
        user.certificates.forEach(certificate => {
          expect(certificate).toHaveProperty('moduleId')
          expect(certificate).toHaveProperty('issuedDate')
          expect(certificate).toHaveProperty('score')
          expect(certificate).toHaveProperty('validUntil')
          
          expect(typeof certificate.moduleId).toBe('string')
          expect(typeof certificate.issuedDate).toBe('string')
          expect(typeof certificate.score).toBe('number')
          expect(typeof certificate.validUntil).toBe('string')
        })
      })
    })

    test('should have valid roles', () => {
      const validRoles = ['all', 'childcare', 'food-prep', 'dementia', 'learning-disability', 'medication']
      usersData.forEach(user => {
        expect(validRoles).toContain(user.role)
      })
    })

    test('should have valid status values', () => {
      const validStatuses = ['active', 'inactive', 'suspended']
      usersData.forEach(user => {
        expect(validStatuses).toContain(user.status)
      })
    })
  })
})
