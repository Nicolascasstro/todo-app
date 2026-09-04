import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Camera, LogOut, Mail, ShieldCheck, ShieldAlert } from "lucide-react"
import Navbar from "../components/Navbar"
import Header from "../components/Header"
import Avatar from "../components/Avatar"
import Spinner from "../components/Spinner"
import Switch from "../components/Switch"
import { useAuth } from "../context/useAuth"
import { useReminder } from "../context/useReminder"

const MAX_AVATAR_BYTES = 5 * 1024 * 1024

const avatarError = (code) => {
  switch (code) {
    case "storage/not-configured":
      return "Photo uploads aren't set up for this app yet."
    case "file/too-large":
      return "Please choose an image under 5MB."
    case "file/invalid-type":
      return "Please choose an image file."
    default:
      return "Couldn't upload that photo. Please try again."
  }
}

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, updateDisplayName, updateAvatar, isStorageConfigured } = useAuth()
  const { settings, updateSettings, permission, requestPermission, notificationsSupported } = useReminder()
  const fileInputRef = useRef(null)

  const [name, setName] = useState(user?.displayName || "")
  const [savingName, setSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [avatarErrorMsg, setAvatarErrorMsg] = useState("")

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const handleSaveName = async () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed === user?.displayName || savingName) return
    setSavingName(true)
    try {
      await updateDisplayName(trimmed)
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    } finally {
      setSavingName(false)
    }
  }

  const handleToggleReminder = async (nextEnabled) => {
    if (nextEnabled) {
      const currentPermission = permission === "default" ? await requestPermission() : permission
      if (currentPermission !== "granted") return
    }
    updateSettings({ enabled: nextEnabled })
  }

  const handlePickPhoto = () => fileInputRef.current?.click()

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setAvatarErrorMsg("")

    if (!file.type.startsWith("image/")) {
      setAvatarErrorMsg(avatarError("file/invalid-type"))
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarErrorMsg(avatarError("file/too-large"))
      return
    }

    setUploading(true)
    try {
      await updateAvatar(file)
    } catch (err) {
      setAvatarErrorMsg(avatarError(err.code))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      <Header />

      <div className="px-4 mt-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account details.</p>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <Avatar user={user} size={96} className="text-3xl" />
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <Spinner size={28} />
              </div>
            )}
            <button
              onClick={handlePickPhoto}
              disabled={!isStorageConfigured || uploading}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          {avatarErrorMsg && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center">{avatarErrorMsg}</p>
          )}
        </div>

        {/* Detalles de la cuenta */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mt-6">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={handleSaveName}
              disabled={savingName || !name.trim() || name.trim() === user?.displayName}
              className="px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {savingName ? "..." : nameSaved ? "Saved ✓" : "Save"}
            </button>
          </div>

          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-5 mb-2">Email</p>
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{user?.email}</span>
            </div>
            {user?.emailVerified ? (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 shrink-0 ml-2">
                <ShieldCheck size={14} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 shrink-0 ml-2">
                <ShieldAlert size={14} /> Unverified
              </span>
            )}
          </div>
        </div>

        {/* Recordatorios */}
        {notificationsSupported && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily reminder</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Nudge me about habits I haven't done yet.</p>
                </div>
              </div>
              <Switch checked={settings.enabled} onChange={handleToggleReminder} label="Daily reminder" />
            </div>

            {permission === "denied" && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-3">
                Notifications are blocked for this site. Enable them in your browser's site settings to turn this on.
              </p>
            )}

            {settings.enabled && permission === "granted" && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Remind me at</p>
                <input
                  type="time"
                  value={settings.time}
                  onChange={(e) => updateSettings({ time: e.target.value })}
                  className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Only fires while HabitFlow is open in a tab — it won't wake your device up.
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 font-semibold py-3.5 rounded-2xl mt-4 shadow-sm hover:bg-red-50 dark:hover:bg-red-950 active:scale-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>

      <Navbar />
    </div>
  )
}

export default Profile
