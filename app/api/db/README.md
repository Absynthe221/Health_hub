# 🗄️ Database API Routes

Complete CRUD API routes for Health Hub ECG Platform.

## 📍 Endpoints

### **Module APIs**

#### `GET /api/db/modules`
Get all modules with metadata.

**Query Parameters:**
- `userId` (optional) - Include user assignment status

**Response:**
```json
{
  "success": true,
  "modules": [
    {
      "moduleId": "module-1-basic-ecg-interpretations",
      "moduleTitle": "Basic ECG Interpretations",
      "slideCount": 135,
      "status": "IN_PROGRESS",
      "assignedAt": "2025-10-01T00:00:00.000Z"
    }
  ],
  "total": 2
}
```

#### `POST /api/db/modules`
Create a new module (admin/instructor only).

**Body:**
```json
{
  "moduleId": "module-3-advanced",
  "moduleTitle": "Advanced ECG",
  "slides": [
    {
      "title": "Slide 1",
      "content": "Content here",
      "contentType": "text",
      "duration": 2,
      "images": []
    }
  ]
}
```

#### `GET /api/db/modules/:id`
Get specific module with all slides.

**Response:**
```json
{
  "success": true,
  "module": {
    "moduleId": "module-1-basic-ecg-interpretations",
    "slides": [...],
    "metadata": {
      "totalSlides": 135,
      "estimatedDuration": 270
    }
  }
}
```

#### `PUT /api/db/modules/:id`
Update module (admin/instructor only).

#### `DELETE /api/db/modules/:id`
Delete module (admin only).

#### `GET /api/db/modules/:id/slides`
Get all slides for a module.

**Query Parameters:**
- `userId` (optional) - Include user progress

---

### **Progress APIs**

#### `GET /api/db/progress`
Get user progress.

**Query Parameters:**
- `userId` (required)
- `moduleId` (optional)

**Response:**
```json
{
  "success": true,
  "progress": [...],
  "summary": {
    "totalSlides": 5,
    "completedSlides": 3,
    "completionPercentage": 60,
    "totalTimeSpent": 900,
    "avgQuizScore": 85
  }
}
```

#### `POST /api/db/progress`
Update user progress.

**Body:**
```json
{
  "userId": "user-id",
  "slideId": "slide-id",
  "completed": true,
  "timeSpent": 120,
  "quizScore": 90
}
```

#### `GET /api/db/progress/:userId`
Get comprehensive user progress.

**Response:**
```json
{
  "success": true,
  "user": {...},
  "profile": {...},
  "progressByModule": {
    "module-1-basic-ecg-interpretations": {
      "completed": 3,
      "total": 5,
      "timeSpent": 900
    }
  }
}
```

---

### **Quiz APIs**

#### `GET /api/db/quizzes`
Get quiz attempts.

**Query Parameters:**
- `userId` (optional)
- `slideId` (optional)

**Response:**
```json
{
  "success": true,
  "attempts": [...],
  "total": 10
}
```

#### `POST /api/db/quizzes`
Submit knowledge check attempt.

**Body:**
```json
{
  "userId": "user-id",
  "slideId": "slide-id",
  "questionText": "What is the normal heart rate?",
  "selectedAnswer": 1,
  "correctAnswer": 1,
  "timeSpent": 30
}
```

**Response:**
```json
{
  "success": true,
  "isCorrect": true,
  "message": "Correct! +5 points"
}
```

#### `POST /api/db/quizzes/:id/submit`
Submit final module quiz.

**Body:**
```json
{
  "userId": "user-id",
  "answers": [0, 2, 1, 3, 0],
  "timeSpent": 600
}
```

**Response:**
```json
{
  "success": true,
  "score": 80,
  "correctCount": 4,
  "totalQuestions": 5,
  "passed": true,
  "pointsEarned": 40,
  "message": "Congratulations! You passed!"
}
```

---

### **User APIs**

#### `GET /api/db/users`
Get all users (admin only).

**Query Parameters:**
- `role` (optional) - Filter by role (ADMIN, INSTRUCTOR, LEARNER)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "LEARNER",
      "profile": {...},
      "stats": {
        "slidesCompleted": 25,
        "enrollments": 2
      }
    }
  ],
  "total": 3
}
```

#### `POST /api/db/users`
Create new user (admin only).

**Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "role": "LEARNER"
}
```

#### `GET /api/db/users/:id`
Get user details.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "profile": {...},
    "progress": [...],
    "stats": {...}
  }
}
```

#### `PUT /api/db/users/:id`
Update user (admin only).

**Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "INSTRUCTOR"
}
```

#### `DELETE /api/db/users/:id`
Delete user (admin only).

---

## 🔒 Authentication & Authorization

All endpoints should implement role-based access control:

- **Public:** None
- **Learner:** Progress (own), Modules (read), Quizzes (own)
- **Instructor:** + User progress (read all)
- **Admin:** + User CRUD, Module CRUD

Example middleware check:
```javascript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Check role
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // Continue...
}
```

---

## 📊 Database Schema

Key models:
- `User` - User accounts
- `UserProfile` - Gamification data
- `ModuleSlide` - Individual slides
- `SlideProgress` - User progress per slide
- `KnowledgeCheckAttempt` - Quiz attempts
- `PuzzleGameAttempt` - Puzzle scores
- `ModuleAssignment` - Module assignments
- `AudioNarration` - Audio metadata

---

## 🧪 Testing

Test with curl:
```bash
# Get modules
curl http://localhost:3000/api/db/modules

# Create user (needs auth)
curl -X POST http://localhost:3000/api/db/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Update progress
curl -X POST http://localhost:3000/api/db/progress \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id","slideId":"slide-id","completed":true}'
```

---

*Created: October 8, 2025*  
*Version: 1.0*

