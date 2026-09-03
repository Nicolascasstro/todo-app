import { Home, Plus, BarChart2 } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"

const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/add', label: 'Add habit', icon: Plus },
  { path: '/stats', label: 'Stats', icon: BarChart2 },
]

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    return(

        <div className='w-full bg-white dark:bg-gray-900 py-4 fixed bottom-0 left-0 grid grid-flow-col justify-items-center'>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'} />
                </button>
              )
            })}
        </div>

    )
}

export default Navbar
