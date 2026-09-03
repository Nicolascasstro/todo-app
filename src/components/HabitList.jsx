import HabitItem from './HabitItem'
import { getCategoryIcon } from '../utils/habits'

const HabitList = ({ habits, onToggle, onDelete }) => {

  if (habits.length === 0) {
    return (
      <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">No habits yet. Tap + to add your first one.</p>
      </div>
    )
  }

  return (
    <>
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          icon={getCategoryIcon(habit.category)}
          name={habit.name}
          streakCount={habit.streakCount}
          frequency={habit.frequency}
          completed={habit.completed}
          onToggle={() => onToggle(habit.id)}
          onDelete={() => onDelete(habit.id)}
        />
      ))}
    </>
  )
}

export default HabitList
