import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Header from "../components/Header"
import { useAuth } from "../context/useAuth"
import { CATEGORIES, FREQUENCIES } from "../utils/habits"
import { addHabit } from "../utils/habitsApi"

const Add = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [newHabit, setNewHabit] = useState("")
    const [frequency, setFrequency] = useState(FREQUENCIES[0])
    const [category, setCategory] = useState(CATEGORIES[0].id)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
      if (newHabit.trim() === "" || saving) return

      setSaving(true)
      try {
        await addHabit(user.uid, { name: newHabit.trim(), frequency, category })
        setNewHabit("")
        navigate("/home")
      } finally {
        setSaving(false)
      }
    }

      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
            <Header />

        <div className="px-4 mt-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">New Habit</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Every small step counts towards a better version of you.</p>

          {/* Input */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habit Name</p>
            <input
              type="text"
              placeholder="e.g., Morning Meditation"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Frecuencia */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Frequency</p>
            <div className="flex gap-3">
              {FREQUENCIES.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    frequency === freq ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>

            {/* Categoría */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    category === cat.id ? cat.activeClasses : cat.inactiveClasses
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl mt-6 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Habit ✓"}
          </button>

          <div className="bg-blue-50 dark:bg-gray-800 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <div className="bg-blue-600 rounded-xl p-2">
              <span className="text-white text-lg">⚡</span>
          </div>
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">Consistency is key</p>
            <p className="text-blue-500 dark:text-blue-300 text-sm mt-1">Users who set daily goals are 3x more likely to stick to their habits.</p>
          </div>
          </div>
        </div>

        <Navbar />
      </div>
  )

}

export default Add
