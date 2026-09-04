import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toggleHabitCompletion, restoreHabit } from './habitsApi'
import { todayKey, formatDate, startOfWeek } from './habits'

vi.mock('../firebase', () => ({ db: {} }))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn((_db, ...path) => ({ path: path.join('/') })),
  updateDoc: vi.fn(),
  setDoc: vi.fn(),
  arrayUnion: vi.fn((...values) => ({ __op: 'arrayUnion', values })),
  arrayRemove: vi.fn((...values) => ({ __op: 'arrayRemove', values })),
}))

import { doc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

const uid = 'user-1'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('toggleHabitCompletion - Daily', () => {
  it('adds today when not yet completed', () => {
    toggleHabitCompletion(uid, { id: 'h1', frequency: 'Daily', completedDates: [] })

    expect(doc).toHaveBeenCalledWith({}, 'users', uid, 'habits', 'h1')
    expect(arrayUnion).toHaveBeenCalledWith(todayKey())
    expect(updateDoc).toHaveBeenCalledWith(
      { path: `users/${uid}/habits/h1` },
      { completedDates: { __op: 'arrayUnion', values: [todayKey()] } },
    )
  })

  it('removes today when already completed', () => {
    toggleHabitCompletion(uid, { id: 'h1', frequency: 'Daily', completedDates: [todayKey()] })

    expect(arrayRemove).toHaveBeenCalledWith(todayKey())
  })
})

describe('toggleHabitCompletion - Weekly', () => {
  it('adds today when the current week has no completion yet', () => {
    toggleHabitCompletion(uid, { id: 'h2', frequency: 'Weekly', completedDates: [] })

    expect(arrayUnion).toHaveBeenCalledWith(todayKey())
  })

  it('clears every completion from the current week when toggled off', () => {
    const monday = startOfWeek(new Date())
    const mondayKey = formatDate(monday)
    const tuesdayKey = formatDate(new Date(monday.getTime() + 24 * 60 * 60 * 1000))
    const lastWeekKey = formatDate(new Date(monday.getTime() - 24 * 60 * 60 * 1000))

    toggleHabitCompletion(uid, {
      id: 'h2',
      frequency: 'Weekly',
      completedDates: [mondayKey, tuesdayKey, lastWeekKey],
    })

    expect(arrayRemove).toHaveBeenCalledWith(mondayKey, tuesdayKey)
  })
})

describe('restoreHabit', () => {
  it('recreates the habit doc at its original id with setDoc', () => {
    const data = { name: 'Read', category: 'mindset', frequency: 'Daily', completedDates: [], createdAt: 123 }
    restoreHabit(uid, 'h1', data)

    expect(doc).toHaveBeenCalledWith({}, 'users', uid, 'habits', 'h1')
    expect(setDoc).toHaveBeenCalledWith({ path: `users/${uid}/habits/h1` }, data)
  })
})
