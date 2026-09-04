import { Flame } from "lucide-react"
import { useAuth } from "../context/useAuth"

const ProgressCard = ({ completedToday = 0, totalHabits = 0, bestStreak = 0 }) => {
    const { user } = useAuth()
    const firstName = (user?.displayName || user?.email || "there").split(" ")[0].split("@")[0]
    const progressPercent = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100)

    return(
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-indigo-700 dark:to-indigo-600 rounded-2xl p-5 shadow-sm shadow-indigo-200 dark:shadow-none mx-4 mt-4">

        {/* Fila superior */}
        <div className="flex justify-between items-start gap-3">
            <div>
            <h2 className="text-lg font-bold text-white">Daily Progress</h2>
            <h4 className="text-sm text-indigo-100">
                {totalHabits === 0 ? `Add your first habit, ${firstName}!` : `You're doing great, ${firstName}!`}
            </h4>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full pl-2 pr-3 py-1 shrink-0">
                <Flame size={16} className="text-orange-300" fill="currentColor" />
                <span className="text-base font-bold text-white leading-none">{bestStreak}</span>
            </div>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white/20 rounded-full h-2 mt-5">
            <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
        <p className="text-xs text-indigo-100 mt-2">{completedToday} of {totalHabits} habits completed today</p>
        </div>
    )

}

export default ProgressCard
