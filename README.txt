JUNGLE PARK installable version. Host this folder on any HTTPS static host (Netlify Drop, GitHub Pages). Live GPS, camera QR scanning and offline install work here.

Sync without accounts or a server of your own:
- Signing in on another device, adding friends and keeping friends' stats up to date go through an encrypted relay (ntfy.sh by default). Change it under My Profile > Devices & sync > Sync relay; all devices and friends must use the same relay.
- Everything is encrypted in the browser (JSON > gzip > AES-GCM with a random IV) before it is sent. Keys come from random 128-bit secrets via SHA-256; the relay only sees random topic names and ciphertext.
- "Show sign-in code" gives an 8-character code (valid 15 minutes) and a QR code. Friend codes are 8 characters too; they work while the owner has opened the app within the last 12 hours (the relay keeps messages for 12 hours). The friend QR code always works.
- ntfy.sh is a free public service with rate limits. Heavy use (many devices or friends) may hit them; a self-hosted ntfy server removes the limits.
- The buddy board also works over the relay (posts are end-to-end encrypted; buddies see them).
- The coach directory works here too, over the same relay. A coach's listing goes live as soon as they send the Join as coach form (the application is still emailed for review). Listings are signed on the coach's device so nobody else can change or remove them, every app keeps the listings it has seen for 30 days, and the coach's app republishes the listing every few hours while it is open (the relay forgets messages after 12 hours). The Certified badge is only given in the claude.ai version, where the admin approves coaches. A listing can be edited or removed only from the device that created it.
- Gym memberships, invites, stories and coaching still need the live sync of the claude.ai version, or use Demo mode.

Demo mode: My Profile > For gyms & coaches > Demo mode (password 09876543210). Opens a sample gym business and coach (personal trainer & nutritionist) profile with Pro, running on a local sandbox database on the device. Your real profile is untouched; tap Demo > Exit to leave.

Progress photos are saved on the device first (IndexedDB) and upload when a connection is back: to your coach in the claude.ai version, and to your linked devices over the relay here.
QR codes are drawn by a built-in encoder when the CDN library cannot load, so they also work offline.
Map tiles are cached by the service worker (sw.js, cache "jp-tiles-v1", about 600 tiles) so the run map loads instantly after the first visit.
Coach and gym applications from this copy are emailed to abbeldawit@gmail.com through FormSubmit (formsubmit.co). The first application triggers a one-time confirmation email: click Activate in it, and every later application arrives in your inbox.

PUBLIC LIST OF GYMS AND COACHES (until the app has its own database)
- Gyms and coaches come from the "directory" folder: directory/index.json says which region file each city is in, and directory/regions/ holds 7 region files: ethiopia, africa, middle-east, south-asia, asia-pacific, europe and americas. The whole app is 19 files, under GitHub's 100-files-per-upload limit, and every file is far under the 25 MB limit.
- Inside a region file, each city is on its own line: "City name":{"currency":...,"gyms":[...],"coaches":[...]}. Each city starts with 10 sample gyms, 10 sample personal trainers and 10 sample nutritionists. Samples have "sample": true and show a Sample badge in the app.
- To add a real gym or coach: open the region file on GitHub, press the pencil (Edit), find the city line (Ctrl+F / Cmd+F), copy one entry, change it, set "sample" to false (or delete samples you don't want), and Commit changes. Apps pick up the change within about 30 minutes, or the next time they open.
- Gym fields: id (letters and numbers only, unique, e.g. "pgbolefit01"), name, address, phones (up to 3), hours, plans (n, m = months, price), classes (title, days, time, cap, price, memberFree).
- Coach fields: id (letters and numbers only, unique), type ("trainer", "nutritionist" or "both"), name, bio, tags, years, price, wa (WhatsApp number), tg (Telegram username).
- Keep the files valid JSON (commas between entries, double quotes). GitHub shows an error preview if something is wrong.
- Phones download only their region file and keep just their own city, so the list works offline after the first load.
- In this installed copy, joining a listed gym saves it on the phone so members can check in and log visits. In Demo mode the listed gyms and coaches go into the demo database, so joining, approval, check-in and coach requests all work end to end.
