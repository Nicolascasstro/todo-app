import { Flame, TrendingUp } from "lucide-react"
import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { useAuth } from "../context/useAuth"
import { useHabits } from "../hooks/useHabits"
import { calculateStreak, formatDate, getCategory, todayKey } from "../utils/habits"

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      <Header />

      <div className="px-4 mt-6 space-y-4">

        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest">YOUR PROGRESS</p>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl p-3">
            Couldn't load your habits. Please try again in a moment.
          </p>
        )}

        {!error && loading && (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm h-32" />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm h-20" />
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm h-20" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm h-24" />
          </div>
        )}

        {!error && !loading && (
        <>
        {/* Calendario de los últimos 7 días */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Last 7 Days</h2>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="flex justify-between">
            {days.map((day, index) => {
              const key = formatDate(day)
              const completedCount = habits.filter((habit) => (habit.completedDates || []).includes(key)).length
              const allDone = totalHabits > 0 && completedCount === totalHabits
              const someDone = completedCount > 0 && !allDone
              const isToday = key === todayKey()
              return (
                <div key={key} className="flex flex-col items-center gap-2">
                  <p className={`text-xs ${isToday ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-slate-500 dark:text-slate-400"}`}>{DAY_LABELS[index]}</p>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    allDone ? "bg-indigo-600 dark:bg-indigo-500" : someDone ? "bg-indigo-200 dark:bg-indigo-900" : "bg-slate-100 dark:bg-slate-700"
                  } ${isToday ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-800" : ""}`}>
                    <span className={`text-xs ${allDone ? "text-white" : "text-slate-400 dark:text-slate-500"}`}>
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center mb-2">
              <Flame size={16} className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{bestStreak}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Best Streak</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mb-2">
              <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalCompletions}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total Completions</p>
          </div>
        </div>

        {/* Rachas por hábito */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Habit Streaks</h2>
          {habits.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No habits yet.</p>
          ) : (
            <div className="space-y-1">
              {habits.map((habit) => {
                const category = getCategory(habit.category)
                const CatIcon = category.icon
                return (
                  <div key={habit.id} className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${category.inactiveClasses}`}>
                        <CatIcon size={13} />
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{habit.name}</p>
                    </div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium shrink-0 ml-2">🔥 {calculateStreak(habit.completedDates, habit.frequency)}</p>
                  </div>
                )
              })}
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
