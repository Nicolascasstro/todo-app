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
    activeClasses: 'bg-blue-600 text-white',
    inactiveClasses: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
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

export const getCategoryIcon = (categoryId) =>
  CATEGORIES.find((category) => category.id === categoryId)?.icon || Dumbbell

export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayKey = () => formatDate(new Date())

const startOfWeek = (date) => {
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
  const weekSet = new Set(completedDates.map((dateStr) => formatDate(startOfWeek(new Date(dateStr)))))
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
