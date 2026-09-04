import { describe, it, expect, beforeEach } from 'vitest'
import {
  getReminderSettings,
  saveReminderSettings,
  hasNotifiedToday,
  markNotifiedToday,
  reminderBody,
} from './reminders'
import { todayKey } from './habits'

beforeEach(() => {
  localStorage.clear()
})

describe('getReminderSettings', () => {
  it('defaults to disabled at 20:00 when nothing is stored', () => {
    expect(getReminderSettings()).toEqual({ enabled: false, time: '20:00' })
  })

  it('merges a partially stored value with the defaults', () => {
    localStorage.setItem('habit-reminder-settings', JSON.stringify({ enabled: true, time: '08:30' }))
    expect(getReminderSettings()).toEqual({ enabled: true, time: '08:30' })
  })

  it('falls back to defaults when the stored value is malformed', () => {
    localStorage.setItem('habit-reminder-settings', 'not json')
    expect(getReminderSettings()).toEqual({ enabled: false, time: '20:00' })
  })
})

describe('saveReminderSettings', () => {
  it('persists so a later read sees it', () => {
    saveReminderSettings({ enabled: true, time: '07:00' })
    expect(getReminderSettings()).toEqual({ enabled: true, time: '07:00' })
  })
})

describe('hasNotifiedToday / markNotifiedToday', () => {
  it('is false until marked, then true for the rest of the day', () => {
    expect(hasNotifiedToday()).toBe(false)
    markNotifiedToday()
    expect(hasNotifiedToday()).toBe(true)
    expect(localStorage.getItem('habit-reminder-last-notified')).toBe(todayKey())
  })
})

describe('reminderBody', () => {
  it('names the single habit when only one is incomplete', () => {
    expect(reminderBody([{ name: 'Meditate' }])).toBe('You still have "Meditate" to do today.')
  })

  it('uses a count when several habits are incomplete', () => {
    expect(reminderBody([{ name: 'Meditate' }, { name: 'Read' }])).toBe('You still have 2 habits to do today.')
  })
})
