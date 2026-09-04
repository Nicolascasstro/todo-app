import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Header from "../components/Header"
import Spinner from "../components/Spinner"
import { useAuth } from "../context/useAuth"
import { CATEGORIES, FREQUENCIES, getCategory } from "../utils/habits"
import { addHabit, getHabit, updateHabit } from "../utils/habitsApi"

const Add = () => {
    const navigate = useNavigate()
    const { habitId } = useParams()
    const { user } = useAuth()
    const isEditing = Boolean(habitId)

    const [newHabit, setNewHabit] = useState("")
    const [frequency, setFrequency] = useState(FREQUENCIES[0])
    const [category, setCategory] = useState(CATEGORIES[0].id)
    const [saving, setSaving] = useState(false)
    const [loadingHabit, setLoadingHabit] = useState(isEditing)

    useEffect(() => {
      if (!isEditing || !user) return
      getHabit(user.uid, habitId).then((habit) => {
        if (habit) {
          setNewHabit(habit.name)
          setFrequency(habit.frequency || FREQUENCIES[0])
          setCategory(habit.category || CATEGORIES[0].id)
        }
        setLoadingHabit(false)
      })
    }, [isEditing, habitId, user])

    const handleSave = async () => {
      if (newHabit.trim() === "" || saving) return

      setSaving(true)
      try {
        if (isEditing) {
          await updateHabit(user.uid, habitId, { name: newHabit.trim(), frequency, category })
        } else {
          await addHabit(user.uid, { name: newHabit.trim(), frequency, category })
        }
        setNewHabit("")
        navigate("/home")
      } finally {
        setSaving(false)
      }
    }

    const selectedCategory = getCategory(category)
    const PreviewIcon = selectedCategory.icon

      return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
            <Header />

        <div className="px-4 mt-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{isEditing ? "Edit Habit" : "New Habit"}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Every small step counts towards a better version of you.</p>

          {loadingHabit ? (
            <div className="flex justify-center mt-10">
              <Spinner />
            </div>
          ) : (
          <>
          {/* Live preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mt-6 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedCategory.inactiveClasses}`}>
              <PreviewIcon size={18} />
            </div>
            <div className="min-w-0">
              <p className={`text-base font-semibold truncate ${newHabit.trim() ? "text-slate-800 dark:text-slate-100" : "text-slate-300 dark:text-slate-600"}`}>
                {newHabit.trim() || "Your habit name"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{frequency} &middot; {selectedCategory.label}</p>
            </div>
          </div>

          {/* Input */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mt-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Habit Name</p>
            <input
              type="text"
              placeholder="e.g., Morning Meditation"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            {/* Frecuencia */}
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 mb-2">Frequency</p>
            <div className="flex gap-3">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    frequency === freq ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>

            {/* Categoría */}
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const CatIcon = cat.icon
                const isSelected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isSelected ? cat.activeClasses : cat.inactiveClasses
                    }`}
                  >
                    <CatIcon size={14} />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl mt-6 hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            {saving ? "Saving..." : isEditing ? "Save Changes ✓" : "Save Habit ✓"}
          </button>

          <div className="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <div className="bg-indigo-600 rounded-xl p-2">
              <span className="text-white text-lg">⚡</span>
          </div>
          <div>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">Consistency is key</p>
            <p className="text-indigo-500 dark:text-indigo-300 text-sm mt-1">Users who set daily goals are 3x more likely to stick to their habits.</p>
          </div>
          </div>
          </>
          )}
        </div>

        <Navbar />
      </div>
  )

}

export default Add
