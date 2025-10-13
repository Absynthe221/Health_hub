import React from 'react'
import { render, screen } from '@testing-library/react'
import ProgressBar from '../../components/dashboard/ProgressBar'

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    render(<ProgressBar value={50} max={100} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays correct progress value', () => {
    render(<ProgressBar value={75} max={100} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('shows percentage text', () => {
    render(<ProgressBar value={60} max={100} showPercentage />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('applies correct width style', () => {
    render(<ProgressBar value={30} max={100} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveStyle({ width: '30%' })
  })

  it('handles zero progress', () => {
    render(<ProgressBar value={0} max={100} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    expect(progressBar).toHaveStyle({ width: '0%' })
  })

  it('handles full progress', () => {
    render(<ProgressBar value={100} max={100} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    expect(progressBar).toHaveStyle({ width: '100%' })
  })

  it('applies custom className', () => {
    render(<ProgressBar value={50} max={100} className="custom-progress" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('custom-progress')
  })

  it('applies custom color variant', () => {
    render(<ProgressBar value={50} max={100} variant="success" />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveClass('bg-green-500')
  })
})

