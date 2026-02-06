# Welcome to HPPY! 🦆

HPPY is a wellness and happiness tracking app that helps you build positive habits and track your daily activities. Hatch your virtual platypus companion and watch it grow as you cultivate happiness!

## What You'll Need

Before you start, make sure you have:

1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (choose the LTS version)
2. **Expo Go App**: Install on your phone from the [App Store](https://apps.apple.com/us/app/expo-go/id982107777) (iPhone) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)

## Setting Up HPPY

### Step 1: Download the Project

1. Open **Terminal** (Mac) or **Command Prompt** (Windows)
2. Type this command and press Enter:
   ```bash
   git clone https://github.com/nathanzhang1/HPPY.git
   ```
3. Go into the project folder:
   ```bash
   cd HPPY
   ```

### Step 2: Install Dependencies

Install the app's required files:

```bash
npm install
```

Then install the backend dependencies:

```bash
cd backend
npm install
cd ..
```

(This might take a few minutes - that's normal!)

### Step 3: Set Up the Backend

The backend is the server that stores your account and activity data.

1. Create a configuration file for the backend:
   ```bash
   cd backend
   cp .env.example .env
   cd ..
   ```

2. **Important**: You need to run the backend in a separate terminal window. Open a **new** Terminal/Command Prompt window and run:
   ```bash
   cd HPPY/backend
   npm start
   ```

Keep this terminal window open while using the app. You should see:
```
HPPY backend running on http://localhost:3000
```

## Running the App

### On Your Computer (Local Testing)

In your **first** terminal window (not the backend one), run:

```bash
expo start
```

A QR code will appear in the terminal and a web page will open in your browser.

### On Your Phone (Recommended)

1. Make sure your phone is on the **same WiFi network** as your computer
2. Open the **Expo Go** app on your phone
3. Scan the QR code shown in the terminal:
   - **iPhone**: Use the Camera app to scan the QR code
   - **Android**: Use the "Scan QR Code" button in Expo Go

The app should load on your phone!

### Testing on Physical Devices (Alternative Networks)

If you're on a university network (like eduroam) or your phone can't connect to your computer, you'll need to use **ngrok**:

1. Install ngrok from [ngrok.com](https://ngrok.com/) and create a free account
2. In the backend terminal window, stop the server (press Ctrl+C)
3. Start ngrok:
   ```bash
   ngrok http 3000
   ```
4. Copy the https URL shown (looks like `https://abc123.ngrok-free.app`)
5. Update the API URL in the app:
   - Open `src/services/api.js` in a text editor
   - Change line 5 to: `const API_URL = 'https://YOUR-NGROK-URL/api';`
   - Replace `YOUR-NGROK-URL` with your ngrok URL
6. In a new terminal window, start the backend:
   ```bash
   cd backend
   npm start
   ```
7. Start the Expo app as normal in another terminal

## Troubleshooting

**"Cannot connect to the app"**
- Make sure the backend terminal is still running (`npm start` in the backend folder)
- Check that your phone and computer are on the same WiFi network
- If on a restricted network, use ngrok (see above)

**"Port 3000 already in use"**
- Another app is using port 3000. Close it or run:
  ```bash
  lsof -ti:3000 | xargs kill
  ```

**App won't load on phone**
- Try restarting Expo: press Ctrl+C in the terminal, then run `expo start` again
- Clear the Expo Go app cache on your phone
- Make sure you have a stable internet connection

**"Failed to load user data"**
- Make sure the backend server is running in a separate terminal
- Check that the ngrok URL in `api.js` is correct (if using ngrok)

## First Time Using HPPY

1. Create an account with a phone number and password
2. Complete the onboarding tutorial
3. Add 5 activities to hatch your first platypus egg! 🥚
4. Track your happiness daily and watch your weekly progress

## Need Help?

If you run into any issues, feel free to reach out or check the troubleshooting section above!

---

Made with 💚 for happiness tracking