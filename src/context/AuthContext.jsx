import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase'
import { AuthContext } from './authContextObject'

const NOT_CONFIGURED_ERROR = { code: 'auth/not-configured' }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signup = async (name, email, password) => {
    if (!isFirebaseConfigured) throw NOT_CONFIGURED_ERROR
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      await updateProfile(newUser, { displayName: name })
      await newUser.reload()
      setUser({ ...newUser, displayName: name })
    }
    return newUser
  }

  const login = (email, password) => {
    if (!isFirebaseConfigured) return Promise.reject(NOT_CONFIGURED_ERROR)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const resetPassword = (email) => {
    if (!isFirebaseConfigured) return Promise.reject(NOT_CONFIGURED_ERROR)
    return sendPasswordResetEmail(auth, email)
  }

  const logout = () => {
    if (!isFirebaseConfigured) return Promise.resolve()
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, resetPassword, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}
