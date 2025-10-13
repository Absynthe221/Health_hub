import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../../components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays loading text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('accepts custom text', () => {
    render(<LoadingSpinner text="Processing..." />)
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('applies custom size', () => {
    render(<LoadingSpinner size="large" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('h-12', 'w-12')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })
})

