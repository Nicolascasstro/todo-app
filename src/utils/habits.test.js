import { describe, it, expect } from 'vitest'
import { formatDate, todayKey, calculateStreak, isCompletedForPeriod, startOfWeek } from './habits'

const daysAgo = (n) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - n)
  return date
}

const dayKey = (n) => formatDate(daysAgo(n))

const weeksAgoKey = (n) => {
  const date = startOfWeek(new Date())
  date.setDate(date.getDate() - n * 7)
  return formatDate(date)
}

describe('formatDate', () => {
  it('uses local date components, not UTC', () => {
    // Regression test: an earlier version used date.toISOString(), which is
    // UTC-based and rolls over to the next calendar day in the evening for
    // any timezone behind UTC — silently breaking "today" and streaks.
    const date = new Date(2024, 0, 15, 23, 30) // Jan 15, 2024, 11:30pm local
    expect(formatDate(date)).toBe('2024-01-15')
  })

  it('pads single-digit months and days', () => {
    const date = new Date(2024, 2, 5) // March 5, 2024
    expect(formatDate(date)).toBe('2024-03-05')
  })
})

describe('todayKey', () => {
  it('matches formatDate(new Date())', () => {
    expect(todayKey()).toBe(formatDate(new Date()))
  })
})

describe('calculateStreak - Daily', () => {
  it('returns 0 for no completions', () => {
    expect(calculateStreak([])).toBe(0)
  })

  it('returns 1 when only completed today', () => {
    expect(calculateStreak([dayKey(0)])).toBe(1)
  })

  it('counts a consecutive streak including today', () => {
    expect(calculateStreak([dayKey(0), dayKey(1), dayKey(2)])).toBe(3)
  })

  it('still counts the streak if today is not done yet, ending yesterday', () => {
    expect(calculateStreak([dayKey(1), dayKey(2), dayKey(3)])).toBe(3)
  })

  it('stops counting at a gap', () => {
    expect(calculateStreak([dayKey(0), dayKey(2)])).toBe(1)
  })

  it('is 0 once more than a day has been missed', () => {
    expect(calculateStreak([dayKey(3), dayKey(4)])).toBe(0)
  })
})

describe('calculateStreak - Weekly', () => {
  it('returns 1 for a single completion this week', () => {
    expect(calculateStreak([dayKey(0)], 'Weekly')).toBe(1)
  })

  it('counts consecutive weeks with at least one completion each', () => {
    const dates = [weeksAgoKey(0), weeksAgoKey(1), weeksAgoKey(2)]
    expect(calculateStreak(dates, 'Weekly')).toBe(3)
  })

  it('still counts the streak if this week has no completion yet, ending last week', () => {
    const dates = [weeksAgoKey(1), weeksAgoKey(2)]
    expect(calculateStreak(dates, 'Weekly')).toBe(2)
  })

  it('stops counting at a missed week', () => {
    const dates = [weeksAgoKey(0), weeksAgoKey(2)]
    expect(calculateStreak(dates, 'Weekly')).toBe(1)
  })
})

describe('isCompletedForPeriod', () => {
  it('Daily: true only if today is in completedDates', () => {
    expect(isCompletedForPeriod([dayKey(0)], 'Daily')).toBe(true)
    expect(isCompletedForPeriod([dayKey(1)], 'Daily')).toBe(false)
    expect(isCompletedForPeriod([], 'Daily')).toBe(false)
  })

  it('Weekly: true if any day in the current week is completed, not just today', () => {
    const earlierThisWeek = new Date(startOfWeek(new Date()))
    expect(isCompletedForPeriod([formatDate(earlierThisWeek)], 'Weekly')).toBe(true)
  })

  it('Weekly: false if the completion was in a previous week', () => {
    expect(isCompletedForPeriod([weeksAgoKey(1)], 'Weekly')).toBe(false)
  })
})
