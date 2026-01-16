# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Prerequisites
```bash
# Install Node.js from https://nodejs.org/ (v16+)
# Then install Expo CLI
npm install -g expo-cli
```

### Step 2: Clone and Setup
```bash
git clone https://github.com/nathanzhang1/HPPY.git
cd HPPY
npm install
```

### Step 3: Run the App
```bash
npm start
```

### Step 4: View on Your Device
- Download **Expo Go** app on your phone
- Scan the QR code that appears in your terminal
- The app will load on your device!

---

## 📱 Using the App

### Create Your First Account

1. **Launch the app** - You'll see the Sign In screen
2. **Tap "Create Account"**
3. **Fill in your details:**
   ```
   Email: john@example.com
   Phone: (555) 123-4567
   Password: MySecure123!
   Confirm Password: MySecure123!
   ```
4. **Tap "Create Account"**
5. **Success!** You're now signed in

### Password Requirements ✅
Your password must have:
- ✓ At least 8 characters
- ✓ One UPPERCASE letter
- ✓ One lowercase letter  
- ✓ One number (0-9)
- ✓ One special character (!@#$%^&*)

Example valid passwords:
- `SecurePass123!`
- `MyP@ssw0rd`
- `Test1234!@#`

---

## 🎯 What You Can Do

### When Not Signed In:
- ✅ Create a new account
- ✅ Sign in with existing account

### When Signed In:
- ✅ View your account information
- ✅ Sign out

---

## 📋 Common Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Start development server |
| `npm run ios` | Run on iOS simulator (Mac only) |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |

---

## 🐛 Troubleshooting

### Can't connect to Metro?
```bash
expo start -c  # Clear cache and restart
```

### Module not found?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Need tunnel mode?
```bash
expo start --tunnel  # If on different network
```

---

## 📚 Learn More

- 📖 Full documentation: [README.md](README.md)
- 🏗️ Architecture details: [ARCHITECTURE.md](ARCHITECTURE.md)
- 🎨 Asset setup: [assets/README.md](assets/README.md)

---

## 💡 Tips

**For Testing:**
- You can create multiple accounts with different emails
- Sign out and sign back in to test authentication
- Try invalid inputs to see validation in action

**For Development:**
- Make code changes and see them instantly reload
- Press `r` in terminal to reload manually
- Press `d` to open developer menu

---

## ⚠️ Important Notes

- This is a **demo app** with in-memory storage
- Data is **lost when app closes**
- Passwords are **not encrypted** (demo only!)
- For **production**, you need:
  - Backend API
  - Real database
  - Password hashing
  - Secure token storage

---

## 🎉 You're Ready!

Now you can:
1. Explore the code in `src/`
2. Try creating accounts
3. Test the validation
4. Build your own features on top!

Happy coding! 🚀
