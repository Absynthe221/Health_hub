import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import QuizCard from '../../components/dashboard/QuizCard'

const mockQuiz = {
  id: 'quiz-1',
  question: 'What does ECG stand for?',
  options: ['Electrocardiogram', 'Echocardiogram', 'Electroencephalogram'],
  correctAnswer: 0,
  explanation: 'ECG stands for Electrocardiogram'
}

describe('QuizCard', () => {
  it('renders without crashing', () => {
    render(<QuizCard quiz={mockQuiz} />)
    expect(screen.getByText('What does ECG stand for?')).toBeInTheDocument()
  })

  it('displays all quiz options', () => {
    render(<QuizCard quiz={mockQuiz} />)
    expect(screen.getByText('Electrocardiogram')).toBeInTheDocument()
    expect(screen.getByText('Echocardiogram')).toBeInTheDocument()
    expect(screen.getByText('Electroencephalogram')).toBeInTheDocument()
  })

  it('handles answer selection', () => {
    const onAnswer = jest.fn()
    render(<QuizCard quiz={mockQuiz} onAnswer={onAnswer} />)
    
    const option = screen.getByText('Electrocardiogram')
    fireEvent.click(option)
    
    expect(onAnswer).toHaveBeenCalledWith(0)
  })

  it('shows correct answer when revealed', () => {
    render(<QuizCard quiz={mockQuiz} showAnswer />)
    
    const correctOption = screen.getByText('Electrocardiogram')
    expect(correctOption).toHaveClass('bg-green-100', 'border-green-500')
  })

  it('shows explanation when provided', () => {
    render(<QuizCard quiz={mockQuiz} showAnswer />)
    expect(screen.getByText('ECG stands for Electrocardiogram')).toBeInTheDocument()
  })

  it('disables options when answered', () => {
    render(<QuizCard quiz={mockQuiz} answered />)
    
    const options = screen.getAllByRole('button')
    options.forEach(option => {
      expect(option).toBeDisabled()
    })
  })

  it('shows loading state', () => {
    render(<QuizCard quiz={mockQuiz} loading />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles editor mode', () => {
    const onEdit = jest.fn()
    const onDelete = jest.fn()
    
    render(
      <QuizCard 
        quiz={mockQuiz} 
        editorMode 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    )
    
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
})

