# RAJA NEXUS — FREE READY BUILD

Premium-style gaming portal with a real Node/Express server, SQLite database, bcrypt authentication, analytics, mini-games, safe cyber demos and a local Nexus Bot.

## What was upgraded
- Premium responsive neon/robot command-center UI.
- Free local Nexus Bot — no paid AI API/key required.
- Free Fire sensitivity generator + local saved output.
- PUBG preset generator.
- Track Left practice timer.
- Reaction Test, Aim Clicker and Number Rush mini-games.
- Safe camera/network/access simulations; no real device access or scanning.
- Register/Login/Logout with server-side sessions, SQLite and bcrypt.
- Admin analytics for this app's own users/events.
- `/health` endpoint and `/nexus` route for deployment checks.
- Social links remain configurable through `.env` or admin API.

## Run completely free on your own phone/PC
1. Install Node.js 20+.
2. Extract the ZIP.
3. Open a terminal in the folder.
4. Run `npm install`.
5. Copy `.env.example` to `.env` and set a strong `SESSION_SECRET` and admin password.
6. Run `npm start`.
7. Open `http://localhost:3000`.

SQLite creates `data.sqlite` automatically. Keep this file backed up if you want to preserve accounts/events.

## Put it online for $0
The application itself has no paid API requirement. A public internet URL still depends on the hosting provider's current free tier/limits; free tiers can change or sleep and many do not provide persistent SQLite storage. For a truly persistent production database, use a free-tier database provider and adapt the storage layer, or use a host with persistent disk.

Do not promise a permanent custom domain for $0: a custom domain name normally costs money. The app's built-in `/nexus` route is free, and the host can provide its own free subdomain when its free tier allows it.

## Admin
Default admin values come from `.env`. CHANGE THEM before going public.

## Safety
Cyber features are theatrical simulations only. This project intentionally does not implement camera access, credential theft, port scanning, exploitation, account takeover, or other offensive actions.
