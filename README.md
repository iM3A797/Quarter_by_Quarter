# Quarter by Quarter

A weekly plan for memorizing one quarter (rubʿ) of the Qur'an at a time, with daily review. English / Arabic, installable as a PWA, works offline.

## How it works

- **`public/index.html`** — the whole app (HTML, CSS, JS in one file). Progress is kept in `localStorage`.
- **Cloud sync (optional)** — "Save my progress with Google" signs in with Firebase Auth and mirrors progress to Firestore at `users/{uid}`. Config is read from `/__/firebase/init.json`, which only Firebase Hosting serves, so on any other host the app silently stays local-only.
- **`public/sw.js`** — network-first service worker with a cache fallback for offline use. Bump `C='qbq-vN'` when you want to force old caches out.
- **`firestore.rules`** — each user can only read/write their own document.
- **`firebase.json` / `.firebaserc`** — Hosting config for the `quarter-by-quarter` Firebase project.

## Deploying

Pushing to `main` deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`):

| Event | What happens |
|---|---|
| Push to `main` | Hosting deployed to the live site + Firestore rules deployed |
| Pull request | Hosting deployed to a temporary preview URL (7 days), posted as a PR comment |
| Manual (Actions tab → Run workflow) | Same as push to `main` |

### One-time setup

1. Create a service account key. Easiest: run locally
   ```bash
   npx firebase-tools init hosting:github
   ```
   and pick this repo — it creates the service account and stores it as the `FIREBASE_SERVICE_ACCOUNT_QUARTER_BY_QUARTER` repo secret. (Decline when it offers to overwrite the workflow file.)
   Or manually: Google Cloud Console → IAM → Service accounts → create one with roles **Firebase Hosting Admin**, **Firebase Rules Admin**, **API Keys Viewer**, **Service Account User** → add a JSON key → paste the JSON into GitHub → Settings → Secrets and variables → Actions as `FIREBASE_SERVICE_ACCOUNT_QUARTER_BY_QUARTER`.
2. If you want Google sign-in to work on PR preview URLs, add the preview domain under Firebase console → Authentication → Settings → Authorized domains.

### Manual deploy

```bash
npx firebase-tools deploy --project quarter-by-quarter
```

### Local preview

```bash
npx firebase-tools emulators:start --only hosting
```
