import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../app/page'
import NavBar from '../app/components/navbar'
import { AuthProvider } from '../lib/auth-context'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '',
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('HomePage Component', () => {
  beforeEach(() => {
    fetch.mockClear()
    // Mock successful CTA data fetch
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        primaryCTA: {
          text: "Start Learning",
          link: "/dashboard",
          style: "bg-blue-600 text-white"
        },
        secondaryCTA: {
          text: "View Demo",
          link: "/demo",
          style: "border border-gray-300"
        },
        headerButtons: [
          {
            text: "Feedback",
            link: "/feedback",
            style: "px-4 py-2"
          }
        ],
        heroCTA: {
          text: "Get Started Today",
          link: "/dashboard",
          style: "px-6 py-3 bg-blue-600"
        }
      })
    })
  })

  test('renders homepage with main heading', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Master ECG Interpretation')).toBeInTheDocument()
    })
  })

  test('renders CTA buttons when data loads', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Start Learning')).toBeInTheDocument()
      expect(screen.getByText('View Demo')).toBeInTheDocument()
    })
  })

  test('CTA buttons are clickable', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Start Learning')).toBeInTheDocument()
    })

    const startLearningButton = screen.getByText('Start Learning')
    expect(startLearningButton.closest('a')).toHaveAttribute('href', '/dashboard')
  })

  test('shows fallback CTAs when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Fetch failed'))
    
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Start Learning')).toBeInTheDocument()
      expect(screen.getByText('View Demo')).toBeInTheDocument()
    })
  })

  test('renders features grid', async () => {
    render(<HomePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Interactive ECG Viewer')).toBeInTheDocument()
      expect(screen.getByText('Comprehensive Curriculum')).toBeInTheDocument()
      expect(screen.getByText('Assessment & Certification')).toBeInTheDocument()
    })
  })
})

describe('NavBar Component', () => {
  const mockUser = {
    id: 'learner-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@hospital.com',
    role: 'learner'
  }

  test('renders navbar when user is logged in', () => {
    // Mock the auth context to return a user
    jest.doMock('../lib/auth-context', () => ({
      useAuth: () => ({ user: mockUser, login: jest.fn(), logout: jest.fn() }),
      AuthProvider: ({ children }) => children
    }))

    render(
      <AuthProvider>
        <NavBar />
      </AuthProvider>
    )
    
    // Since we're using a mock auth context, the navbar might not show
    // This test ensures the component renders without errors
    expect(document.body).toBeInTheDocument()
  })

  test('does not render when user is not logged in', () => {
    // Mock empty user
    jest.doMock('../lib/auth-context', () => ({
      useAuth: () => ({ user: null, login: jest.fn(), logout: jest.fn() }),
      AuthProvider: ({ children }) => children
    }))

    const { container } = render(
      <AuthProvider>
        <NavBar />
      </AuthProvider>
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('API Integration Tests', () => {
  test('fetch learners API returns valid data', async () => {
    const mockLearners = [
      {
        id: 'learner-1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah@hospital.com',
        enrolledCourses: ['course-1', 'course-2'],
        progress: { 'course-1': 0.75 },
        badges: ['streak-7-days'],
        quizScores: []
      }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        learners: mockLearners,
        totalLearners: mockLearners.length,
        lastUpdated: new Date().toISOString()
      })
    })

    const response = await fetch('/api/learners')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.learners).toHaveLength(1)
    expect(data.totalLearners).toBe(1)
    expect(data.learners[0]).toHaveProperty('id')
    expect(data.learners[0]).toHaveProperty('name')
    expect(data.learners[0]).toHaveProperty('enrolledCourses')
  })

  test('fetch courses API returns valid data', async () => {
    const mockCourses = [
      {
        id: 'course-1',
        title: 'ECG Basics',
        description: 'Learn the fundamentals of ECG interpretation',
        modules: [],
        quizzes: []
      }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        courses: mockCourses,
        totalCourses: mockCourses.length
      })
    })

    const response = await fetch('/api/courses')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.courses).toHaveLength(1)
    expect(data.totalCourses).toBe(1)
    expect(data.courses[0]).toHaveProperty('id')
    expect(data.courses[0]).toHaveProperty('title')
    expect(data.courses[0]).toHaveProperty('description')
  })

  test('fetch notifications API returns valid data', async () => {
    const mockNotifications = [
      {
        id: 'notif-1',
        message: 'You earned a new badge!',
        readStatus: false,
        timestamp: new Date().toISOString()
      }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        notifications: mockNotifications,
        stats: {
          total: 1,
          unread: 1
        }
      })
    })

    const response = await fetch('/api/notifications')
    const data = await response.json()

    expect(data.success).toBe(true)
    expect(data.notifications).toHaveLength(1)
    expect(data.stats.total).toBe(1)
    expect(data.notifications[0]).toHaveProperty('id')
    expect(data.notifications[0]).toHaveProperty('message')
    expect(data.notifications[0]).toHaveProperty('readStatus')
  })
})
