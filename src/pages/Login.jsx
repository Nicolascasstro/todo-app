import React from "react"
import { useNavigate } from "react-router-dom"

const Login = () =>{

    const navigate = useNavigate();

    return(
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src="/src/assets/logo.png" alt="HabitFlow logo" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600">HabitFlow</h1>
          <p className="text-gray-500 mt-1">Step into your better self.</p>
        </div>

        {/* Card del formulario */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Please enter your credentials to continue.</p>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <span className="text-sm text-blue-600 cursor-pointer">Forgot Password?</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón login */}
          <button onClick={() => navigate("/home")} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">
            Login →
          </button>
        </div>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <span className="text-blue-600 font-medium cursor-pointer">Sign up</span>
        </p>

      </div>
    </div>
        </>
    )
}

export default Login