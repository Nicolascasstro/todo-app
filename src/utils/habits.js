import { Dumbbell, BookOpen, Brain, Users } from 'lucide-react'

export const FREQUENCIES = ['Daily', 'Weekly']

export const CATEGORIES = [
  {
    id: 'health',
    label: 'Health',
    icon: Dumbbell,
    activeClasses: 'bg-green-600 text-white',
    inactiveClasses: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400',
  },
  {
    id: 'work',
    label: 'Work',
    icon: BookOpen,
    activeClasses: 'bg-indigo-600 text-white',
    inactiveClasses: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400',
  },
  {
    id: 'mindset',
    label: 'Mindset',
    icon: Brain,
    activeClasses: 'bg-orange-600 text-white',
    inactiveClasses: 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400',
  },
  {
    id: 'social',
    label: 'Social',
    icon: Users,
    activeClasses: 'bg-purple-600 text-white',
    inactiveClasses: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400',
  },
]

export const getCategory = (categoryId) =>
  CATEGORIES.find((category) => category.id === categoryId) || CATEGORIES[0]

export const getCategoryIcon = (categoryId) => getCategory(categoryId).icon

export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayKey = () => formatDate(new Date())

// new Date("YYYY-MM-DD") parses the string as UTC midnight, which shifts to
// the previous local day in any timezone behind UTC. Since completedDates
// are stored as local-date keys (see formatDate), they must be parsed back
// as local dates too, or week/day bucketing silently drifts by a day.
export const parseDateKey = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const startOfWeek = (date) => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  const mondayOffset = (result.getDay() + 6) % 7 // 0 = Monday
  result.setDate(result.getDate() - mondayOffset)
  return result
}

const calculateDailyStreak = (dateSet) => {
  const oneDay = 24 * 60 * 60 * 1000
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  if (!dateSet.has(formatDate(cursor))) {
    cursor = new Date(cursor.getTime() - oneDay)
  }

  let streak = 0
  while (dateSet.has(formatDate(cursor))) {
    streak++
    cursor = new Date(cursor.getTime() - oneDay)
  }

  return streak
}

const calculateWeeklyStreak = (completedDates) => {
  const weekSet = new Set(completedDates.map((dateStr) => formatDate(startOfWeek(parseDateKey(dateStr)))))
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  let cursor = startOfWeek(new Date())

  if (!weekSet.has(formatDate(cursor))) {
    cursor = new Date(cursor.getTime() - oneWeek)
  }

  let streak = 0
  while (weekSet.has(formatDate(cursor))) {
    streak++
    cursor = new Date(cursor.getTime() - oneWeek)
  }

  return streak
}

export const calculateStreak = (completedDates = [], frequency = 'Daily') => {
  if (completedDates.length === 0) return 0

  if (frequency === 'Weekly') {
    return calculateWeeklyStreak(completedDates)
  }

  return calculateDailyStreak(new Set(completedDates))
}

// Whether a habit counts as "done" for its current period: today for a
// Daily habit, or any day in the current Mon-Sun week for a Weekly one.
export const isCompletedForPeriod = (completedDates = [], frequency = 'Daily') => {
  if (completedDates.length === 0) return false

  if (frequency === 'Weekly') {
    const currentWeekKey = formatDate(startOfWeek(new Date()))
    return completedDates.some((dateStr) => formatDate(startOfWeek(parseDateKey(dateStr))) === currentWeekKey)
  }

  return completedDates.includes(todayKey())
}
