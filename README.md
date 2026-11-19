# UoPeople South Sudan — Student Connect

A responsive community website starter for University of the People students in South Sudan.

## What's included
- Responsive landing page and community identity.
- Email/password and Google sign-in using Firebase Authentication.
- Student profile fields: display name, programme/department, study level, year/stage, and optional state/region.
- Jitsi meeting room integration.
- Shared "current speaker" card that displays the speaker's profile for signed-in participants.
- Live events and agenda feed from Firestore.
- GitHub Pages-ready static files.

> This is an independent student community initiative, not an official University of the People website. Do not use UoPeople logos or imply official endorsement without permission.

## Important limitations
GitHub Pages hosts static files; it does not provide user accounts, a database, or video conferencing by itself. This starter uses Firebase for authentication and shared data, and Jitsi Meet for video meetings. The public Jitsi room name is shared by all visitors to this demo. For a private/production community, arrange an authenticated meeting provider or a secured Jitsi deployment, and review privacy and moderation settings before launch.

## 1. Create Firebase project
1. Create a project at https://console.firebase.google.com.
2. Add a Web App and copy its Firebase config.
3. Enable **Authentication → Sign-in method → Email/Password** and **Google**.
4. Create a **Cloud Firestore** database.
5. In `app.js`, replace all `YOUR_...` values in `firebaseConfig` with your web app settings.
6. In Firestore Rules, publish the contents of `firestore.rules`.
7. In Firebase Authentication settings, add your GitHub Pages domain to **Authorized domains** (for example `YOUR-USERNAME.github.io`).

Google sign-in popups require the site to be served from an authorized HTTPS domain. Opening `index.html` directly from your computer may not work.

## 2. Publish an event
For the starter version, event publishing is intentionally restricted. After signing in, add documents manually in Firestore:
- Collection: `events`
- Document fields:
  - `title` (string)
  - `description` (string)
  - `category` (string, e.g. `STUDY SESSION`)
  - `agenda` (string)
  - `date` (timestamp)

The event feed updates live for signed-in users. Do not allow public event writes in Firestore rules. For a larger community, add a trusted admin workflow using Firebase custom claims.

## 3. Deploy to GitHub Pages
1. Create a new GitHub repository, e.g. `uopeople-south-sudan`.
2. Upload `index.html`, `styles.css`, `app.js`, and optionally `firestore.rules` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for the published URL shown in the Pages section.
6. Add that `github.io` domain to Firebase Authentication's authorized domains.

## 4. Before inviting students
- Agree on community guidelines and appoint meeting moderators.
- Decide who may create events and manage student profiles.
- Tell students exactly which profile fields are visible to other signed-in students.
- Make the region field optional and ask students to enter only a broad state/region, never a home address or live GPS location.
- Obtain consent before recording meetings; do not record by default.
- Test sign-in, profile display, mobile layout, event feed and meeting access with a small group first.
- Consider a custom domain and a private/authenticated meeting provider before sharing widely.

## Customization
Search `index.html` for “UoPeople South Sudan” to change the community name and wording. Edit colors and layout in `styles.css`.
