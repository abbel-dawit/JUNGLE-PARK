JUNGLE PARK installable version. Host this folder on any HTTPS static host (Netlify Drop, GitHub Pages). Live GPS, camera QR scanning and offline install work here.

Sync without accounts or a server of your own:
- Signing in on another device, adding friends and keeping friends' stats up to date go through an encrypted relay (ntfy.sh by default). Change it under My Profile > Devices & sync > Sync relay; all devices and friends must use the same relay.
- Everything is encrypted in the browser (JSON > gzip > AES-GCM with a random IV) before it is sent. Keys come from random 128-bit secrets via SHA-256; the relay only sees random topic names and ciphertext.
- "Show sign-in code" gives an 8-character code (valid 15 minutes) and a QR code. Friend codes are 8 characters too; they work while the owner has opened the app within the last 12 hours (the relay keeps messages for 12 hours). The friend QR code always works.
- ntfy.sh is a free public service with rate limits. Heavy use (many devices or friends) may hit them; a self-hosted ntfy server removes the limits.
- The buddy board also works over the relay (posts are end-to-end encrypted; buddies see them).
- Gym memberships, invites, stories and coaching still need the live sync of the claude.ai version, or use Demo mode.

Demo mode: My Profile > For gyms & coaches > Demo mode (password 09876543210). Opens a sample gym business and coach (personal trainer & nutritionist) profile with Pro, running on a local sandbox database on the device. Your real profile is untouched; tap Demo > Exit to leave.

Progress photos are saved on the device first (IndexedDB) and upload when a connection is back: to your coach in the claude.ai version, and to your linked devices over the relay here.
QR codes are drawn by a built-in encoder when the CDN library cannot load, so they also work offline.
Map tiles are cached by the service worker (sw.js, cache "jp-tiles-v1", about 600 tiles) so the run map loads instantly after the first visit.
Coach and gym applications from this copy are emailed to abbeldawit@gmail.com through FormSubmit (formsubmit.co). The first application triggers a one-time confirmation email: click Activate in it, and every later application arrives in your inbox.
