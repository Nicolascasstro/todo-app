import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HabitItem from './HabitItem'
import { getCategory } from '../utils/habits'

const health = getCategory('health')

describe('HabitItem', () => {
  it('renders the habit name and streak', () => {
    render(
      <HabitItem category={health} name="Drink water" streakCount={3} frequency="Daily" completed={false} />,
    )

    expect(screen.getByText('Drink water')).toBeInTheDocument()
    expect(screen.getByText(/3 days streak/)).toBeInTheDocument()
  })

  it('uses singular "day" for a streak of 1', () => {
    render(
      <HabitItem category={health} name="Drink water" streakCount={1} frequency="Daily" completed={false} />,
    )

    expect(screen.getByText(/1 day streak/)).toBeInTheDocument()
  })

  it('shows completed habits with a line-through style', () => {
    render(
      <HabitItem category={health} name="Drink water" streakCount={1} frequency="Daily" completed />,
    )

    expect(screen.getByText('Drink water')).toHaveClass('line-through')
  })

  it('calls onToggle, onEdit and onDelete from their respective buttons', () => {
    const onToggle = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <HabitItem
        category={health}
        name="Drink water"
        completed={false}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    fireEvent.click(screen.getByLabelText('Toggle habit completion'))
    fireEvent.click(screen.getByLabelText('Edit habit'))
    fireEvent.click(screen.getByLabelText('Delete habit'))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
