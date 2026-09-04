import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

// injectManifest mode (unlike the default generateSW mode) doesn't add this
// automatically. Without it, registerType: 'autoUpdate' has no effect: a new
// SW version installs but sits "waiting" forever, so visitors stay stuck on
// whatever was cached at their first visit until they clear site data.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Local reminder notifications are shown via registration.showNotification()
// from the page (see src/context/ReminderContext.jsx). Without this handler,
// tapping one just dismisses it — it wouldn't bring the app to front.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow('/home')
      return undefined
    }),
  )
})
