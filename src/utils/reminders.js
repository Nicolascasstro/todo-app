import { todayKey } from './habits'

const SETTINGS_KEY = 'habit-reminder-settings'
const NOTIFIED_KEY = 'habit-reminder-last-notified'

const DEFAULT_SETTINGS = { enabled: false, time: '20:00' }

export const getReminderSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY))
    if (stored && typeof stored.time === 'string') return { ...DEFAULT_SETTINGS, ...stored }
  } catch {
    // malformed or missing value — fall back to defaults
  }
  return DEFAULT_SETTINGS
}

export const saveReminderSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// Guards against notifying more than once per day, across the catch-up
// check and the scheduled-timeout check (see ReminderContext).
export const hasNotifiedToday = () => localStorage.getItem(NOTIFIED_KEY) === todayKey()

export const markNotifiedToday = () => localStorage.setItem(NOTIFIED_KEY, todayKey())

export const reminderBody = (incompleteHabits) =>
  incompleteHabits.length === 1
    ? `You still have "${incompleteHabits[0].name}" to do today.`
    : `You still have ${incompleteHabits.length} habits to do today.`
