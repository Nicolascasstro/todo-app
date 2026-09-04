import { useState } from "react"
import Navbar from "../components/Navbar"
import ProgressCard from "../components/ProgressCard"
import HabitList from "../components/HabitList"
import HabitItemSkeleton from "../components/HabitItemSkeleton"
import Header from "../components/Header"
import Toast from "../components/Toast"
import EmailVerificationBanner from "../components/EmailVerificationBanner"
import { useAuth } from "../context/useAuth"
import { useHabits } from "../hooks/useHabits"
import { useSafeNavigate } from "../hooks/useSafeNavigate"
import { calculateStreak, isCompletedForPeriod } from "../utils/habits"
import { toggleHabitCompletion, deleteHabit, restoreHabit } from "../utils/habitsApi"

const Home = () => {
  const { user } = useAuth()
  const navigate = useSafeNavigate()
  const { habits, loading, error } = useHabits(user?.uid)
  const [deletedHabit, setDeletedHabit] = useState(null)

  const habitsWithProgress = habits.map((habit) => ({
    ...habit,
    completed: isCompletedForPeriod(habit.completedDates, habit.frequency),
    streakCount: calculateStreak(habit.completedDates, habit.frequency),
  }))

  const completedToday = habitsWithProgress.filter((habit) => habit.completed).length
  const bestStreak = Math.max(0, ...habitsWithProgress.map((habit) => habit.streakCount))

  const handleDelete = (id) => {
    const habit = habits.find((h) => h.id === id)
    if (!habit) return
    const { id: habitId, ...data } = habit
    deleteHabit(user.uid, habitId)
    setDeletedHabit({ id: habitId, data })
  }

  const handleUndoDelete = () => {
    if (deletedHabit) restoreHabit(user.uid, deletedHabit.id, deletedHabit.data)
    setDeletedHabit(null)
  }

  return (
    <div className="min-h-screen bg-indigo-50 dark:bg-slate-900 pb-24">
      <Header />
      <EmailVerificationBanner />
      <ProgressCard
        completedToday={completedToday}
        totalHabits={habits.length}
        bestStreak={bestStreak}
      />
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest px-4 mt-6 mb-2">TODAY'S HABITS</p>
      {error && (
        <p className="mx-4 mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl p-3">
          Couldn't load your habits. Please try again in a moment.
        </p>
      )}
      {!error && loading ? (
        <>
          <HabitItemSkeleton />
          <HabitItemSkeleton />
          <HabitItemSkeleton />
        </>
      ) : (
        !error && (
          <HabitList
            habits={habitsWithProgress}
            onToggle={(id) => toggleHabitCompletion(user.uid, habits.find((habit) => habit.id === id))}
            onEdit={(id) => navigate(`/edit/${id}`)}
            onDelete={handleDelete}
          />
        )
      )}
      <Navbar />

      {deletedHabit && (
        <Toast
          message={`"${deletedHabit.data.name}" deleted`}
          actionLabel="Undo"
          onAction={handleUndoDelete}
          onDismiss={() => setDeletedHabit(null)}
        />
      )}
    </div>
  )
}

export default Home
