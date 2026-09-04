import { useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import { useHabits } from '../hooks/useHabits'
import { isCompletedForPeriod } from '../utils/habits'
import {
  getReminderSettings,
  saveReminderSettings,
  hasNotifiedToday,
  markNotifiedToday,
  reminderBody,
} from '../utils/reminders'
import { ReminderContext } from './reminderContextObject'

const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window

const showReminderNotification = async (body) => {
  const options = { body, icon: '/icon-192.png', badge: '/icon-192.png', tag: 'habit-reminder' }
  const registration = await navigator.serviceWorker?.getRegistration()
  if (registration) {
    registration.showNotification('HabitFlow', options)
  } else {
    new Notification('HabitFlow', options)
  }
}

const incompleteHabits = (habits) =>
  habits.filter((habit) => !isCompletedForPeriod(habit.completedDates, habit.frequency))

export const ReminderProvider = ({ children }) => {
  const { user } = useAuth()
  const { habits } = useHabits(user?.uid)
  const [settings, setSettings] = useState(getReminderSettings)
  const [permission, setPermission] = useState(notificationsSupported ? Notification.permission : 'unsupported')
  const habitsRef = useRef(habits)
  useEffect(() => {
    habitsRef.current = habits
  }, [habits])

  const updateSettings = (partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      saveReminderSettings(next)
      return next
    })
  }

  const requestPermission = async () => {
    if (!notificationsSupported) return 'unsupported'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const active = settings.enabled && permission === 'granted'

  // Catch-up: if today's reminder time has already passed by the time the
  // app is opened (or habits finish loading), fire right away instead of
  // waiting for a timeout that already elapsed.
  useEffect(() => {
    if (!active || hasNotifiedToday()) return

    const [hours, minutes] = settings.time.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    if (target > now) return

    const incomplete = incompleteHabits(habits)
    if (incomplete.length === 0) return

    markNotifiedToday()
    showReminderNotification(reminderBody(incomplete))
  }, [active, settings.time, habits])

  // Scheduled: waits for today's (or tomorrow's, if already past) reminder
  // time while the app stays open in a tab. Reads habits from a ref at fire
  // time rather than depending on `habits` here, so this timer isn't reset
  // on every habit update — only when the reminder settings actually change.
  useEffect(() => {
    if (!active) return

    const [hours, minutes] = settings.time.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)

    const timeoutId = setTimeout(() => {
      if (hasNotifiedToday()) return
      const incomplete = incompleteHabits(habitsRef.current)
      if (incomplete.length === 0) return
      markNotifiedToday()
      showReminderNotification(reminderBody(incomplete))
    }, target.getTime() - now.getTime())

    return () => clearTimeout(timeoutId)
  }, [active, settings.time])

  return (
    <ReminderContext.Provider value={{ settings, updateSettings, permission, requestPermission, notificationsSupported }}>
      {children}
    </ReminderContext.Provider>
  )
}
