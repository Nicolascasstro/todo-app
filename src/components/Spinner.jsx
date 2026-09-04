const Spinner = ({ size = 22 }) => (
  <div
    role="status"
    aria-label="Loading"
    className="rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 animate-spin"
    style={{ width: size, height: size }}
  />
)

export default Spinner
