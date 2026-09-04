import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react'

const HabitItem = ({ category, name, streakCount = 0, frequency = "Daily", completed, onToggle, onEdit, onDelete }) => {
    const unit = frequency === "Weekly" ? "week" : "day"
    const Icon = category.icon

    return(
        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mx-4 mt-4 flex justify-between items-center gap-3 border transition-colors ${
            completed ? "border-indigo-100 dark:border-indigo-900/60" : "border-transparent"
        }`}>

            {/* Izquierda: icono + textos */}
            <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${category.inactiveClasses}`}>
                    <Icon size={18} />
                </div>
                <div className="min-w-0">
                    <h2 className={`text-base font-semibold truncate ${completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"}`}>{name}</h2>
                    <p className='text-sm text-slate-500 dark:text-slate-400'>🔥 {streakCount} {unit}{streakCount === 1 ? "" : "s"} streak</p>
                </div>
            </div>

            {/* Derecha: editar + borrar + check */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={onEdit}
                    aria-label="Edit habit"
                    className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 active:scale-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                    <Pencil size={17} />
                </button>
                <button
                    onClick={onDelete}
                    aria-label="Delete habit"
                    className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 active:scale-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                    <Trash2 size={17} />
                </button>
                <button
                    onClick={onToggle}
                    aria-label="Toggle habit completion"
                    aria-pressed={completed}
                    className="p-1 rounded-full active:scale-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                    {completed ? (
                        <CheckCircle2 size={38} className="text-indigo-600 dark:text-indigo-400 animate-check-pop" />
                    ) : (
                        <Circle size={38} className="text-slate-200 dark:text-slate-600" />
                    )}
                </button>
            </div>

        </div>
    )

}

export default HabitItem
