import { CheckCircle2, Trash2 } from 'lucide-react'

const HabitItem = ({ icon: Icon, name, streakCount = 0, frequency = "Daily", completed, onToggle, onDelete }) => {
    const unit = frequency === "Weekly" ? "week" : "day"

    return(
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mx-4 mt-4 flex justify-between items-center'>

            {/* Izquierda: icono + textos */}
            <div className="flex items-center gap-3">
                <Icon className="text-blue-500 dark:text-blue-400" />
            <div>
                <h2 className={`text-base font-bold ${completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}`}>{name}</h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>🔥 {streakCount} {unit}{streakCount === 1 ? "" : "s"} streak</p>
            </div>
            </div>

            {/* Derecha: borrar + check */}
            <div className="flex items-center gap-3">
                <button onClick={onDelete} aria-label="Delete habit">
                    <Trash2 size={18} className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition" />
                </button>
                <button onClick={onToggle} aria-label="Toggle habit completion">
                    <CheckCircle2 size={45} className={completed ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}/>
                </button>
            </div>

        </div>
    )

}

export default HabitItem
