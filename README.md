# HabitFlow

A daily habit tracker built with React and Firebase. Sign up, add habits, mark them done, and watch your streaks build — all synced live to your account across devices and available in dark mode.

## Features

- **Auth** — email/password sign up, login, logout, and password reset, all via Firebase Auth
- **Habits** — create habits with a name, frequency (Daily/Weekly) and category (Health, Work, Mindset, Social), mark them complete, delete with a confirmation prompt
- **Streaks** — daily habits track consecutive days, weekly habits track consecutive weeks
- **Real-time sync** — habits live in Firestore under `users/{uid}/habits`, secured by per-user rules, and update live across tabs/devices
- **Dashboard** — daily progress card with completion percentage and best streak
- **Stats** — 7-day completion overview and per-habit streaks
- **Dark mode** — follows system preference by default, toggleable, persisted per device
- **Resilient by default** — protected routes, a catch-all redirect for unknown URLs, an error boundary, and a clear setup message when Firebase isn't configured yet (instead of a blank screen)

## Tech stack

- [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/) (route-based code splitting via `React.lazy`)
- [Vite 8](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first config, class-based dark mode)
- [Firebase](https://firebase.google.com/) — Authentication + Firestore
- [lucide-react](https://lucide.dev/) icons

## Project structure

```
src/
  components/     UI building blocks (HabitItem, Navbar, Header, ThemeToggle, ...)
  context/        AuthContext — Firebase auth state available app-wide
  hooks/          useHabits (live Firestore subscription), useTheme
  pages/          Login, Home, Add, Stats — one per route
  utils/          habits.js (streaks, categories), habitsApi.js (Firestore reads/writes)
  firebase.js     Firebase app/auth/firestore initialization
firestore.rules    Security rules: each user can only read/write their own habits
```

## Getting started

```bash
npm install
```

### Configure Firebase

This app needs a Firebase project for authentication and data storage:

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project.
2. Go to **Build > Authentication > Get started**, then enable the **Email/Password** sign-in provider.
3. Go to **Build > Firestore Database**, click **Create database**, pick a location, and start in **production mode**.
4. In the Firestore **Rules** tab, replace the contents with what's in [`firestore.rules`](./firestore.rules) and publish:

   ```
   rules_version = '2';

   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/habits/{habitId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

5. Go to **Project settings > General**, scroll to "Your apps", and add a **Web app**.
6. Copy the config values Firebase gives you.
7. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

Without a `.env` file, the app still runs but shows a "Firebase isn't configured" message on login/signup instead of crashing.

### Run

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # run eslint
```

### Deploying

`vercel.json` and `public/_redirects` are included so client-side routing keeps working on a hard refresh or direct link, on Vercel and Netlify respectively. After deploying:

- Add the deployed domain to **Firebase Console > Authentication > Settings > Authorized domains**.
- Set the six `VITE_FIREBASE_*` variables in your hosting provider's environment variable settings.

## Author

Built by [Nicolás Martínez](https://github.com/Nicolascasstro).
