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
- Gyms and coaches come from the "directory" folder: directory/index.json says which region file each city is in, and directory/regions/ holds 7 region files: ethiopia, africa, middle-east, south-asia, asia-pacific, europe and americas. The whole app is 20 files (whoop-worker.js included), under GitHub's 100-files-per-upload limit, and every file is far under the 25 MB limit.
- Inside a region file, each city is on its own line: "City name":{"currency":...,"gyms":[...],"coaches":[...]}. Each city starts with 10 sample gyms, 10 sample personal trainers and 10 sample nutritionists. Samples have "sample": true and show a Sample badge in the app.
- To add a real gym or coach: open the region file on GitHub, press the pencil (Edit), find the city line (Ctrl+F / Cmd+F), copy one entry, change it, set "sample" to false (or delete samples you don't want), and Commit changes. Apps pick up the change within about 30 minutes, or the next time they open.
- Gym fields: id (letters and numbers only, unique, e.g. "pgbolefit01"), name, address, phones (up to 3), hours, desc (description shown on the gym card and gym page), photos (up to 6 image URLs, shown in a scrolling gallery above the prices), plans (n, m = months, price), classes (title, days, time, cap, price, memberFree).
- Coach fields: id (letters and numbers only, unique), type ("trainer", "nutritionist" or "both"), name, bio, tags, years, price, wa (WhatsApp number), tg (Telegram username).
- Keep the files valid JSON (commas between entries, double quotes). GitHub shows an error preview if something is wrong.
- Phones download only their region file and keep just their own city, so the list works offline after the first load.
- In this installed copy, joining a listed gym saves it on the phone so members can check in and log visits. In Demo mode the listed gyms and coaches go into the demo database, so joining, approval, check-in and coach requests all work end to end.

UPDATES
- The app updates itself, also when it was added to the home screen. It checks for a new version when it opens, whenever it comes back to the front, and every 30 minutes, then reloads on its own.
- It never reloads during a run, a workout, an open form or while someone is typing; it waits and shows "An update is ready".
- Just upload the new files to GitHub. Changing index.html alone is enough; sw.js only needs a change when the offline files change (its first line holds the version name).

NEW IN 2.8
- Park and Jungle are swipeable card decks. Park: the run dashboard is in the middle; swipe left for your run history, right for stat pills, right again for weekly distance. Jungle (Train): the gym dashboard first, then your training log (all the fold-out cards), check in, and session rate. Keep swiping right to move through the Jungle tabs, and back again. On a computer use the arrows or the arrow keys.
- Tapping the bottom-bar button of the page you are on scrolls back to the top.
- Medals: 9 track distances (400 m to 2 miles), Dawn patrol and Dusk runner (start within about 45 minutes of local sunrise or sunset, using the run's GPS or your last position), more consistency medals (2/4/8/12/26/52 week streaks, 7 and 30 day streaks, 20 active days in a month), Iron 100, and 3 invite medals.
- Invites (Crew page and My Profile): share your invite link or QR. When someone who has never used JUNGLE PARK opens it and creates an account, they join your crew and you get credit (1, 3 and 5 new members). People who already had the app become friends but do not count. Over the relay here, or the live store in the claude.ai version.
- Find a coach: 4 coaches at a time on phones (2 x 2), 12 on wide screens (4 columns), with page arrows.
- Find a gym: Gyms near you is at the top with a city picker, 5 gyms at a time, and descriptions instead of prices. Gyms add a description and up to 6 photos in their sign-up form and Gym settings.
- Joining a gym is a request: the member picks a plan (the selected plan gets a theme-colour border) and follows its progress live (Sent, Seen, Approved, Active). The gym's Business dashboard has a Join requests card: Approve or Decline, then "Paid, activate check-in" once the member has paid at the front desk. Only then can the member check in, in the app or with the gym QR code. This needs the live store, so it runs end to end in the claude.ai version and in Demo mode (where listed gyms you do not own play the gym's part automatically). In this installed copy without a live store, the request is sent to the gym's WhatsApp number and tracked on the phone.
- Heart rate: measured with the phone's rear camera and flashlight (photoplethysmography). Cover both with a fingertip for about 15 seconds. Readings during a run or workout are saved with it. Apple Watch, MyZone, Bluetooth straps and the pairing link were removed. Needs HTTPS and camera permission. Not a medical device.
- WHOOP: connect through WHOOP's official API (recovery, HRV, resting HR, SpO2, skin temperature, sleep stages, strain, workouts; synced every hour while the app is open). WHOOP requires a client secret, which cannot live in a web page, so deploy whoop-worker.js once as a free Cloudflare Worker (steps at the top of that file) and paste its address under Health > Connect WHOOP. The WHOOP data export (zip/CSV) import still works without it.
