# Quarter by Quarter

A weekly plan for memorizing one quarter (rubʿ) of the Qur'an at a time, with daily review. English / Arabic, installable as a PWA, works offline.

## How it works

- **`public/index.html`** — the whole app (HTML, CSS, JS in one file). Progress is kept in `localStorage`.
- **Cloud sync (optional)** — "Save my progress with Google" signs in with Firebase Auth and mirrors progress to Firestore at `users/{uid}`. Config is read from `/__/firebase/init.json`, which only Firebase Hosting serves, so on any other host the app silently stays local-only.
- **Whole Qur'an** — positions are stored as running ayah numbers (1–6236), so a quarter can be any of the 240 standard quarters (rubʿ al-ḥizb) or any custom range, even across sūrahs. Old saves (Āl ʿImrān ayah numbers) are converted automatically on load.
- **`public/fonts/`** — a copy of Amiri (Arabic letters only) with the tanween marks drawn slightly lower; licence in `OFL.txt`.
- **`public/sw.js`** — network-first service worker with a cache fallback for offline use. Bump `C='qbq-vN'` when you want to force old caches out.
- **`firestore.rules`** — each user can only read/write their own document.
- **`firebase.json` / `.firebaserc`** — Hosting config for the `quarter-by-quarter` Firebase project.

## Deploying

Pushing to `main` deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`):

| Event | What happens |
|---|---|
| Push to `main` | Hosting deployed to the live site + Firestore rules deployed |
| Manual (Actions tab → Run workflow) | Same as push to `main` |

### One-time setup

GitHub needs a key to deploy to Firebase:

1. Google Cloud Console → IAM & Admin → Service accounts (project `quarter-by-quarter`) → **Create service account** named `github-deploy`, with roles **Firebase Admin**, **API Keys Viewer**, **Service Usage Consumer**.
2. Open it → **Keys** → **Add key** → **JSON** → a file downloads.
3. GitHub repo → Settings → Secrets and variables → Actions → **New repository secret** named `FIREBASE_SERVICE_ACCOUNT_QUARTER_BY_QUARTER`, value = the whole JSON file. Then delete the downloaded file.

### Manual deploy

```bash
npx firebase-tools deploy --project quarter-by-quarter
```

### Local preview

```bash
npx firebase-tools emulators:start --only hosting
```
