import Navbar from "../components/Navbar"
import ProgressCard from "../components/ProgressCard"
import HabitList from "../components/HabitList"
import Header from "../components/Header"
import { useAuth } from "../context/useAuth"
import { useHabits } from "../hooks/useHabits"
import { todayKey, calculateStreak } from "../utils/habits"
import { toggleHabitCompletion, deleteHabit } from "../utils/habitsApi"

const Home = () => {
  const { user } = useAuth()
  const { habits, loading, error } = useHabits(user?.uid)

  const today = todayKey()
  const habitsWithProgress = habits.map((habit) => ({
    ...habit,
    completed: (habit.completedDates || []).includes(today),
    streakCount: calculateStreak(habit.completedDates, habit.frequency),
  }))

  const completedToday = habitsWithProgress.filter((habit) => habit.completed).length
  const bestStreak = Math.max(0, ...habitsWithProgress.map((habit) => habit.streakCount))

  const handleDelete = (id) => {
    const habit = habits.find((h) => h.id === id)
    if (habit && window.confirm(`Delete "${habit.name}"? This can't be undone.`)) {
      deleteHabit(user.uid, id)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 pb-24">
      <Header />
      <ProgressCard
        completedToday={completedToday}
        totalHabits={habits.length}
        bestStreak={bestStreak}
      />
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest px-4 mt-6 mb-2">TODAY'S HABITS</p>
      {error && (
        <p className="mx-4 mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl p-3">
          Couldn't load your habits. Please try again in a moment.
        </p>
      )}
      {!error && loading ? (
        <p className="mx-4 mt-4 text-sm text-gray-400 dark:text-gray-500">Loading habits...</p>
      ) : (
        !error && (
          <HabitList
            habits={habitsWithProgress}
            onToggle={(id) => toggleHabitCompletion(user.uid, habits.find((habit) => habit.id === id))}
            onDelete={handleDelete}
          />
        )
      )}
      <Navbar />
    </div>
  )
}

export default Home
