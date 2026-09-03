import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // The remaining large chunk is the Firebase SDK (auth + firestore),
    // required upfront for the auth gate — not meaningfully splittable.
    chunkSizeWarningLimit: 850,
  },
})