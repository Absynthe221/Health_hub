# Health Hub ECG - Learning Platform

A comprehensive online learning platform for healthcare professionals to master ECG recording, interpretation, and analysis. Built with Next.js, TypeScript, and modern web technologies.

## 🏥 Features

### Core Learning Features
- **Interactive ECG Viewer**: Advanced waveform visualization with pan/zoom, multi-lead analysis
- **Comprehensive Curriculum**: 8 structured modules covering all aspects of ECG learning
- **Artifact Detection**: AI-powered detection of common ECG artifacts
- **Quiz System**: Interactive assessments with multiple question types
- **Certificate Generation**: Professional PDF certificates upon course completion
- **Progress Tracking**: Detailed analytics and learning progress monitoring

### Technical Features
- **Real-time Analysis**: ECG waveform analysis with confidence scoring
- **File Upload Support**: CSV, JSON, and EDF format support
- **Role-based Access**: Learner, Instructor, and Admin roles
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Security**: PHIPA/HIPAA considerations with secure data handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/health-hub-ecg.git
   cd health-hub-ecg
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/health_hub_ecg"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Curriculum Overview

### Module 1: Heart Anatomy & ECG Basics
- Heart structure and electrical conduction system
- ECG waveform components (P, QRS, T waves)
- Normal ECG parameters and measurements

### Module 2: ECG Recording & Electrode Placement
- Standard 12-lead ECG setup
- Proper electrode placement techniques
- Common recording errors and troubleshooting

### Module 3: Artifact Detection & Management
- Types of ECG artifacts (baseline wander, motion, noise)
- Automated artifact detection algorithms
- Artifact correction techniques

### Module 4: Basic ECG Interpretation
- Rate and rhythm analysis
- Axis determination
- Interval measurements

### Module 5: Cardiac Rhythms & Dysrhythmias
- Normal sinus rhythm
- Atrial fibrillation and flutter
- Ventricular tachycardia and fibrillation
- Heart blocks and conduction disorders

### Module 6: Case Studies & Clinical Applications
- Real-world ECG scenarios
- Clinical decision making
- Treatment protocols

### Module 7: Advanced Interpretation
- ST-segment analysis
- Myocardial infarction patterns
- Drug effects on ECG

### Module 8: Assessment & Certification
- Comprehensive quizzes and exams
- Practical assessments
- Certificate generation

## 🛠️ Development

### Project Structure
```
health-hub-ecg/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard pages
│   └── auth/              # Authentication pages
├── lib/                   # Utility libraries
│   ├── ecg-parser.ts     # ECG file parsing
│   ├── ecg-analyzer.ts   # ECG analysis algorithms
│   └── certificate-generator.ts
├── prisma/               # Database schema and migrations
├── __tests__/            # Test files
└── docs/                 # Documentation
```

### Available Scripts

```bash
# Development
pnpm dev                  # Start development server
pnpm build               # Build for production
pnpm start               # Start production server

# Database
pnpm db:generate         # Generate Prisma client
pnpm db:push            # Push schema changes
pnpm db:migrate         # Run migrations
pnpm db:seed            # Seed database with sample data
pnpm db:studio          # Open Prisma Studio

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:coverage      # Run tests with coverage
pnpm test:e2e           # Run end-to-end tests

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
pnpm type-check         # Run TypeScript type checking
```

### ECG Analysis Features

#### Supported File Formats
- **CSV**: Comma-separated values with timestamp and lead data
- **JSON**: Structured JSON with leads and metadata
- **EDF**: European Data Format (basic support)

#### Analysis Capabilities
- **Artifact Detection**: Baseline wander, motion artifacts, lead disconnection, noise
- **Rhythm Analysis**: Sinus rhythm, AF, AFlutter, VT, VF detection
- **Measurements**: PR interval, QRS duration, QT interval, heart rate
- **Auto-interpretation**: Rule-based ECG interpretation with confidence scoring

#### ECG Viewer Features
- Pan and zoom functionality
- Multi-lead selection
- Playback controls
- Annotation overlay
- Keyboard shortcuts
- Touch/mobile support

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
pnpm test --testPathPattern=integration
```

### End-to-End Tests
```bash
pnpm test:e2e
```

### Test Coverage
```bash
pnpm test:coverage
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t health-hub-ecg .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | No |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 | No |
| `AWS_S3_BUCKET` | S3 bucket name | No |

## 🔒 Security & Privacy

### PHIPA/HIPAA Considerations

This platform implements several security measures for healthcare data:

- **Encryption at Rest**: All stored data is encrypted
- **Secure Transmission**: HTTPS/TLS for all communications
- **Access Controls**: Role-based permissions and authentication
- **Audit Logging**: Comprehensive logging of user actions
- **Data Minimization**: Only necessary data is collected and stored
- **Regular Backups**: Automated database backups with encryption

### Security Best Practices

- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping
- CSRF protection via NextAuth
- Rate limiting on API endpoints
- Secure file upload handling

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 📖 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signin`
Sign in with email/password or OAuth provider

#### POST `/api/auth/signout`
Sign out the current user

### Course Endpoints

#### GET `/api/courses`
Get all published courses with user enrollment status

#### POST `/api/courses`
Create a new course (Admin/Instructor only)

### ECG Endpoints

#### POST `/api/ecg/upload`
Upload and parse ECG file

#### POST `/api/ecg/:id/analyze`
Analyze uploaded ECG recording

### Quiz Endpoints

#### POST `/api/quizzes/:id/attempt`
Submit quiz attempt and get results

### Certificate Endpoints

#### POST `/api/certificates/generate`
Generate PDF certificate for completed course

#### GET `/api/certificates/:id/download`
Download generated certificate

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
pnpm db:studio

# Reset database
pnpm db:push --force-reset
pnpm db:seed
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Test Issues
```bash
# Clear Jest cache
pnpm test --clearCache

# Run specific test
pnpm test --testNamePattern="ECG Parser"
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Healthcare professionals who provided domain expertise
- Open source ECG analysis libraries and algorithms
- Next.js and React communities
- Medical education institutions for curriculum guidance

## 📝 Feedback System

The platform includes a comprehensive feedback system to gather user input and improve the learning experience.

### Features
- **Star Rating**: 1-5 star rating system
- **Text Comments**: Optional detailed feedback
- **User Tracking**: Anonymous feedback with optional user identification
- **Admin Dashboard**: View and analyze feedback (coming soon)

### API Endpoints
- `POST /api/feedback` - Submit new feedback
- `GET /api/feedback` - Retrieve feedback with pagination

### Usage
Visit `/feedback` to submit your feedback about the platform experience.

## 👨‍🎓 Learner Dashboard

The platform includes a comprehensive learner dashboard with personalized learning features.

### Features
- **Personalized Welcome**: Custom greeting with learner name
- **Course Management**: View enrolled courses with progress tracking
- **Progress Analytics**: Detailed learning statistics and quiz scores
- **Badge System**: Earn and display achievement badges
- **Leaderboard**: Compete with other learners on the platform
- **Streak Tracking**: Daily activity streak counter with gamification

### Dashboard Tabs
- **My Courses**: Course enrollment and progress tracking
- **Progress**: Learning statistics and recent quiz scores
- **Badges**: Earned achievements and available badges
- **Leaderboard**: Top learners ranking system

### API Endpoints
- `GET /api/leaderboard` - Retrieve top 10 learners by score
- `GET /dashboard/learner` - Access learner dashboard

### Usage
Visit `/dashboard/learner` to access your personalized learning dashboard.

## 👩‍🏫 Instructor Dashboard

The platform includes a comprehensive instructor dashboard for course management and learner oversight.

### Features
- **Personalized Welcome**: Custom greeting with instructor name
- **Course Management**: Create, edit, and manage courses with enrollment statistics
- **Quiz Management**: Create and monitor assignments and quizzes
- **Learner Management**: View and search all learners with progress tracking
- **Reports & Analytics**: Export data and view performance metrics
- **Gamification**: Top performing course badges and instructor achievements

### Dashboard Tabs
- **My Courses**: Course creation and management with enrollment stats
- **Assignments/Quizzes**: Quiz creation and submission monitoring
- **Learner Management**: Search and view learner progress across courses
- **Reports**: Performance analytics and data export functionality

### API Endpoints
- `GET /api/instructor/courses` - Retrieve instructor's courses with statistics
- `POST /api/instructor/courses` - Create new course
- `GET /api/instructor/learners` - Retrieve learners with search and pagination

### Usage
Visit `/dashboard/instructor` to access your course management dashboard.

## 👨‍💼 Admin Dashboard

The platform includes a comprehensive admin dashboard for system management and oversight.

### Features
- **Personalized Welcome**: Custom greeting with admin name
- **User Management**: Complete user oversight with role assignment and status management
- **Course Management**: System-wide course administration with publish/unpublish controls
- **Reports & Analytics**: Advanced analytics with charts and performance metrics
- **System Settings**: Platform configuration with toggle switches for system controls
- **Professional Admin Theme**: Clean, administrative interface design

### Dashboard Tabs
- **User Management**: User oversight, role assignment, and status management
- **Course Management**: System-wide course administration and publishing controls
- **Reports & Analytics**: Performance charts, user growth, and system metrics
- **System Settings**: Platform configuration and system controls

### API Endpoints
- `GET /api/admin/users` - Retrieve all users with filtering and pagination
- `POST /api/admin/users` - Create new user
- `DELETE /api/admin/users` - Remove user
- `GET /api/admin/courses` - Retrieve all courses with statistics
- `PUT /api/admin/courses` - Update course status
- `DELETE /api/admin/courses` - Delete course

### Usage
Visit `/dashboard/admin` to access the system administration dashboard.

## 🔐 Role-based Authentication

The platform includes a comprehensive role-based authentication system with role-specific dashboards and navigation.

### Features
- **Role-based Access Control**: Three distinct user roles (Learner, Instructor, Admin)
- **Smart Redirects**: Automatic redirection to role-appropriate dashboards
- **Persistent Sessions**: User authentication persists across browser sessions
- **Role-specific Navigation**: Custom navigation menus based on user role
- **Mock Authentication**: Demo login system for testing and demonstration

### User Roles
- **Learner**: Access courses, track progress, earn badges, and compete on leaderboards
- **Instructor**: Create courses, manage learners, review submissions, and generate reports
- **Admin**: Manage users, oversee courses, view analytics, and configure system settings

### Authentication Flow
1. **Login Page**: `/auth/login` - Role selection with dropdown
2. **Dashboard Redirect**: `/dashboard` - Auto-redirects based on user role
3. **Role-specific Dashboards**: 
   - Learners → `/dashboard/learner`
   - Instructors → `/dashboard/instructor`
   - Admins → `/dashboard/admin`

### Navigation System
- **Learner Navigation**: My Dashboard, ECG Demo, Feedback
- **Instructor Navigation**: My Dashboard, My Courses, Learners, Reports
- **Admin Navigation**: Admin Panel, Users, Courses, Analytics, Settings

### API Integration
- **Authentication Context**: React context for user state management
- **Local Storage**: Persistent user sessions using browser storage
- **Role Validation**: Server-side role verification for protected routes

### Usage
1. Visit `/auth/login` to access the login page
2. Select your role from the dropdown
3. Optionally enter your name and email
4. Click "Sign In" to access your role-specific dashboard
5. Use the role-specific navigation to access different features

### Demo Credentials
- **Learner**: Select "Learner" role for course access and progress tracking
- **Instructor**: Select "Instructor" role for course management and learner oversight
- **Admin**: Select "Admin" role for system administration and analytics

## 📊 Realistic Learner Data Integration

The platform now includes comprehensive learner profile data with realistic progress tracking and gamification elements.

### Learner Profile Structure
```json
{
  "id": "learner_001",
  "name": "Dr. Sarah Johnson",
  "email": "sarah.johnson@example.com",
  "enrolledCourses": ["course_001", "course_002"],
  "progress": {
    "course_001": 0.75,
    "course_002": 0.4
  },
  "badges": ["streak_7_days", "ecg_basics_completed"],
  "quizScores": [
    { "quizId": "quiz_001", "score": 85, "quizName": "ECG Basics Assessment" },
    { "quizId": "quiz_002", "score": 92, "quizName": "Heart Anatomy Quiz" }
  ],
  "streak": 7,
  "points": 1250,
  "rank": 3
}
```

### Features
- **Progress Tracking**: Real-time course completion percentages
- **Quiz Scores**: Detailed quiz performance with dates and names
- **Badge System**: Earned achievements with descriptions and icons
- **Gamification**: Points system, streaks, and leaderboards
- **API Integration**: RESTful endpoints for profile management

### API Endpoints
- `GET /api/learner/profile` - Retrieve learner profile data
- `PUT /api/learner/profile` - Update learner progress and achievements

### Usage
1. Login as a Learner to see personalized dashboard
2. View course progress with realistic completion percentages
3. Track quiz scores and achievements
4. Monitor learning streak and points
5. Compare performance on leaderboard

## 👨‍🏫 Realistic Instructor Data Integration

The platform now includes comprehensive instructor profile data with course management statistics and achievement tracking.

### Instructor Profile Structure
```json
{
  "id": "instructor_001",
  "name": "Dr. Emily Carter",
  "email": "emily.carter@example.com",
  "coursesCreated": ["course_001", "course_003"],
  "stats": {
    "totalLearners": 150,
    "avgScore": 78,
    "completionRate": 0.68
  },
  "badges": ["top_performing_course", "active_instructor"]
}
```

### Features
- **Course Management**: Track created courses with learner statistics
- **Performance Metrics**: Average scores and completion rates
- **Learner Statistics**: Total learners across all courses
- **Achievement System**: Instructor badges and recognition
- **Progress Tracking**: Course creation and learner engagement metrics

### API Endpoints
- `GET /api/instructor/profile` - Retrieve instructor profile data
- `PUT /api/instructor/profile` - Update instructor statistics and achievements

### Dashboard Features
- **Statistics Overview**: Total learners (150), courses, quizzes, completion rates (68%), average scores (78%)
- **Course Management**: View and manage created courses with enrollment data
- **Learner Management**: Track learner progress and performance
- **Achievement System**: View earned badges and progress toward new achievements
- **Reports & Analytics**: Comprehensive performance metrics and charts

### Usage
1. Login as an Instructor to access the instructor dashboard
2. View comprehensive statistics and learner metrics
3. Manage courses and track learner progress
4. Monitor achievement progress and earned badges
5. Generate reports and analyze performance data

## 📚 Comprehensive Course Data Integration

The platform now includes detailed course management with realistic module tracking, learner progress analytics, and comprehensive course views.

### Course Data Structure
```json
{
  "id": "course_001",
  "title": "ECG Basics: Anatomy & Physiology",
  "description": "Learn the fundamentals of heart anatomy and ECG basics.",
  "instructorId": "instructor_001",
  "enrolledLearners": ["learner_001", "learner_002"],
  "status": "published",
  "completionRate": 0.65,
  "modules": [
    { 
      "id": "module_001", 
      "title": "Heart Anatomy", 
      "completedBy": ["learner_001"],
      "totalLearners": 2,
      "completionRate": 0.5,
      "duration": "45 minutes",
      "order": 1
    },
    { 
      "id": "module_002", 
      "title": "ECG Recording & Placement", 
      "completedBy": [],
      "totalLearners": 2,
      "completionRate": 0,
      "duration": "60 minutes",
      "order": 2
    }
  ],
  "quizzes": [
    {
      "id": "quiz_001",
      "title": "Heart Anatomy Assessment",
      "attempts": 2,
      "avgScore": 85,
      "passRate": 1.0
    }
  ]
}
```

### Features
- **Detailed Course Views**: Comprehensive course information with statistics
- **Module Tracking**: Individual module completion rates and learner progress
- **Quiz Analytics**: Performance metrics, attempts, and pass rates
- **Learner Progress**: Individual learner tracking with time spent and scores
- **Course Management**: Status tracking, enrollment data, and completion analytics

### API Endpoints
- `GET /api/courses/mock` - Retrieve detailed course data with modules and learner progress
- `PUT /api/courses/detail` - Update course modules and learner progress

### Course Detail Page Features
- **Overview Tab**: Course statistics, completion rates, and instructor information
- **Modules Tab**: Individual module progress with completion tracking
- **Learners Tab**: Detailed learner progress table with scores and activity
- **Quizzes Tab**: Quiz performance analytics and attempt statistics

### Dashboard Integration
- **Clickable Course Links**: Direct navigation from dashboards to detailed course views
- **Real-time Statistics**: Live updates of enrollment, completion rates, and performance
- **Progress Visualization**: Visual progress bars and completion percentages
- **Responsive Design**: Mobile-friendly course detail pages

### Usage
1. Access course details by clicking course titles in dashboards
2. View comprehensive course statistics and learner analytics
3. Track individual module completion and quiz performance
4. Monitor learner progress with detailed progress tables
5. Analyze course effectiveness through completion and score metrics

## 📝 Comprehensive Quiz Data Integration

The platform now includes detailed quiz management with realistic submission tracking, performance analytics, and comprehensive quiz views.

### Quiz Data Structure
```json
{
  "id": "quiz_001",
  "courseId": "course_001",
  "title": "Heart Anatomy Basics",
  "questions": 10,
  "averageScore": 80,
  "submissions": [
    { 
      "learnerId": "learner_001", 
      "score": 85,
      "passed": true,
      "timeSpent": 18,
      "completedAt": "2024-01-20T10:30:00Z"
    },
    { 
      "learnerId": "learner_002", 
      "score": 75,
      "passed": true,
      "timeSpent": 25,
      "completedAt": "2024-01-19T14:15:00Z"
    }
  ]
}
```

### Features
- **Detailed Quiz Views**: Comprehensive quiz information with statistics and analytics
- **Submission Tracking**: Individual learner submissions with scores and timing data
- **Question Analysis**: Detailed question breakdown with correct answers and explanations
- **Performance Analytics**: Score distribution, pass rates, and performance metrics
- **Quiz Management**: Time limits, passing scores, and attempt tracking

### API Endpoints
- `GET /api/quizzes/detail` - Retrieve detailed quiz data with submissions and questions
- `POST /api/quizzes/detail` - Submit quiz answers and calculate scores

### Quiz Detail Page Features
- **Overview Tab**: Quiz statistics, time limits, passing scores, and instructor information
- **Submissions Tab**: Detailed submission table with learner scores and completion times
- **Questions Tab**: Question-by-question breakdown with correct answers and explanations
- **Analytics Tab**: Performance metrics, score distribution, and completion statistics

### Dashboard Integration
- **Clickable Quiz Links**: Direct navigation from dashboards and course pages to detailed quiz views
- **Real-time Statistics**: Live updates of submissions, scores, and performance metrics
- **Progress Visualization**: Visual progress bars and score indicators
- **Responsive Design**: Mobile-friendly quiz detail pages

### Usage
1. Access quiz details by clicking quiz titles in dashboards or course pages
2. View comprehensive quiz statistics and learner performance analytics
3. Track individual submissions with detailed score and timing data
4. Analyze question performance with correct answers and explanations
5. Monitor quiz effectiveness through completion and performance metrics

## 📊 Comprehensive Analytics Dashboard

The platform now includes a powerful analytics dashboard with realistic system-wide metrics, user engagement insights, and performance analytics.

### Analytics Data Structure
```json
{
  "activeUsers": 320,
  "roleDistribution": {
    "learners": 280,
    "instructors": 30,
    "admins": 10
  },
  "courseCompletionRates": [
    { "courseId": "course_001", "completionRate": 0.65 },
    { "courseId": "course_002", "completionRate": 0.48 }
  ],
  "quizPassRates": [
    { "quizId": "quiz_001", "passRate": 0.82 },
    { "quizId": "quiz_002", "passRate": 0.76 }
  ]
}
```

### Features
- **System-wide Metrics**: Active users, role distribution, and engagement statistics
- **Course Analytics**: Completion rates, enrollment data, and performance tracking
- **Quiz Performance**: Pass rates, attempts, and score analytics
- **User Engagement**: Session data, time spent, and activity patterns
- **Growth Trends**: User growth, completion growth, and engagement trends

### API Endpoints
- `GET /api/analytics/overview` - Retrieve comprehensive analytics data with period filtering

### Analytics Dashboard Features
- **Overview Tab**: Key metrics, user growth, and course performance summaries
- **Users Tab**: Role distribution, active users, and engagement metrics
- **Courses Tab**: Course completion rates and enrollment analytics
- **Quizzes Tab**: Quiz performance and pass rate analytics
- **Engagement Tab**: Time metrics, session data, and growth trends

### Key Metrics
- **Active Users**: 320 active users with 15.2% growth
- **Role Distribution**: 280 learners, 30 instructors, 10 admins
- **Course Performance**: 62% average completion rate across 8 courses
- **Quiz Performance**: 78% average pass rate across 24 quizzes
- **Engagement**: 4.2 hours average time spent per user

### Dashboard Integration
- **Admin Navigation**: Direct access from admin dashboard and navbar
- **Period Filtering**: 7d, 30d, 90d, and 1y analytics periods
- **Real-time Updates**: Live analytics data with timestamp tracking
- **Responsive Design**: Mobile-friendly analytics dashboard

### Usage
1. Access analytics dashboard from admin dashboard or navigation
2. View comprehensive system-wide metrics and performance data
3. Analyze user engagement and activity patterns
4. Monitor course completion and quiz performance trends
5. Track growth metrics and system health indicators

## 📞 Support

For support and questions:

- **Documentation**: Check this README and `/docs` folder
- **Issues**: Create a GitHub issue
- **Email**: support@healthhubecg.com
- **Feedback**: Use the feedback form at `/feedback`

---

**Built with ❤️ for healthcare professionals**

# Health_hub
# Health_hub
# Health_hub
