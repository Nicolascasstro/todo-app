import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../context/useAuth"
import ThemeToggle from "../components/ThemeToggle"

const friendlyError = (code) => {
  switch (code) {
    case "auth/not-configured":
      return "Firebase isn't configured yet. Add your credentials to a .env file (see .env.example)."
    case "auth/email-already-in-use":
      return "That email is already registered."
    case "auth/invalid-email":
      return "Please enter a valid email address."
    case "auth/weak-password":
      return "Password should be at least 6 characters."
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password."
    case "auth/missing-email":
      return "Enter your email above first, then click \"Forgot Password?\"."
    default:
      return "Something went wrong. Please try again."
  }
}

const Login = () => {
  const navigate = useNavigate()
  const { user, login, signup, resetPassword } = useAuth()

  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isSignup = mode === "signup"

  useEffect(() => {
    if (user) navigate("/home", { replace: true })
  }, [user, navigate])

  const handleForgotPassword = async () => {
    setError("")
    setInfo("")

    if (!email) {
      setError("Enter your email above first, then click \"Forgot Password?\".")
      return
    }

    try {
      await resetPassword(email)
      setInfo("Password reset email sent. Check your inbox.")
    } catch (err) {
      setError(friendlyError(err.code))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")

    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    try {
      if (isSignup) {
        await signup(name, email, password)
      } else {
        await login(email, password)
      }
      navigate("/home")
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src="/src/assets/logo.png" alt="HabitFlow logo" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">HabitFlow</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Step into your better self.</p>
        </div>

        {/* Card del formulario */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {isSignup ? "Start building better habits today." : "Please enter your credentials to continue."}
          </p>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          {info && (
            <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-lg px-3 py-2 mb-4">{info}</p>
          )}

          {isSignup && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Name</label>
              <input
                type="text"
                placeholder="Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              {!isSignup && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : isSignup ? "Sign up →" : "Login →"}
          </button>
        </form>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
            onClick={() => {
              setMode(isSignup ? "login" : "signup")
              setError("")
              setInfo("")
            }}
          >
            {isSignup ? "Log in" : "Sign up"}
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login
