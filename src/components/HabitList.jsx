import { Sparkles } from 'lucide-react'
import HabitItem from './HabitItem'
import { getCategory } from '../utils/habits'

const HabitList = ({ habits, onToggle, onEdit, onDelete }) => {

  if (habits.length === 0) {
    return (
      <div className="mx-4 mt-4 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="text-indigo-500 dark:text-indigo-400" size={22} />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No habits yet</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Tap the + button below to add your first one.</p>
      </div>
    )
  }

  return (
    <>
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          category={getCategory(habit.category)}
          name={habit.name}
          streakCount={habit.streakCount}
          frequency={habit.frequency}
          completed={habit.completed}
          onToggle={() => onToggle(habit.id)}
          onEdit={() => onEdit(habit.id)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </>
  )
}

export default HabitList
