# Quick Start Guide

## What you need

- **[Node.js](https://nodejs.org/)** (v18 or later) — download and install
- **[Expo Go](https://expo.dev/go)** on your phone — free from the App Store / Google Play

---

## Setup (one-time)

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend
npm install
cp .env.example .env
cd ..
```

---

## Running the app

```bash
npm start
```

This starts the backend, creates tunnels, and launches the Expo dev server.

**To view the app:**
- 📱 **Phone** — scan the QR code with the Expo Go app
- 💻 **Browser** — press `w` in the terminal

Works on any network — public WiFi, eduroam, home WiFi, etc.

---

## Troubleshooting

**Blank screen or bundle error?**
```bash
npx expo start --clear
```

**Dependencies missing?**
```bash
npm install && cd backend && npm install && cd ..
```

