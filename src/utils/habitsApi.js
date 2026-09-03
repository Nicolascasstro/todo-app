import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '../firebase'
import { todayKey } from './habits'

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

export const addHabit = (uid, { name, category, frequency }) =>
  addDoc(habitsCollection(uid), {
    name,
    category,
    frequency,
    completedDates: [],
    createdAt: Date.now(),
  })

export const deleteHabit = (uid, habitId) => deleteDoc(doc(db, 'users', uid, 'habits', habitId))

export const toggleHabitCompletion = (uid, habit) => {
  const today = todayKey()
  const habitRef = doc(db, 'users', uid, 'habits', habit.id)
  const alreadyDone = (habit.completedDates || []).includes(today)
  return updateDoc(habitRef, {
    completedDates: alreadyDone ? arrayRemove(today) : arrayUnion(today),
  })
}
