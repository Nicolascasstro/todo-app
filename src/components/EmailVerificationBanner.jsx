import { useState } from 'react'
import { useAuth } from '../context/useAuth'

const EmailVerificationBanner = () => {
  const { user, resendVerificationEmail } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [sent, setSent] = useState(false)

  if (!user || user.emailVerified || dismissed) return null

  const handleResend = async () => {
    try {
      await resendVerificationEmail()
      setSent(true)
    } catch {
      // Firebase rate-limits repeated requests; failing silently here is fine,
      // the user already has the original verification email to fall back on.
    }
  }

  return (
    <div className="mx-4 mt-4 bg-yellow-50 dark:bg-yellow-950 rounded-2xl p-4 flex items-start justify-between gap-3 animate-fade-in">
      <div>
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Verify your email</p>
        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
          {sent ? "Verification email sent. Check your inbox." : "We sent a verification link to your email address."}
        </p>
        {!sent && (
          <button onClick={handleResend} className="text-sm font-medium text-yellow-800 dark:text-yellow-300 underline mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 rounded">
            Resend email
          </button>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-yellow-600 dark:text-yellow-400 text-lg leading-none p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
      >
        ×
      </button>
    </div>
  )
}

export default EmailVerificationBanner
