import { Home, Plus, BarChart2 } from 'lucide-react'
import { useLocation } from "react-router-dom"
import { useSafeNavigate } from "../hooks/useSafeNavigate"

const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/add', label: 'Add', icon: Plus },
  { path: '/stats', label: 'Stats', icon: BarChart2 },
]

const Navbar = () => {

    const navigate = useSafeNavigate();
    const location = useLocation();

    return(

        <div className="fixed bottom-0 inset-x-0 z-20 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full shadow-lg shadow-slate-300/40 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 px-2 py-2">
                {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path
                  const isAdd = path === '/add'
                  return (
                    <button
                      key={path}
                      onClick={() => navigate(path)}
                      aria-label={label === 'Add' ? 'Add habit' : label}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex flex-col items-center justify-center gap-1 rounded-full px-5 py-1.5 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        isActive && !isAdd ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {isAdd ? (
                        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white -mt-0.5">
                          <Icon size={18} strokeWidth={2.5} />
                        </span>
                      ) : (
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      )}
                      <span className={`text-[10px] leading-none ${isActive && !isAdd ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                    </button>
                  )
                })}
            </div>
        </div>

    )
}

export default Navbar
