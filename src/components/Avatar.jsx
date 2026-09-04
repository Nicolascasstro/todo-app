const initialsFrom = (user) => {
  const source = user?.displayName || user?.email || "?"
  return source.trim().charAt(0).toUpperCase()
}

const Avatar = ({ user, size = 40, className = "" }) => {
  const style = { width: size, height: size }

  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt=""
        style={style}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      style={style}
      className={`rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold shrink-0 ${className}`}
    >
      {initialsFrom(user)}
    </div>
  )
}

export default Avatar
