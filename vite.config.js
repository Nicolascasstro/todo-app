import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registered manually via virtual:pwa-register in main.jsx instead.
      injectRegister: false,
      // manifest.json is hand-maintained and already linked from index.html —
      // let the plugin generate the service worker only, not a second manifest.
      manifest: false,
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      // A custom service worker (src/sw.js) instead of the default
      // generated one, so it can handle notificationclick for reminders.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  build: {
    // The remaining large chunk is the Firebase SDK (auth + firestore +
    // storage), required upfront for the auth gate — not meaningfully splittable.
    chunkSizeWarningLimit: 950,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
})
