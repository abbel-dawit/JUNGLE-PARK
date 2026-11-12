JUNGLE PARK installable version. Host this folder on any HTTPS static host (Netlify Drop, GitHub Pages). Live GPS, camera QR scanning and offline install work here. Live cloud sync runs in the claude.ai version; here friends use the Offline snapshot QR and devices use Backup / Restore.
Live friend codes (6 characters, e.g. K7M-2QX), "Sign in from another device" codes, stories, gym memberships, invites and coaching need the live sync of the claude.ai version.
QR codes are drawn by a built-in encoder when the CDN library cannot load, so they also work offline.
Map tiles are cached by the service worker (sw.js, cache "jp-tiles-v1", about 600 tiles) so the run map loads instantly after the first visit.
Coach and gym applications from this copy are emailed to abbeldawit@gmail.com through FormSubmit (formsubmit.co). The first application triggers a one-time confirmation email: click Activate in it, and every later application arrives in your inbox.
