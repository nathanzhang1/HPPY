# SPEC.md — HPPY

## 1. Project Overview

**HPPY** is a wellness and happiness tracking mobile app implemented as a **React Native / Expo** client with a custom **Node.js / Express** backend. The product centers on logging activities, tracking happiness over time, and progressing through a “virtual companion” experience (egg / hatchling / sanctuary / fitting-room / shop flow).

This document describes the current technology stack, runtime architecture, and the main system design considerations that are visible in the repository.

---

## 2. Product and Runtime Shape

### 2.1 High-level architecture

HPPY uses a classic **client–server** split:

- **Mobile client**: React Native app built with Expo
- **API server**: Express.js server on port `3000`
- **Database**: SQLite (`better-sqlite3`) stored locally on the backend host
- **Auth**: JWT-based session tokens stored in device AsyncStorage

```text
┌─────────────────────────────────────────────────────────┐
│                     Mobile Device                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ React Native / Expo app                          │  │
│  │ - screens                                        │  │
│  │ - components                                     │  │
│  │ - navigation                                     │  │
│  │ - auth context                                   │  │
│  │ - API client                                     │  │
│  └──────────────────────┬────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS / HTTP during dev
                          │
┌─────────────────────────▼───────────────────────────────┐
│                 Express API Server                      │
│  - /api/auth                                            │
│  - /api/activities                                      │
│  - /api/user                                            │
│  - /api/health                                          │
│  - CORS + JSON middleware                               │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ SQLite database  │
                 │ hppy.db          │
                 └──────────────────┘
```

### 2.2 Development topology

The repository includes a custom launcher (`start.js`) that starts:

1. the backend server,
2. a public tunnel for the backend,
3. Expo in tunnel mode,
4. and injects `EXPO_PUBLIC_API_URL` so the app can resolve the backend automatically.

That means the app can work on:

- a web browser,
- a simulator/emulator,
- and a physical device on the same network,
- without manually editing API URLs.

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Role | Notes |
|---|---|---|
| React Native | Cross-platform UI runtime | Shared codebase for iOS and Android |
| Expo | App runtime and developer tooling | Simplifies local dev, assets, and device testing |
| React Navigation | Screen routing | Used for stack-based auth/onboarding/app flows |
| react-native-safe-area-context | Safe-area handling | Screens wrap content in `SafeAreaView` |
| expo-status-bar | Status bar styling | Screen-specific status-bar modes are set in components |
| expo-font | Font loading | App waits for custom font availability before rendering |
| AsyncStorage | Local token persistence | Stores JWT on-device |
| expo-constants | Runtime environment detection | Used to infer host/tunnel backend URL |
| Fetch API | HTTP client | Used inside the centralized API service |

### 3.2 Backend

| Technology | Role | Notes |
|---|---|---|
| Node.js | Server runtime | Single language across client and server |
| Express.js | HTTP API framework | Simple REST API layer |
| better-sqlite3 | SQLite access | Synchronous file-backed persistence |
| bcrypt | Password hashing | Secure password storage |
| jsonwebtoken | Session token signing | JWT auth for protected routes |
| cors | Cross-origin support | Allows the Expo client to reach the API |
| dotenv | Environment configuration | Loads secrets and local settings |

### 3.3 Tooling / orchestration

| Technology | Role | Notes |
|---|---|---|
| localtunnel | Public backend URL | Enables device access from outside localhost |
| Expo tunnel mode | Public client transport | Helps when LAN discovery is unreliable |
| Node `--watch` | Development server reload | Used by backend dev script |

---

## 4. Repository Structure

The repository is organized around a thin client and a small custom backend.

### 4.1 Main directories

| Path | Purpose |
|---|---|
| `App.js` | Root app bootstrap, providers, and navigator selection |
| `src/screens/` | Full-screen application views |
| `src/components/` | Reusable UI components |
| `src/context/` | Cross-app state providers |
| `src/services/` | API client and service abstractions |
| `src/utils/` | Validation and shared helpers |
| `assets/` | Fonts, images, and animated assets |
| `backend/src/` | Express entrypoint, routes, and backend logic |

### 4.2 App bootstrap

`App.js` reveals the initialization sequence:

1. load custom fonts,
2. mount `SafeAreaProvider`,
3. mount `AnimatedBackgroundProvider`,
4. mount `AuthProvider`,
5. mount the `NavigationContainer`,
6. render navigation conditionally based on auth/onboarding state.

This ordering matters because the navigation tree depends on authentication state, and the UI depends on fonts being ready.

```text
App
└── SafeAreaProvider
    └── AnimatedBackgroundProvider
        └── AuthProvider
            └── NavigationContainer
                └── AppNavigator
```

---

## 5. Frontend Architecture

### 5.1 Navigation model

The app uses a **conditional stack navigator** instead of a large tab/navigation mesh at startup.

The current route set is divided into three states:

#### Unauthenticated
- `Welcome`
- `PhoneEntry`
- `CreatePassword`
- `SignIn`

#### Authenticated but onboarding incomplete
- `Onboarding`

#### Authenticated and onboarded
- `Home`
- `ProfileCompletion`
- `Data`
- `Sanctuary`
- `FittingRoom`
- `Shop`
- `Resources`

### 5.2 State providers

#### AuthProvider
The auth context is central to the app:

- stores current user state,
- checks for an existing token,
- logs in / registers / logs out via the backend,
- exposes onboarding completion state,
- persists JWTs using AsyncStorage.

This is a practical design because auth is required by most app flows, and many screens need access to the same session state.

#### AnimatedBackgroundProvider
This provider exists to share background animation state across screens. That indicates the app has a global animated visual treatment rather than fully local, isolated animations.

### 5.3 UI conventions

The codebase follows consistent presentation choices:

- `SafeAreaView` from `react-native-safe-area-context`
- `StatusBar` from `expo-status-bar`
- `StyleSheet.create()` near the bottom of each screen file
- reusable `Input` and `Button` components
- consistent palette references, including:
  - primary blue: `#007AFF`
  - error red: `#FF3B30`
  - background gray: `#F5F5F5`

### 5.4 Custom typography

The app loads the `Sigmar` font from `assets/fonts/Sigmar-Regular.ttf` before rendering. That means the visual identity depends on a preloaded branded typeface rather than system defaults.

### 5.5 Screen examples visible in repo

The repository includes screens such as:

- `WelcomeScreen`
- `PhoneEntryScreen`
- `CreatePasswordScreen`
- `SignInScreen`
- `OnboardingScreen`
- `HomeScreen`
- `ProfileCompletionScreen`
- `DataScreen`
- `SanctuaryScreen`
- `FittingRoomScreen`
- `ShopScreen`
- `ResourcesScreen`

This suggests a product model that combines:

- habit/activity tracking,
- user profile setup,
- progress visualization,
- collectible / companion progression,
- and content/resource discovery.

---

## 6. Backend Architecture

### 6.1 Express server entrypoint

`backend/src/index.js` shows a minimal API server architecture:

- loads env vars with `dotenv`,
- enables CORS,
- parses JSON bodies,
- mounts route modules,
- exposes `/api/health`,
- returns JSON 404 and 500 responses.

The server listens on `0.0.0.0`, which is important for emulator/device access and tunnel forwarding.

### 6.2 API routes

The backend is split by responsibility:

- `/api/auth`
- `/api/activities`
- `/api/user`
- `/api/health`

The routes indicate a simple domain-oriented REST structure:

- auth handles account creation, login, and identity lookup,
- activities handles CRUD-like logging,
- user handles settings and recommendation-related data.

### 6.3 Persistence

The backend depends on `better-sqlite3`, which implies:

- a local file database (`hppy.db`),
- no external DB service requirement,
- very low operational overhead,
- synchronous database access on the Node thread.

That is a sensible choice for a small project, but it also means the server should remain lightweight and avoid long blocking database operations.

### 6.4 Authentication

The backend uses:

- `bcrypt` for password hashing,
- JWT for access tokens.

This means the system is **stateless at the API layer**: the backend does not need to maintain session rows in memory for every client request.

The tradeoff is that:

- token revocation is not inherently centralized,
- token expiry strategy matters,
- client-side token storage must be treated carefully.

---

## 7. API Integration Design

### 7.1 Centralized API service

The frontend uses `src/services/api.js` as a single API client abstraction.

Responsibilities:

- read/write auth token from AsyncStorage,
- attach `Authorization: Bearer <token>` headers,
- parse JSON responses,
- surface API errors as thrown exceptions,
- expose endpoint-specific helper methods.

This is a good separation because screens do not need to reimplement auth header handling.

### 7.2 Backend URL resolution strategy

The API client chooses the backend URL in priority order:

1. `EXPO_PUBLIC_API_URL`
2. `http://localhost:3000/api` for web
3. `http://<expo-host>:3000/api` for device/simulator LAN mode
4. fallback to `http://localhost:3000/api`

```text
API base URL selection
├── env override (tunnel)
├── web localhost
├── device host-based LAN URL
└── localhost fallback
```

This is a meaningful system design choice because mobile development often breaks when the phone cannot reach `localhost` directly.

### 7.3 Request lifecycle

Typical request flow:

```text
Screen
└── API service method
    └── read token from AsyncStorage
        └── fetch backend endpoint
            └── backend route
                └── validate token / process request
                    └── JSON response
```

### 7.4 Activity creation semantics

The client sends `created_at` as an ISO string when creating an activity. That suggests the system cares about client-local timing and display semantics, not just server arrival time.

This has an important design implication:

- if the backend uses client timestamps for analytics, it must tolerate clock skew,
- if the backend later normalizes times, it should preserve source timestamp metadata.

---

## 8. Development and Deployment Considerations

### 8.1 Local development flow

The custom `start.js` launcher indicates a deliberate dev workflow:

- backend is started first,
- backend is exposed publicly via tunnel,
- Expo starts in tunnel mode,
- backend URL is injected into the Expo app environment.

This reduces manual configuration and is especially useful for physical devices.

### 8.2 Port and host assumptions

The backend defaults to port `3000`. The server binds to `0.0.0.0`, which is correct for container-like or LAN-accessible development setups.

### 8.3 Production readiness

Based on the repository state, the backend is still structured like a lightweight application server rather than a hardened production service. Notable areas to plan for if production deployment is desired:

- HTTPS termination and secure transport
- stronger secrets management
- token expiry / refresh strategy
- database migrations and backups
- observability / logging strategy
- input validation hardening
- rate limiting and abuse protection

---

## 9. System Design Considerations

### 9.1 Why this stack works well here

The chosen stack is well matched to a mobile wellness app because it is:

- **fast to develop** — JavaScript end to end
- **easy to run locally** — no external DB service required
- **portable** — Expo supports multiple platforms
- **low operational overhead** — SQLite + Express is simple to reason about
- **small-team friendly** — fewer moving parts than a microservice architecture

### 9.2 Tradeoffs of the current design

#### Advantages
- single language across stack
- minimal infrastructure
- easy onboarding for contributors
- straightforward local testing
- fast iteration for a product with modest scale

#### Limitations
- SQLite is not ideal for highly concurrent multi-user deployments
- synchronous database access can block the Node event loop
- JWT stored in AsyncStorage is not as secure as a native secure enclave / keychain solution
- local tunnels are convenient but add dev-mode complexity
- the architecture is not yet split into typed service layers or a formal domain model

### 9.3 Security posture

Visible security-related choices:

- bcrypt password hashing
- JWT authentication
- protected routes for authenticated resources
- token persistence on-device

Design considerations still worth tracking:

- prefer secure storage for long-lived credentials
- ensure JWT signing secrets are never committed
- validate all user input on server side
- consider rate-limiting auth endpoints
- avoid logging sensitive request data

### 9.4 Reliability and failure modes

Potential failure points include:

- tunnel unavailable or unstable,
- device cannot resolve backend host,
- JWT expired or invalid,
- SQLite file locked or corrupted,
- backend process not yet started when Expo begins,
- fonts not loaded before render.

The app already mitigates some of these by:

- centralized backend URL selection,
- auth token checking on startup,
- explicit backend health endpoint,
- startup script orchestration.

### 9.5 Data model implications

From the route design, the app likely centers on these data classes:

- users
- activities
- user settings
- recommended activities
- onboarding/progression state

Even without seeing every table definition, the API suggests a compact normalized model suitable for SQLite.

---

## 10. Operational Figures

### 10.1 Known ports and runtime endpoints

| Component | Address |
|---|---|
| Backend server | `http://0.0.0.0:3000` |
| Backend API base | `/api` |
| Health check | `/api/health` |

### 10.2 Auth and storage figures

| Item | Value |
|---|---|
| Password hashing | bcrypt, 12 salt rounds (per project instructions) |
| Client token store | AsyncStorage |
| Session model | JWT bearer token |
| Database engine | SQLite via better-sqlite3 |

### 10.3 Conditional route groups

| State | Visible routes |
|---|---|
| Not signed in | 4 screens |
| Signed in, onboarding not complete | 1 screen |
| Signed in, onboarding complete | 7 screens |

---

## 11. Suggested Spec Boundaries

This document reflects the repository as observed. It intentionally avoids claiming implementations that are not visible in code. If the project grows, useful follow-up specs would include:

- database schema specification,
- API contract specification,
- onboarding state machine,
- companion progression / economy spec,
- accessibility and design-system spec,
- deployment and environment spec.

---

## 12. Summary

HPPY is a **small, coherent JavaScript-only mobile system** consisting of:

- a React Native / Expo front end,
- an Express + SQLite backend,
- JWT-based authentication,
- centralized API handling on the client,
- and a development setup designed for device testing via tunnels.

The architecture is intentionally lightweight and practical for a happiness-tracking product, with the main tradeoffs centered around scaling, credential security, and eventual production hardening.
