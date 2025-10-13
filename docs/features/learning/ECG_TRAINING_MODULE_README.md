# ECG Training Module System

A comprehensive ECG learning platform built with React, Node.js/Express, and MongoDB. This system provides interactive ECG training modules with PDF viewers, video players, assessments, and hands-on simulators.

## 🚀 Features

### Core Learning Components
- **PDF Viewer**: Interactive slides with zoom, navigation, and progress tracking
- **Video Player**: MP4 video playback with custom controls and progress tracking
- **Question Engine**: Dynamic quiz system with pre/post tests and explanations
- **Electrode Simulator**: Drag-and-drop electrode placement practice
- **ECG Strip Activity**: Interactive ECG interpretation and labeling
- **Case Scenarios**: Real-world clinical decision making exercises

### User Management
- **Progress Tracking**: Completion percentages and module unlocking
- **Certificate System**: Digital certificates for module completion
- **Role-based Access**: Learner, Instructor, and Admin dashboards
- **Analytics**: Comprehensive progress monitoring and reporting

### Admin Features
- **Content Management**: Upload and manage PDFs, videos, and questions
- **Module Creation**: Build custom training modules
- **User Analytics**: Monitor learner progress and performance
- **File Upload**: Secure file handling with Multer

## 📁 Project Structure

```
Health_Hub/
├── app/
│   ├── components/
│   │   ├── ECGTrainingModule.jsx          # Main module container
│   │   ├── ECGAdminDashboard.jsx          # Admin management interface
│   │   └── ECGModuleComponents/           # Individual learning components
│   │       ├── PDFViewer.jsx             # PDF slide viewer
│   │       ├── VideoPlayer.jsx           # Video player with controls
│   │       ├── QuestionEngine.jsx        # Quiz and assessment system
│   │       ├── ElectrodeSimulator.jsx    # Drag-and-drop simulator
│   │       ├── ECGStripActivity.jsx      # ECG interpretation activity
│   │       ├── CaseScenarios.jsx         # Clinical case studies
│   │       └── ProgressTracker.jsx       # Progress monitoring
│   ├── api/ecg/                          # ECG-specific API routes
│   │   ├── modules/[id]/route.js         # Module data management
│   │   ├── progress/[userId]/[moduleId]/route.js  # Progress tracking
│   │   ├── assessments/route.js          # Assessment data
│   │   └── upload/route.js               # File upload handling
│   └── ecg-training/page.jsx             # Main ECG training page
├── assets/                               # Module content storage
│   ├── module1/                          # Module 1 content
│   │   ├── pdfs/                         # PDF slides
│   │   ├── videos/                       # Video files
│   │   ├── images/                       # Images and diagrams
│   │   └── questions/                    # Question files
│   └── module2/                          # Module 2 content
├── data/                                 # JSON data storage
│   ├── ecg-modules.json                  # Module definitions
│   ├── ecg-progress.json                 # User progress data
│   └── ecg-assessments.json              # Assessment results
└── lib/                                  # Utility libraries
    ├── ecg-parser.js                     # ECG file parsing
    └── ecg-analyzer.js                   # ECG analysis algorithms
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with Next.js 14
- **Tailwind CSS** for styling
- **react-pdf** for PDF viewing
- **react-player** for video playback
- **react-dropzone** for file uploads

### Backend
- **Next.js API Routes** for serverless functions
- **Multer** for file upload handling
- **JSON file storage** (can be replaced with MongoDB)
- **JWT authentication** (ready for integration)

### Dependencies
```json
{
  "react-pdf": "^7.0.0",
  "react-player": "^2.13.0",
  "multer": "^1.4.5",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install react-pdf react-player multer mongoose jsonwebtoken bcryptjs
```

2. **Create directory structure:**
```bash
mkdir -p assets/module1/{pdfs,videos,images,questions}
mkdir -p assets/module2/{pdfs,videos,images,questions}
mkdir -p data
```

3. **Start development server:**
```bash
npm run dev
```

4. **Access the platform:**
- Main ECG Training: `http://localhost:3000/ecg-training`
- Admin Dashboard: `http://localhost:3000/ecg-training` (switch to admin view)

## 📚 Module Structure

Each ECG training module contains:

### Content Types
- **Slides**: PDF presentations with navigation controls
- **Videos**: MP4 educational content with progress tracking
- **Images**: Diagrams, charts, and visual aids
- **Questions**: CSV/JSON formatted assessment questions

### Assessment Types
- **Pre-test**: Initial knowledge assessment
- **Post-test**: Final competency evaluation
- **Interactive Activities**: Hands-on learning exercises
- **Case Studies**: Real-world clinical scenarios

### Progress Tracking
- **Section Progress**: Individual component completion
- **Overall Progress**: Weighted completion percentage
- **Module Unlocking**: Sequential access based on completion
- **Certificate Generation**: Digital completion certificates

## 🎯 Learning Objectives

### ECG Fundamentals Module
- Understand heart anatomy and electrical conduction
- Identify normal ECG components (P, QRS, T waves)
- Recognize basic cardiac rhythms
- Apply electrode placement techniques
- Interpret basic ECG measurements

### Cardiac Rhythm Recognition Module
- Recognize normal sinus rhythm variations
- Identify common arrhythmias
- Distinguish atrial vs ventricular rhythms
- Understand clinical significance
- Apply systematic rhythm analysis

## 🔧 API Endpoints

### Module Management
- `GET /api/ecg/modules/[id]` - Get module data
- `PUT /api/ecg/modules/[id]` - Update module data

### Progress Tracking
- `GET /api/ecg/progress/[userId]/[moduleId]` - Get user progress
- `PUT /api/ecg/progress/[userId]/[moduleId]` - Update progress

### Assessments
- `POST /api/ecg/assessments` - Submit assessment results
- `GET /api/ecg/assessments` - Get assessment data

### File Upload
- `POST /api/ecg/upload` - Upload module content files

## 🎨 Component Features

### PDFViewer
- Zoom controls (50% - 300%)
- Page navigation
- Progress tracking
- Multi-file support
- Responsive design

### VideoPlayer
- Custom playback controls
- Volume and speed adjustment
- Progress tracking
- Multi-video support
- Fullscreen capability

### QuestionEngine
- Multiple choice questions
- Pre/post test support
- Real-time feedback
- Score calculation
- Explanation display

### ElectrodeSimulator
- Drag-and-drop interface
- Anatomical accuracy checking
- Visual feedback
- Progress tracking
- Reset functionality

### ECGStripActivity
- Interactive labeling
- Component identification
- Visual feedback
- Multiple strip types
- Progress tracking

## 📊 Analytics & Reporting

### Learner Analytics
- Module completion rates
- Assessment scores
- Time spent per section
- Progress trends
- Certificate tracking

### Admin Analytics
- User engagement metrics
- Content performance
- System usage statistics
- Error tracking
- Performance monitoring

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Role-based access control
- Session management
- Password hashing with bcrypt

### File Security
- File type validation
- Size limits (50MB max)
- Secure file storage
- Path traversal protection

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t ecg-training .
docker run -p 3000:3000 ecg-training
```

## 📈 Future Enhancements

### Planned Features
- **AI-Powered Analysis**: Automated ECG interpretation
- **Real-time Collaboration**: Multi-user learning sessions
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Machine learning insights
- **Integration**: Medical device connectivity

### Scalability Improvements
- **Microservices Architecture**: Modular service design
- **Database Migration**: MongoDB integration
- **CDN Integration**: Content delivery optimization
- **Caching**: Redis implementation
- **Load Balancing**: Multi-instance deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for healthcare education**





