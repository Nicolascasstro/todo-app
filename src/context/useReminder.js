import { useContext } from 'react'
import { ReminderContext } from './reminderContextObject'

export const useReminder = () => useContext(ReminderContext)
