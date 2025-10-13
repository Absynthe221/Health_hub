import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from '../../components/dashboard/DataTable'

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'instructor' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
]

const mockColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: false }
]

describe('DataTable', () => {
  it('renders without crashing', () => {
    render(<DataTable data={mockData} columns={mockColumns} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('displays table headers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
  })

  it('displays table data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('handles sorting', () => {
    const onSort = jest.fn()
    render(<DataTable data={mockData} columns={mockColumns} onSort={onSort} />)
    
    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader)
    
    expect(onSort).toHaveBeenCalledWith('name', 'asc')
  })

  it('handles row selection', () => {
    const onSelect = jest.fn()
    render(<DataTable data={mockData} columns={mockColumns} onSelect={onSelect} selectable />)
    
    const checkbox = screen.getAllByRole('checkbox')[1] // First data row
    fireEvent.click(checkbox)
    
    expect(onSelect).toHaveBeenCalledWith([1])
  })

  it('handles pagination', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'student'
    }))
    
    render(<DataTable data={largeData} columns={mockColumns} pageSize={10} />)
    
    expect(screen.getByText(/showing/i)).toBeInTheDocument()
    expect(screen.getByText(/1.*10.*50/)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<DataTable data={[]} columns={mockColumns} />)
    expect(screen.getByText(/no data/i)).toBeInTheDocument()
  })

  it('handles custom cell rendering', () => {
    const customColumns = [
      ...mockColumns,
      {
        key: 'actions',
        label: 'Actions',
        render: (value, row) => (
          <button onClick={() => console.log('Edit', row.id)}>Edit</button>
        )
      }
    ]
    
    render(<DataTable data={mockData} columns={customColumns} />)
    expect(screen.getAllByText('Edit')).toHaveLength(mockData.length)
  })

  it('applies custom className', () => {
    render(<DataTable data={mockData} columns={mockColumns} className="custom-table" />)
    const table = screen.getByRole('table')
    expect(table).toHaveClass('custom-table')
  })
})

