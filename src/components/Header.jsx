import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className='flex justify-between items-center px-4 py-4 bg-white dark:bg-gray-900'>
      <h1 className='text-xl font-bold text-blue-600 dark:text-blue-400'>HabitFlow</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button onClick={handleLogout} aria-label="Log out">
          <LogOut className="text-gray-500 dark:text-gray-400" size={22} />
        </button>
      </div>
    </div>
  )
}

export default Header
