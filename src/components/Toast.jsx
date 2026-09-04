import { useEffect } from 'react'

const Toast = ({ message, actionLabel, onAction, onDismiss, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div className="fixed bottom-24 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto animate-pop-in flex items-center gap-3 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full shadow-lg pl-4 pr-2 py-2 max-w-sm">
        <p className="text-sm">{message}</p>
        {actionLabel && (
          <button
            onClick={onAction}
            className="text-sm font-semibold text-indigo-300 dark:text-indigo-600 hover:text-indigo-200 dark:hover:text-indigo-700 px-2 py-1 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default Toast
