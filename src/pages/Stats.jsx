import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { useAuth } from "../context/useAuth"
import { useHabits } from "../hooks/useHabits"
import { calculateStreak, formatDate } from "../utils/habits"

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const getLastSevenDays = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - i)
    days.push(day)
  }
  return days
}

const Stats = () => {
  const { user } = useAuth()
  const { habits, loading, error } = useHabits(user?.uid)

  const days = getLastSevenDays()
  const totalHabits = habits.length
  const bestStreak = Math.max(0, ...habits.map((habit) => calculateStreak(habit.completedDates, habit.frequency)))
  const totalCompletions = habits.reduce((sum, habit) => sum + (habit.completedDates?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <Header />

      <div className="px-4 mt-6 space-y-4">

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl p-3">
            Couldn't load your habits. Please try again in a moment.
          </p>
        )}

        {!error && loading && (
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading stats...</p>
        )}

        {!error && !loading && (
        <>
        {/* Calendario de los últimos 7 días */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Last 7 Days</h2>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex justify-between">
            {days.map((day, index) => {
              const key = formatDate(day)
              const completedCount = habits.filter((habit) => (habit.completedDates || []).includes(key)).length
              const allDone = totalHabits > 0 && completedCount === totalHabits
              const someDone = completedCount > 0 && !allDone
              return (
                <div key={key} className="flex flex-col items-center gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{DAY_LABELS[index]}</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    allDone ? "bg-blue-600 dark:bg-blue-500" : someDone ? "bg-blue-200 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"
                  }`}>
                    <span className={`text-xs ${allDone ? "text-white" : "text-gray-400 dark:text-gray-500"}`}>
                      {completedCount > 0 ? "✓" : "-"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{bestStreak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Best Streak</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalCompletions}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Completions</p>
          </div>
        </div>

        {/* Rachas por hábito */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Habit Streaks</h2>
          {habits.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No habits yet.</p>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.id} className="flex justify-between items-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{habit.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">🔥 {calculateStreak(habit.completedDates, habit.frequency)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}

      </div>

      <Navbar />
    </div>
  )
}

export default Stats
