import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, storage, isFirebaseConfigured, isStorageConfigured } from '../firebase'
import { AuthContext } from './authContextObject'

const NOT_CONFIGURED_ERROR = { code: 'auth/not-configured' }
const STORAGE_NOT_CONFIGURED_ERROR = { code: 'storage/not-configured' }
const googleProvider = new GoogleAuthProvider()

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
    await sendEmailVerification(newUser)
    return newUser
  }

  const resendVerificationEmail = () => {
    if (!isFirebaseConfigured || !auth.currentUser) return Promise.reject(NOT_CONFIGURED_ERROR)
    return sendEmailVerification(auth.currentUser)
  }

  const login = (email, password) => {
    if (!isFirebaseConfigured) return Promise.reject(NOT_CONFIGURED_ERROR)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) throw NOT_CONFIGURED_ERROR
    const { user: signedInUser } = await signInWithPopup(auth, googleProvider)
    setUser(signedInUser)
    return signedInUser
  }

  const updateDisplayName = async (name) => {
    if (!isFirebaseConfigured || !auth.currentUser) throw NOT_CONFIGURED_ERROR
    await updateProfile(auth.currentUser, { displayName: name })
    setUser({ ...auth.currentUser, displayName: name })
  }

  const updateAvatar = async (file) => {
    if (!isStorageConfigured || !auth.currentUser) throw STORAGE_NOT_CONFIGURED_ERROR
    const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}`)
    await uploadBytes(avatarRef, file)
    const photoURL = await getDownloadURL(avatarRef)
    await updateProfile(auth.currentUser, { photoURL })
    setUser({ ...auth.currentUser, photoURL })
    return photoURL
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        resendVerificationEmail,
        updateDisplayName,
        updateAvatar,
        isFirebaseConfigured,
        isStorageConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
