import React from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const Stats = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <div className="px-4 mt-6">
        
        {/* Calendario semanal */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-800">This Week</h2>
            <p className="text-sm text-blue-600">June 12 - 18</p>
          </div>
          <div className="flex justify-between">
            {days.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <p className="text-xs text-gray-500">{day}</p>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Navbar />
    </div>
  )
}

export default Stats