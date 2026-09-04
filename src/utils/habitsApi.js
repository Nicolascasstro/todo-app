import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '../firebase'
import { todayKey, startOfWeek, formatDate, parseDateKey } from './habits'

const habitsCollection = (uid) => collection(db, 'users', uid, 'habits')

export const subscribeToHabits = (uid, onChange, onError) => {
  const habitsQuery = query(habitsCollection(uid), orderBy('createdAt', 'asc'))
  return onSnapshot(
    habitsQuery,
    (snapshot) => {
      const habits = snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
      onChange(habits)
    },
    onError,
  )
}

export const getHabit = async (uid, habitId) => {
  const snapshot = await getDoc(doc(db, 'users', uid, 'habits', habitId))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export const addHabit = (uid, { name, category, frequency }) =>
  addDoc(habitsCollection(uid), {
    name,
    category,
    frequency,
    completedDates: [],
    createdAt: Date.now(),
  })

export const updateHabit = (uid, habitId, { name, category, frequency }) =>
  updateDoc(doc(db, 'users', uid, 'habits', habitId), { name, category, frequency })

export const deleteHabit = (uid, habitId) => deleteDoc(doc(db, 'users', uid, 'habits', habitId))

// Recreates a deleted habit at its original id, so an "Undo" action can
// restore it (including its completedDates history) after deleteHabit.
export const restoreHabit = (uid, habitId, data) => setDoc(doc(db, 'users', uid, 'habits', habitId), data)

export const toggleHabitCompletion = (uid, habit) => {
  const habitRef = doc(db, 'users', uid, 'habits', habit.id)
  const completedDates = habit.completedDates || []
  const today = todayKey()

  if (habit.frequency === 'Weekly') {
    const currentWeekKey = formatDate(startOfWeek(new Date()))
    const thisWeekDates = completedDates.filter(
      (dateStr) => formatDate(startOfWeek(parseDateKey(dateStr))) === currentWeekKey,
    )

    if (thisWeekDates.length > 0) {
      return updateDoc(habitRef, { completedDates: arrayRemove(...thisWeekDates) })
    }
    return updateDoc(habitRef, { completedDates: arrayUnion(today) })
  }

  const alreadyDone = completedDates.includes(today)
  return updateDoc(habitRef, {
    completedDates: alreadyDone ? arrayRemove(today) : arrayUnion(today),
  })
}
