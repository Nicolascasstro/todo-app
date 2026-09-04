import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../context/useAuth"
import ThemeToggle from "../components/ThemeToggle"
import logo from "../assets/logo.png"

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
    case "auth/account-exists-with-different-credential":
      return "That email is already registered using a different sign-in method."
    case "auth/popup-blocked":
      return "Your browser blocked the popup. Please allow popups and try again."
    default:
      return "Something went wrong. Please try again."
  }
}

// The user closing the Google popup or triggering a second one isn't a
// real error worth surfacing — everything else from that flow is.
const isDismissedPopupError = (code) =>
  code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request"

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.28a12 12 0 0 0 0 10.8l4.01-3.1Z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77Z" />
  </svg>
)

const Login = () => {
  const navigate = useNavigate()
  const { user, login, signup, resetPassword, loginWithGoogle } = useAuth()

  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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

  const handleGoogleLogin = async () => {
    setError("")
    setInfo("")
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate("/home")
    } catch (err) {
      if (!isDismissedPopupError(err.code)) setError(friendlyError(err.code))
    } finally {
      setGoogleLoading(false)
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

    if (isSignup && password !== confirmPassword) {
      setError("Passwords don't match.")
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/40 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm relative animate-fade-in">

        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            <img src={logo} alt="HabitFlow logo" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">HabitFlow</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Step into your better self.</p>
        </div>

        {/* Card del formulario */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Name</label>
              <input
                type="text"
                placeholder="Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              {!isSignup && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
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
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          {isSignup && (
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          )}

          {/* Botón login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
          >
            {loading ? "Please wait..." : isSignup ? "Sign up →" : "Login →"}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 dark:text-slate-500">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 active:scale-[0.98] transition disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
          >
            <GoogleIcon />
            {googleLoading ? "Please wait..." : "Continue with Google"}
          </button>
        </form>

        {/* Sign up */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            onClick={() => {
              setMode(isSignup ? "login" : "signup")
              setError("")
              setInfo("")
              setConfirmPassword("")
            }}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>

      </div>
    </div>
  )
}

export default Login
