# ⭕ Orbital Year Tracker

> **See your entire year in one circle.** A minimal, physical journal-inspired yearly habit and annual goal tracking application built for offline productivity.

---

## 🖥️ Desktop Application (100% Offline)

Orbital Year Tracker is fully equipped to run as a **native standalone desktop application** on Windows, macOS, and Linux with zero external internet dependencies.

### 1. Run Desktop App in Development
Starts the local development server and launches the native Electron desktop window:
```bash
npm run electron:dev
```

### 2. Preview Offline Desktop App (Production Bundle)
Compiles production assets and runs them locally inside Electron using the local file protocol:
```bash
npm run electron:preview
```

### 3. Build Standalone Desktop Installer (`.exe` / macOS / Linux)
Generates standalone executables (NSIS installer & portable `.exe` on Windows, `.dmg` on macOS, `.AppImage` on Linux) in the `release/` directory:
```bash
npm run electron:dist
```

---

## 🌐 Instant Desktop PWA (Progressive Web App)

You can also run Orbital Year Tracker as a desktop application directly from your browser without packaging:
1. Open the app in **Google Chrome**, **Microsoft Edge**, or **Brave**.
2. Click the **"Install App"** button in the top right header, or click the install icon in your browser's address bar.
3. The app will install to your Start Menu / Desktop / Dock and open in its own clean, frameless desktop window with offline service-worker caching.

---

## 🛠️ Web Development & Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launch local Vite development server (`http://localhost:5173`) |
| `npm run build` | Typecheck with `tsc` and create optimized offline web/desktop bundle in `dist/` |
| `npm run preview` | Preview production build on a local static server |
| `npx tsx src/utils/geometry.test.ts` | Run geometric validation test suites (concentric rings, 32 sectors, incline geometry) |

---

## 🛡️ Privacy & Offline Architecture

- **100% Local-First**: All habits, goals, notes, and completions are stored directly in your device's browser `localStorage`.
- **Zero Telemetry**: Operates completely offline without mandatory accounts or logins.
- **Optional Cloud Backup**: Optional one-click sync with Supabase for cross-device access if signed in.
- **Data Portability**: Full JSON export and schema-validated import at any time with PII scrubbing.
