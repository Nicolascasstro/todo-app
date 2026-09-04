import { useNavigate } from 'react-router-dom'

// The very first client-side navigation away from a freshly-mounted route
// tree can get silently reverted back to the previous URL a few hundred ms
// later (observed consistently, including in production builds, only ever
// on the first post-login navigation — every navigation after that is
// fine). Rather than block on a full root-cause fix, verify the URL stuck
// and retry once if it didn't.
export const useSafeNavigate = () => {
  const navigate = useNavigate()

  return (path, options) => {
    navigate(path, options)
    window.setTimeout(() => {
      if (window.location.pathname !== path) {
        navigate(path, options)
      }
    }, 1200)
  }
}
