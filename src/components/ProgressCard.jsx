import { useAuth } from "../context/useAuth"

const ProgressCard = ({ completedToday = 0, totalHabits = 0, bestStreak = 0 }) => {
    const { user } = useAuth()
    const firstName = (user?.displayName || user?.email || "there").split(" ")[0].split("@")[0]
    const progressPercent = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100)

    return(
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mx-4 mt-4">

        {/* Fila superior */}
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Daily Progress</h2>
            <h4 className="text-sm text-gray-500 dark:text-gray-400">
                {totalHabits === 0 ? `Add your first habit, ${firstName}!` : `You're doing great, ${firstName}!`}
            </h4>
            </div>
            <div className="text-right">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{bestStreak}</span>
            <h2 className="text-sm text-gray-800 dark:text-gray-100">DAY STREAK 🔥</h2>
            </div>
        </div>

        {/* Barra de progreso */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{completedToday} of {totalHabits} habits completed today</p>
        </div>
    )

}

export default ProgressCard
