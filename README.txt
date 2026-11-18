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
- Gym fields: id (letters and numbers only, unique, e.g. "pgbolefit01"), name, type (gym, studio or runclub), address, phones (up to 3), hours, desc (description shown on the gym card and gym page), photos (up to 6 image URLs, shown in a scrolling gallery above the prices), plans (n, m = months, price), classes (title, desc, price, cap, memberFree, and either days + time, or sched: {win:[{d:0-6 (0 = Sunday), s:"06:00", e:"08:00"}], len (minutes), every (minutes), cap (spots per class), ahead (days), lead (hours notice)}).
- Coach fields: id (letters and numbers only, unique), type ("trainer", "nutritionist" or "both"), name, bio, tags, years, price, wa (WhatsApp number), tg (Telegram username).
- Keep the files valid JSON (commas between entries, double quotes). GitHub shows an error preview if something is wrong.
- Phones download only their region file and keep just their own city, so the list works offline after the first load.
- In this installed copy, joining a listed gym saves it on the phone so members can check in and log visits. In Demo mode the listed gyms and coaches go into the demo database, so joining, approval, check-in and coach requests all work end to end.

UPDATES
- The app updates itself, also when it was added to the home screen. It checks for a new version when it opens, whenever it comes back to the front, and every 30 minutes, then reloads on its own.
- It never reloads during a run, a workout, an open form or while someone is typing; it waits and shows "An update is ready".
- Just upload the new files to GitHub. Changing index.html alone is enough; sw.js only needs a change when the offline files change (its first line holds the version name).

NEW IN 2.8
- (Changed in 2.9.1) Park and Jungle are single scrolling pages again (see below).
- Tapping the bottom-bar button of the page you are on scrolls back to the top.
- Medals: 9 track distances (400 m to 2 miles), Dawn patrol and Dusk runner (start within about 45 minutes of local sunrise or sunset, using the run's GPS or your last position), more consistency medals (2/4/8/12/26/52 week streaks, 7 and 30 day streaks, 20 active days in a month), Iron 100, and 3 invite medals.
- Invites (Crew page and My Profile): share your invite link or QR. When someone who has never used JUNGLE PARK opens it and creates an account, they join your crew and you get credit (1, 3 and 5 new members). People who already had the app become friends but do not count. Over the relay here, or the live store in the claude.ai version.
- Find a coach: 4 coaches at a time on phones (2 x 2), 12 on wide screens (4 columns), with page arrows.
- Find a gym: Gyms near you is at the top with a city picker, 5 gyms at a time, and descriptions instead of prices. Gyms add a description and up to 6 photos in their sign-up form and Gym settings.
- Joining a gym is a request: the member picks a plan (the selected plan gets a theme-colour border) and follows its progress live (Sent, Seen, Approved, Active). The gym's Business dashboard has a Join requests card: Approve or Decline, then "Paid, activate check-in" once the member has paid at the front desk. Only then can the member check in, in the app or with the gym QR code. This needs the live store, so it runs end to end in the claude.ai version and in Demo mode (where listed gyms you do not own play the gym's part automatically). In this installed copy without a live store, the request is sent to the gym's WhatsApp number and tracked on the phone.
- Heart rate: measured with the phone's rear camera and flashlight (photoplethysmography). Cover both with a fingertip for about 15 seconds. Readings during a run or workout are saved with it. Apple Watch, MyZone, Bluetooth straps and the pairing link were removed. Needs HTTPS and camera permission. Not a medical device.
- WHOOP: connect through WHOOP's official API (recovery, HRV, resting HR, SpO2, skin temperature, sleep stages, strain, workouts; synced every hour while the app is open). WHOOP requires a client secret, which cannot live in a web page, so deploy whoop-worker.js once as a free Cloudflare Worker (steps at the top of that file) and paste its address under Health > Connect WHOOP. The WHOOP data export (zip/CSV) import still works without it.

NEW IN 2.9
- Faster start: the app no longer waits for two CDN scripts and Google Fonts before it can run (on a slow or blocked CDN that held the whole app for many seconds). One font family loads in the background, the splash is shorter, and the offline copy opens instantly while updates download in the background (the app reloads into the new version when you are not busy). With a slow CDN in testing, the home screen went from 6.3 s to 0.4 s.
- Stories work between friends in this installed copy: they travel encrypted over the friend relay, friends keep them for 24 hours, your app re-sends live stories every 2.5 hours, and "Seen by" works.
- Classes anyone can book: businesses can be a Gym, Studio or Run club (Gym settings). Studio and run club classes need no membership; any class can be "open to everyone". Businesses set time frames per weekday, class length, slot interval, spots per class, how far ahead and minimum notice. Members book in an Acuity-style flow: calendar, then a time, then their details, with an optional payment receipt. Full times cannot be booked. The class page in the Business dashboard lists reservations by time (Upcoming / To check / Past): view receipts, Verify paid or Reject (unpaid), mark paid, check in, cancel. Members see "My class bookings" and get notified when payment is confirmed or rejected.
- Gym join: a face photo is required (front camera, or upload). The gym sees it on the request, on the member card and with every check-in, and can retake, replace or remove it. After approval the member uploads a payment receipt (or pays at the desk); the gym verifies it to activate check-in, or rejects it (unpaid).
- My memberships (Gyms tab and My Profile): plan, dates, days left, payment status, renew, check in, leave. Alerts 7, 3 and 1 days before the end and when it expires.
- Notification board (bell at the top): request and membership changes, bookings and payments, coach messages, channel posts, friends' stories. Optional phone alerts while the app is in the background.
- Coaches: people send requests in the app (in this installed copy they are end-to-end encrypted to the coach's key from their directory listing; coaches accept in My Profile → Coaching inbox). The WhatsApp or Telegram message only appears when someone chooses to message that way.
- Messages come only from coaches you train with. Inbox (Jungle → My coach, or the bell): unread counts, mute, clear, block and unblock.
- Channels: gyms and coaches create Telegram-style channels (Business dashboard; coaches in this copy from My Profile) with posts, photos and 24-hour stories. People follow them from Crew → Channels → Discover or a shared link; channel stories appear in the story bar.
- Fees: JUNGLE PARK charges gyms 5% of memberships activated from in-app join requests and of paid class bookings (Payments → App fee details; the admin bills from these records). Members a gym adds itself and its own invoices are free. Coaches are never charged (Coach Pro is free for everyone).
- Redesign: dark charcoal with a violet accent, bold geometric type, colour stat cards. People who had the default theme switch to it once; Settings still offers light mode and other accent colours.
- Needs the live store (claude.ai version or Demo mode): join requests and receipts, class reservations management, face photos for the gym, fees and gym channels. In this installed copy, gym and class bookings go to the business by WhatsApp and are tracked on the phone.

NEW IN 2.9.1
- The swipe card decks are gone: Park and Jungle → Train are normal scrolling pages again, and Jungle tabs change from the tab bar only.
- Park, in order: run dashboard, your stats (two per row), weekly distance, then your run history. On wide screens: dashboard and history on the left, stats and weekly on the right.
- Jungle → Train, in order: workout dashboard, check in (or your live session), session rate (two per row), then the training log cards. On wide screens: dashboard and training log on the left, check in and session rate on the right.
