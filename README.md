# Welcome to HPPY! 🦆

HPPY is a wellness and happiness tracking app that helps you build positive habits and track your daily activities. Hatch your virtual platypus companion and watch it grow as you cultivate happiness!

---

## Before You Begin

You'll need two things installed on your computer:

1. **Node.js** — the engine that runs the app. Download it from [nodejs.org](https://nodejs.org/) and choose the **LTS** version. Run through the installer like any other program.

2. **Expo Go** — the app on your phone that displays HPPY. Install it for free:
   - iPhone → [App Store](https://apps.apple.com/us/app/expo-go/id982107777)
   - Android → [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## Setting Up (one-time)

Open **Terminal** on Mac (press ⌘ Space, type "Terminal") or **Command Prompt** on Windows.

**Step 1 — Download the project**
```
git clone https://github.com/nathanzhang1/HPPY.git
cd HPPY
```

**Step 2 — Install the app's files**
```
npm install
```

**Step 3 — Install the backend's files**
```
cd backend
npm install
cp .env.example .env
cd ..
```

> 💡 These steps only need to be done once. The downloads may take a minute or two — that's normal.

---

## Running the App

Every time you want to use HPPY, run this single command from the `HPPY` folder:

```
npm start
```

After about 10–15 seconds you'll see a QR code appear in the terminal.

**To open the app on your phone:**
- Open **Expo Go** and scan the QR code
- iPhone users can also use the built-in Camera app to scan it

**To open the app in your browser:**
- Press the **`w`** key in the terminal

> ✅ Works on any network — home WiFi, university WiFi (eduroam), coffee shop, etc.

Press **Ctrl + C** in the terminal to stop the app when you're done.

---

## First Time Using HPPY

1. Create an account with your phone number and a password
2. Follow the short onboarding steps
3. Add 5 activities to hatch your first egg 🥚
4. Log your happiness every day and watch your weekly progress build up

---

## Troubleshooting

**The QR code won't scan / app won't open on my phone**
Close the terminal, wait a few seconds, and run `npm start` again. Make sure you have a stable internet connection — the app uses tunnels to work on any network.

**"Port 3000 already in use" error**
A leftover process from a previous run is still going. Run this to clear it, then try again:
```
npx kill-port 3000
```

**App loads but shows an error screen**
Press **`r`** in the terminal to reload the app.

**Nothing seems to work**
Try a clean reinstall:
```
npm install && cd backend && npm install && cd ..
```
Then run `npm start` again.

---

Made with 💚 for happiness tracking
