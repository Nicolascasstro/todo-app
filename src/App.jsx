import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReminderProvider } from './context/ReminderContext'
import ProtectedRoute from './components/ProtectedRoute'
import Spinner from './components/Spinner'

const loginImport = import('./pages/Login')
const homeImport = import('./pages/Home')
const addImport = import('./pages/Add')
const statsImport = import('./pages/Stats')
const profileImport = import('./pages/Profile')

// Route chunks are prefetched above (not just wrapped in lazy()) so the
// very first client-side navigation to any of them never has to suspend —
// letting React Router's navigate() suspend on an unresolved lazy import
// can revert the navigation back to the previous route entirely.
const Login = lazy(() => loginImport)
const Home = lazy(() => homeImport)
const Add = lazy(() => addImport)
const Stats = lazy(() => statsImport)
const Profile = lazy(() => profileImport)

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
    <Spinner />
  </div>
)

function App() {
  return (
    <AuthProvider>
      <ReminderProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/add" element={<Add />} />
                <Route path="/edit/:habitId" element={<Add />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ReminderProvider>
    </AuthProvider>
  )
}

export default App
