# HPPY — Project Report

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives and Scope](#2-objectives-and-scope)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Project Structure](#5-project-structure)
6. [Database Design](#6-database-design)
7. [Backend Implementation](#7-backend-implementation)
8. [Frontend Implementation](#8-frontend-implementation)
9. [Key Features](#9-key-features)
10. [Security Considerations](#10-security-considerations)
11. [Developer Experience and Tooling](#11-developer-experience-and-tooling)
12. [Use of AI Tools](#12-use-of-ai-tools)
13. [Known Limitations and Future Work](#13-known-limitations-and-future-work)

---

## 1. Project Overview

HPPY is a mobile wellness and happiness tracking application built for iOS and Android. The core idea is simple: users log activities that make them happy, track their mood over time, and are rewarded for consistent engagement through a virtual companion system — collectible animals that users hatch, dress up, and care for.

The application is intended to feel approachable and playful rather than clinical. Rather than presenting raw numbers or obligation-driven reminders, HPPY frames emotional wellness as something joyful, using game-like mechanics (coins, items, a virtual sanctuary) to encourage daily check-ins.

---

## 2. Objectives and Scope

### Primary Objectives

- Provide a frictionless way for users to record activities and rate their associated happiness on a 0–100 scale
- Persist user data across sessions with a secure backend (no data is lost when the app is closed)
- Make the experience engaging long-term through a collectible animal system and in-app economy
- Ensure the application works reliably across different network environments (home WiFi, university networks, public hotspots)

### In Scope

- User account creation and authentication (phone number + password)
- Activity logging with happiness scoring
- Weekly happiness analytics
- Virtual companion system: hatching, collecting, and dressing up animals
- An in-app shop with a coin-based economy
- A curated mental health resources screen
- Single-command startup for both developers and non-technical users

### Out of Scope (at this stage)

- Push notifications (notification frequency preference is stored but not yet triggered)
- Social or sharing features
- Backend deployment to a public cloud server (currently runs locally)

---

## 3. Technology Stack

The technology choices were guided by three priorities: **speed of development**, **lightweight footprint**, and **broad device compatibility**.

### Frontend

| Technology | Role | Why it was chosen |
|---|---|---|
| **React Native** | Core mobile framework | Write one codebase that runs on both iOS and Android |
| **Expo (SDK 54)** | Development platform | Simplifies device testing, asset management, and builds |
| **React Navigation v6** | Screen routing | The standard navigation library for React Native |
| **Lottie React Native** | Animations (e.g. egg hatching) | Plays designer-created animations from JSON files |
| **Expo Linear Gradient** | Background gradients | Smooth colour gradients without manual SVG drawing |
| **Expo Blur** | Modal blur effects | iOS-style frosted glass backgrounds |
| **React Native SVG** | Vector graphics | Scalable icons and chart elements |
| **AsyncStorage** | Local token storage | Persists the login token on the device between sessions |
| **expo-constants** | Runtime environment info | Reads the device's network connection details |

### Backend

| Technology | Role | Why it was chosen |
|---|---|---|
| **Node.js** | Server runtime | JavaScript everywhere — same language as the frontend |
| **Express.js** | Web framework | Minimal, fast, and widely understood |
| **SQLite (better-sqlite3)** | Database | File-based, zero-configuration, lightweight; ideal for a project at this scale |
| **bcrypt** | Password hashing | Industry-standard algorithm for securely storing passwords |
| **JSON Web Tokens (JWT)** | Authentication | Stateless, secure session management without a session store |
| **dotenv** | Configuration | Keeps secrets (like the JWT signing key) out of source code |
| **CORS** | Cross-origin requests | Allows the mobile app to talk to the Express server |

### Infrastructure and Tooling

| Technology | Role |
|---|---|
| **localtunnel** | Creates a public HTTPS URL for the backend, enabling the app to work on any network |
| **@expo/ngrok** | Creates a public tunnel for the Expo Metro bundler |
| **concurrently** | Runs multiple processes in one terminal (used in the dev script) |

---

## 4. System Architecture

### High-Level Overview

HPPY follows a standard **client–server architecture** with a clear separation between what runs on the user's device (the frontend) and what runs on the developer's computer (the backend).

```
┌─────────────────────────────────────────────┐
│                 User's Phone                 │
│                                              │
│   ┌──────────────────────────────────────┐  │
│   │         React Native App             │  │
│   │   (screens, components, navigation)  │  │
│   └──────────────────┬───────────────────┘  │
│                       │ HTTPS via tunnel     │
└───────────────────────┼─────────────────────┘
                        │
            ┌───────────▼───────────┐
            │   localtunnel.me      │  ← public HTTPS relay
            └───────────┬───────────┘
                        │
┌───────────────────────┼──────────────────────┐
│         Developer's Computer                  │
│                        │                      │
│   ┌────────────────────▼──────────────────┐  │
│   │         Express.js Backend            │  │
│   │           (port 3000)                 │  │
│   └────────────────────┬──────────────────┘  │
│                         │                     │
│   ┌─────────────────────▼─────────────────┐  │
│   │           SQLite Database             │  │
│   │             (hppy.db)                 │  │
│   └───────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Why a Tunnel?

Many networks — including university WiFi (such as eduroam) and public hotspots — use **client isolation**: devices connected to the same WiFi cannot communicate with each other directly. This means a phone cannot reach the developer's laptop by local IP address.

To solve this, `npm start` automatically creates two tunnels:
1. A **localtunnel** tunnel for the Express backend (port 3000)
2. An **Expo tunnel** for the Metro JavaScript bundler (port 8081)

Both the app bundle and the API calls travel over HTTPS through these public relay URLs, making the setup work identically on home networks, eduroam, and coffee shop WiFi.

### Request Flow (Example: Logging an Activity)

```
User taps "Save" on the Add Activity screen
  → React Native calls api.createActivity("Running", 80)
    → HTTPS POST to https://<tunnel-url>/api/activities
      → Express backend validates the request
        → JWT middleware confirms the user is logged in
          → SQLite records the new activity
          → 10 coins added to the user's balance
        ← Returns { id, name, happiness, coins } as JSON
      ← api.js receives response
    ← Screen updates with the new activity and coin count
  User sees the activity in their log
```

---

## 5. Project Structure

```
HPPY/
│
├── App.js                   ← App entry point, context providers, navigation
├── start.js                 ← Single-command startup script (backend + Expo + tunnels)
├── package.json             ← Frontend dependencies and npm scripts
│
├── src/
│   ├── screens/             ← One file per full-page screen (12 screens)
│   ├── components/          ← Reusable UI building blocks
│   │   ├── home/            ← Cards shown on the Home screen dashboard
│   │   ├── data/            ← Activity log and chart components
│   │   └── shop/            ← Purchase modals
│   ├── context/             ← Global state providers (auth, background animation)
│   ├── services/            ← API client (all backend calls go through here)
│   └── utils/               ← Validation helpers (phone, password, email)
│
├── assets/
│   ├── fonts/               ← Custom typeface (Sigmar)
│   ├── sanctuary/           ← Animal images (cat, raccoon, dinosaur, platypus)
│   ├── shop/                ← Item and animal icon images
│   ├── fitting-room/        ← Fitting room background
│   ├── home/                ← Card backgrounds and UI images
│   ├── profile-completion/  ← Egg hatching Lottie animation, platypus assets
│   ├── onboarding/          ← Onboarding screen images
│   └── emoji/               ← Mood emoji assets
│
└── backend/
    ├── src/
    │   ├── index.js         ← Express server setup and port binding
    │   ├── db.js            ← Database connection and schema creation
    │   ├── routes/
    │   │   ├── auth.js      ← Register, login, /me endpoint
    │   │   ├── activities.js← Create, read, update, delete activities
    │   │   └── user.js      ← Settings, purchases, recommended activities
    │   └── middleware/
    │       └── auth.js      ← JWT token verification middleware
    ├── hppy.db              ← SQLite database file (created on first run)
    ├── .env                 ← Environment secrets (not committed to git)
    └── .env.example         ← Template showing which variables to set
```

---

## 6. Database Design

HPPY uses **SQLite**, a lightweight file-based database. The entire database lives in a single file (`hppy.db`) that is created automatically on first launch — no database installation is required.

### Tables

#### `users`

Stores one record per registered account.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key, auto-incremented |
| `phone` | TEXT | Unique; used as the login identifier |
| `password_hash` | TEXT | bcrypt hash of the user's password (never plain text) |
| `coins` | INTEGER | In-app currency balance; starts at 0 |
| `has_hatched` | BOOLEAN | Whether the user has completed onboarding (hatched their first egg) |
| `animals` | TEXT | JSON array of owned animals, e.g. `["platypus","cat"]` |
| `items` | TEXT | JSON array of purchased items with quantities |
| `notification_frequency` | TEXT | User's preferred reminder frequency |
| `created_at` | DATETIME | Account creation timestamp |

#### `activities`

Stores every activity log entry. Each record belongs to one user.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key |
| `user_id` | INTEGER | Foreign key to `users.id`; cascades on delete |
| `name` | TEXT | Name of the activity (e.g. "Morning run") |
| `happiness` | INTEGER | Score between 0 and 100, enforced by a CHECK constraint |
| `created_at` | DATETIME | When the activity was logged |

Indexed on both `user_id` and `created_at` for fast retrieval of a user's recent activity history.

#### `recommended_activities`

Stores the list of activity suggestions that appear when a user logs a new activity.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER | Primary key |
| `user_id` | INTEGER | Foreign key to `users.id` |
| `activity_name` | TEXT | Name of the suggested activity |
| `created_at` | DATETIME | When the suggestion was saved |

### Design Choices

**Why SQLite instead of PostgreSQL or MongoDB?**

The project is designed to run entirely on a developer's local machine. SQLite requires no installation, configuration, or running service — it's just a file. For a project at this scale (hundreds of users, modest write volume), it performs well. The application is structured so the database could be swapped for a hosted solution (e.g. PostgreSQL on Railway or Supabase) without changes to the application logic.

**Why store `animals` and `items` as JSON columns?**

These fields are read and written as complete lists and are never queried individually (e.g. "find all users who own a cat"). Storing them as JSON in a single column is simpler and faster for this access pattern than normalising them into separate tables.

---

## 7. Backend Implementation

### Server (`backend/src/index.js`)

The Express server listens on port 3000. It is bound to `0.0.0.0` (all network interfaces) rather than `localhost` so that it is reachable both locally and through the tunnel. CORS is configured to accept requests from any origin, which is appropriate for a development-stage application where the frontend URL changes with each tunnel session.

### Authentication (`backend/src/routes/auth.js`)

**Registration:** When a user creates an account, the password they enter is passed through bcrypt's `hash()` function with a **cost factor of 12**. This converts the password into a fixed-length hash string that cannot be reversed. The hash (never the original password) is stored in the database.

**Login:** When a user signs in, bcrypt's `compare()` function checks whether the entered password matches the stored hash. If it does, the server generates a **JSON Web Token (JWT)** — a signed string that contains the user's ID and an expiry time (7 days by default). This token is sent back to the app.

**Subsequent requests:** The app stores the JWT in AsyncStorage on the device. Every API call after login includes this token in the `Authorization` header. The authentication middleware on the backend verifies the token's signature on every request before allowing it through.

This approach means the backend never needs to store session data — the token itself carries all the necessary information.

### Activities (`backend/src/routes/activities.js`)

Creating an activity awards the user **10 coins** in the same database transaction. The happiness score is validated server-side (must be between 0 and 100). Activities support full CRUD: create, read, update, and delete.

### User Settings and Shop (`backend/src/routes/user.js`)

This route handles:
- Reading and writing user preferences (notification frequency, animal collection, item inventory)
- The item purchase flow: validates the user has enough coins, deducts the price, and updates their inventory in a single operation

---

## 8. Frontend Implementation

### Navigation

Navigation is handled by React Navigation's native stack navigator. The app conditionally renders different screen stacks based on authentication state:

- **Unauthenticated:** Welcome → Phone Entry → Create Password / Sign In
- **New user (authenticated, not onboarded):** Onboarding (profile completion with egg hatching)
- **Returning user (authenticated and onboarded):** Home screen with access to all five sections

This means it is impossible to reach the main app without a valid account, and new users are always guided through onboarding before reaching the home screen.

### State Management

Rather than a third-party state library (such as Redux), HPPY uses React's built-in **Context API** with two providers:

**AuthContext** manages everything related to the user's session: who is logged in, whether onboarding has been completed, and methods for signing in, signing out, and creating an account. It also runs an auth check on app startup — if there is a valid stored token, the user is logged in silently without seeing the login screen.

**AnimatedBackgroundContext** manages a shared sine-wave animation that plays across multiple screens. By sharing the animation state through context, all screens display a smooth, continuous wave that does not reset when navigating between them.

### API Service Layer (`src/services/api.js`)

All communication with the backend goes through a single `ApiService` class. This centralisation means that if the backend URL or authentication method ever changes, only one file needs to be updated. The service handles token storage, attaches the `Authorization` header automatically, and detects the correct backend URL at runtime:

1. If `EXPO_PUBLIC_API_URL` is set (injected by the startup script in tunnel mode), use that
2. If running in a web browser, use `localhost:3000`
3. Otherwise, read the host from Expo's `hostUri` configuration and append `:3000`

### Component Architecture

Screens are composed from smaller, reusable components. The two most widely used are:

**`Button`** — accepts a `variant` prop (`primary`, `secondary`, `white`, `glass`), a `loading` boolean (shows a spinner during async operations), and a `disabled` boolean.

**`Input`** — accepts `label`, `error`, and `secureTextEntry` props. When `secureTextEntry` is true, a show/hide toggle appears automatically.

All validation logic lives in `src/utils/validation.js` and returns `{ valid: boolean, message: string }` objects, keeping validation rules consistent and testable.

### Key Screen Implementations

**Home Screen** — A scrollable dashboard of card components. Each card navigates to a different section of the app. The screen refreshes its data (coin count, animal collection state) every time it comes back into focus using React Navigation's `useFocusEffect` hook.

**Profile Completion / Onboarding** — New users set up recommended activities and a notification preference, then watch an egg hatching Lottie animation before their first animal (always a platypus) is revealed. This sequence is also used when hatching subsequently purchased eggs from the shop.

**Shop Screen** — Displays purchasable items and eggs. The coin balance is shown in the header. Items show a quantity badge reflecting how many the user owns. The egg is hidden until the user has completed their initial onboarding. If the user already owns all available animals, the egg purchase is blocked with an explanatory message.

**Fitting Room Screen** — Allows users to dress their animals in purchased items. Users can swipe left and right or use arrow buttons to switch between animals; swiping supports a "half-swipe" preview so two animals are visible at once. The state of each animal's outfit is persisted to the backend.

**Sanctuary Screen** — Displays all animals the user has collected, with their currently equipped items. Tapping an animal navigates directly to the Fitting Room with that animal pre-selected.

**Data Screen** — Shows a weekly happiness chart and a scrollable log of all past activities. Users can edit or delete existing entries.

---

## 9. Key Features

### Coin Economy

Users earn **10 coins** each time they log an activity. Coins are spent in the Shop on:
- **Eggs** — hatch a random animal from the ones not yet collected (50 coins)
- **Wearable items** — hats, necklaces, swimsuits, etc. that can be equipped to animals

The economy is designed so that consistent daily logging (5 activities per day) generates 50 coins per day — enough to purchase one egg per day.

### Animal Collection

There are four collectable animals: **platypus**, **cat**, **dinosaur**, and **raccoon**. The platypus is always received from the onboarding egg. Subsequent eggs from the shop award a random animal from those not yet owned. Once all four animals are collected, egg purchases are blocked and an appropriate message is shown.

### Item Equipping Logic

Items are tracked by quantity. If a user owns 2 hula skirts and has 4 animals, they can equip at most 2 animals with a hula skirt simultaneously. Equipping an item on a new animal when all copies are already equipped requires first unequipping it from another animal. This logic is managed entirely on the frontend, with the resulting equipment state persisted to the backend.

### Recommended Activities

During onboarding, users select a set of activities they regularly do (e.g. "Morning run", "Reading"). These are saved to the backend and appear as quick-add suggestions when logging a new activity, reducing the friction of daily check-ins.

---

## 10. Security Considerations

### Password Storage

Passwords are never stored in plain text or in a reversible format. The bcrypt algorithm is used with a **cost factor of 12**, which means computing a single hash takes approximately 250ms on modern hardware. This makes brute-force and dictionary attacks computationally expensive. The stored hash cannot be reversed to recover the original password.

### Authentication Tokens

JWTs are signed with a secret key stored in an environment variable (`.env`), never in source code. Tokens expire after 7 days, after which the user must sign in again. Tokens are stored in AsyncStorage on the device rather than in memory, so the user stays logged in between app sessions.

### Environment Variables

Secrets are kept in a `.env` file that is excluded from version control via `.gitignore`. A `.env.example` template is provided showing which variables need to be set, without containing any real values.

### Input Validation

Validation is performed on both the frontend (for immediate user feedback) and the backend (as the authoritative check). The happiness score is enforced as a database-level CHECK constraint as a final line of defence.

---

## 11. Developer Experience and Tooling

### Single-Command Startup

A central challenge for non-technical users is getting a multi-component project running. HPPY addresses this with a custom startup script (`start.js`) that runs with one command: `npm start`.

The script:
1. Starts the Express backend server
2. Waits 1.5 seconds for the backend to be ready
3. Creates a **localtunnel** HTTPS tunnel for the backend and prints its public URL
4. Starts the Expo development server in `--tunnel` mode
5. Injects the backend's tunnel URL as an environment variable so the app uses it automatically
6. Handles Ctrl+C gracefully, shutting down all processes cleanly

This approach means the app works identically on home networks, university networks (eduroam), and public WiFi — no network configuration, no IP addresses, no ngrok accounts required.

### Development vs. Production

The `backend/src/index.js` also exposes a `npm run dev` script that uses Node's built-in `--watch` flag to restart the server automatically when files change, streamlining the development feedback loop.

---

## 12. Use of AI Tools

**GitHub Copilot** (via the GitHub Copilot CLI agent) was used throughout the development of this project as a collaborative coding assistant.

### How it was used

**Architecture and planning:** The initial backend technology choices (Express, SQLite with better-sqlite3, bcrypt, JWT) were made in consultation with Copilot, which provided rationale for each choice relative to the project's lightweight requirements.

**Code generation:** Copilot generated boilerplate for Express route handlers, the SQLite schema, React Native screen layouts, and the API service layer. This accelerated initial development significantly.

**Debugging:** When runtime errors occurred (e.g. incorrect SQL constraints causing 500 errors when saving duplicate activities, item purchase flow returning incorrect status codes), Copilot diagnosed the root cause and suggested targeted fixes.

**Feature implementation:** Complex features such as the multi-animal fitting room with swipe gestures, the item quantity tracking system, and the egg purchase modal with Lottie animation were implemented with Copilot generating the initial implementation based on design descriptions and screenshots.

**Infrastructure:** The tunnel-based startup system (replacing an ngrok-dependent workflow) was designed and implemented by Copilot to solve the problem of public networks blocking device-to-device communication.

**Documentation:** The README, QUICKSTART, and this report were drafted by Copilot and reviewed for accuracy.

### Observations

AI assistance was most effective when the task was well-specified with clear requirements and existing code context. It required human review and iteration for design decisions involving user experience tradeoffs, and for debugging issues that required understanding of the broader system state rather than just a single file.

---

## 13. Known Limitations and Future Work

### Current Limitations

**Local hosting only:** The backend runs on the developer's machine. If the developer's machine is offline or asleep, the app cannot connect. A production deployment to a cloud platform (e.g. Railway, Render, or Supabase) would make the app always-available.

**Tunnel instability:** localtunnel URLs are ephemeral and can occasionally disconnect. Each `npm start` generates a new URL, meaning the app must be reloaded after a restart. This is acceptable for development but unsuitable for a production release.

**No push notifications:** The notification frequency preference is stored in the database but the system for actually sending push notifications has not been implemented.

**Single-device data:** The JWT token is stored on one device. There is no mechanism for logging in on a second device and seeing the same data (though this would work correctly — the backend would issue a new token for the same account).

### Potential Future Improvements

- **Cloud deployment** of the backend so the app is accessible without running a local server
- **Push notifications** using Expo's notification service to prompt daily activity logging
- **Social features** such as comparing weekly happiness with friends
- **More animals and items** to expand the collectible system
- **Streak tracking** — rewarding consecutive days of activity logging
- **Data export** — allowing users to download their activity history as a CSV

---

*Built with React Native, Expo, Express.js, and SQLite.*
*Developed with GitHub Copilot.*
