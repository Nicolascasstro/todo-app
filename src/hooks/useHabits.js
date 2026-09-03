import { useEffect, useState } from 'react'
import { subscribeToHabits } from '../utils/habitsApi'

export const useHabits = (uid) => {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) return

    const unsubscribe = subscribeToHabits(
      uid,
      (nextHabits) => {
        setHabits(nextHabits)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [uid])

  return { habits, loading, error }
}
