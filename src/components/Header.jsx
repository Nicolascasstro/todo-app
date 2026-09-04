import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import ThemeToggle from './ThemeToggle'
import Avatar from './Avatar'

const Header = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className='flex justify-between items-center px-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800'>
      <h1 className='text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight'>HabitFlow</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => navigate('/profile')}
          aria-label="Your profile"
          className="rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Avatar user={user} size={32} />
        </button>
      </div>
    </div>
  )
}

export default Header
