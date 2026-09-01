import React from "react"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Add = () =>{

    const navigate = useNavigate();

    const [newHabit, setNewHabit] = useState("")

    const handleSave = () => {
      if (newHabit.trim() === "") return

      const habitsGuardados = JSON.parse(localStorage.getItem("habits")) || []
  
      const nuevoHabito = {
        id: Date.now(),
        name: newHabit,
      }

      localStorage.setItem("habits", JSON.stringify([...habitsGuardados, nuevoHabito]))
      setNewHabit("")
      navigate("/home")
    }

      return (
          <div className="min-h-screen bg-gray-50 pb-24">
            <Header />
  
        <div className="px-4 mt-6">
          <h1 className="text-2xl font-bold text-gray-800">New Habit</h1>
          <p className="text-gray-500 text-sm mt-1">Every small step counts towards a better version of you.</p>

          {/* Input */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Habit Name</p>
            <input 
              type="text" 
              placeholder="e.g., Morning Meditation"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Frecuencia */}
            <p className="text-sm font-medium text-gray-700 mt-4 mb-2">Frequency</p>
            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">Daily</button>
              <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">Weekly</button>
            </div>

            {/* Categoría */}
            <p className="text-sm font-medium text-gray-700 mt-4 mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">Health</button>
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">Work</button>
              <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">Mindset</button>
              <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">Social</button>
            </div>
          </div>

          {/* Botón guardar */}
          <button onClick={handleSave} className="w-full bg-blue-600 text-white font-semibold py-4 rounded-2xl mt-6 hover:bg-blue-700 transition">
            Save Habit ✓
          </button>

          <div className="bg-blue-50 rounded-2xl p-4 mt-4 flex items-start gap-3">
            <div className="bg-blue-600 rounded-xl p-2">
              <span className="text-white text-lg">⚡</span>
          </div>
          <div>
            <p className="text-blue-600 font-bold text-sm">Consistency is key</p>
            <p className="text-blue-500 text-sm mt-1">Users who set daily goals are 3x more likely to stick to their habits.</p>
          </div>
          </div>
        </div>

        <Navbar />
      </div>
  )

}


export default Add