# Health Hub ECG - Mock Backend Data

This directory contains comprehensive mock data for the Health Hub ECG learning platform.

## 📁 Data Files

### `/data/learners.json`
- **5 realistic learner profiles** with complete data
- Properties: `id`, `name`, `email`, `enrolledCourses[]`, `progress{}`, `badges[]`, `quizScores[]`, `streak`, `points`, `rank`
- Sample: Dr. Sarah Johnson, Dr. James Lee, Dr. Maria Gonzales, Nurse Mike Chen, PSW Jennifer Lee

### `/data/instructors.json`
- **5 instructor profiles** with teaching statistics
- Properties: `id`, `name`, `email`, `coursesCreated[]`, `stats{}`, `badges[]`
- Sample: Dr. Emily Carter, Prof. David Lee, Dr. Lisa Rodriguez

### `/data/courses.json`
- **5 comprehensive courses** with modules and curriculum
- Properties: `id`, `title`, `description`, `instructorId`, `enrolledLearners[]`, `status`, `completionRate`, `modules[]`, `quizzes[]`
- Courses: Heart Anatomy & ECG Basics, ECG Recording & Placement, Artifact Detection, Advanced Arrhythmia Recognition, Pediatric ECG Analysis

### `/data/quizzes.json`
- **5 detailed quizzes** with questions and submissions
- Properties: `id`, `courseId`, `title`, `questions[]`, `averageScore`, `submissions[]`
- Includes: ECG Basics Assessment, Heart Anatomy Quiz, Electrode Placement Assessment, Lead Systems Quiz, Artifact Recognition

### `/data/reports.json`
- **Complete analytics data** for reporting and dashboards
- Properties: `activeUsers`, `roleDistribution{}`, `courseCompletionRates[]`, `quizPassRates[]`
- Includes engagement metrics, performance data, geographic distribution, device usage

### `/data/leaderboard.json`
- **Top 10 learners** ranked by points and achievements
- Properties: `rank`, `learnerId`, `name`, `points`, `badges`, `coursesCompleted`, `avgScore`, `streak`
- Top performers: Dr. James Lee (1500 pts), Dr. Maria Gonzales (1400 pts), Dr. Sarah Johnson (1250 pts)

## 🔗 API Endpoints

All data is accessible via REST API endpoints:

- `GET /api/learners` - Get all learners
- `GET /api/instructors` - Get all instructors  
- `GET /api/courses` - Get all courses
- `GET /api/quizzes` - Get all quizzes
- `GET /api/reports` - Get analytics data
- `GET /api/leaderboard` - Get top learners
- `GET /api/index` - API documentation

## ✨ Features

- **Consistent Data**: All IDs and references are consistent across files
- **Realistic Data**: Healthcare professional names and realistic progress values
- **Complete CRUD**: POST endpoints for creating new entities
- **TypeScript**: Full type definitions for all data structures
- **Error Handling**: Comprehensive error handling and validation
- **CORS Enabled**: Ready for local development and testing

## 🎯 Integration

This mock backend is immediately compatible with:
- Learner Dashboard (`/dashboard/learner`)
- Instructor Dashboard (`/dashboard/instructor`) 
- Admin Dashboard (`/dashboard/admin`)
- Analytics Dashboard (`/analytics`)
- Leaderboard Page (`/leaderboard`)

## 📊 Sample Metrics

- **5 Learners** with varying progress levels
- **5 Instructors** with different specializations
- **5 Courses** from beginner to advanced
- **5 Quizzes** with 15+ total submissions
- **82% Average Quiz Score** across all assessments
- **320 Active Users** in the system
- **65% Course Completion Rate** overall

---

*Generated for Health Hub ECG Learning Platform - Mock Backend v1.0.0*
