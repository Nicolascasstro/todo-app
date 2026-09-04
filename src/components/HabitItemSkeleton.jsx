const HabitItemSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mx-4 mt-4 flex items-center gap-3 animate-pulse border border-transparent">
    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
  </div>
)

export default HabitItemSkeleton
