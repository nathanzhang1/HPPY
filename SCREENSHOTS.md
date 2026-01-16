# App Screenshots & Visual Guide

> **Note:** This document describes what the app screens look like. For actual screenshots, run the app and take screenshots on your device.

## 📱 Screen Mockups

### 1. Sign In Screen (Default/Landing)

```
╔════════════════════════════════╗
║                                ║
║    Welcome Back!               ║
║    Sign in to continue         ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Email                  │  ║
║    │ Enter your email       │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Password               │  ║
║    │ ••••••••••        👁️  │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │     Sign In            │  ║
║    └────────────────────────┘  ║
║                                ║
║    Don't have an account?      ║
║    ┌────────────────────────┐  ║
║    │  Create Account        │  ║
║    └────────────────────────┘  ║
║                                ║
╚════════════════════════════════╝
```

**Features:**
- Clean, minimal design
- Email input field
- Password input with visibility toggle (eye icon)
- Primary "Sign In" button (blue)
- Secondary "Create Account" button (white with blue border)

---

### 2. Create Account Screen

```
╔════════════════════════════════╗
║                                ║
║    Create Account              ║
║    Join us today!              ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Email                  │  ║
║    │ Enter your email       │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Phone Number           │  ║
║    │ (123) 456-7890         │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Password               │  ║
║    │ ••••••••••        👁️  │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Password must contain: │  ║
║    │ • At least 8 chars     │  ║
║    │ • One uppercase (A-Z)  │  ║
║    │ • One lowercase (a-z)  │  ║
║    │ • One number (0-9)     │  ║
║    │ • One special char     │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │ Confirm Password       │  ║
║    │ ••••••••••        👁️  │  ║
║    └────────────────────────┘  ║
║                                ║
║    ┌────────────────────────┐  ║
║    │   Create Account       │  ║
║    └────────────────────────┘  ║
║                                ║
║    Already have an account?    ║
║    ┌────────────────────────┐  ║
║    │      Sign In           │  ║
║    └────────────────────────┘  ║
║                                ║
╚════════════════════════════════╝
```

**Features:**
- All input fields with labels
- Password requirements displayed prominently
- Both password fields have visibility toggle
- Validation feedback on errors
- Easy navigation back to Sign In

---

### 3. Home Screen (Authenticated)

```
╔════════════════════════════════╗
║                                ║
║         Welcome!               ║
║   You're successfully          ║
║      signed in                 ║
║                                ║
║                                ║
║    ┌────────────────────────┐  ║
║    │                        │  ║
║    │  Email:                │  ║
║    │  john@example.com      │  ║
║    │  ─────────────────     │  ║
║    │  Phone:                │  ║
║    │  (555) 123-4567        │  ║
║    │                        │  ║
║    └────────────────────────┘  ║
║                                ║
║                                ║
║                                ║
║                                ║
║    ┌────────────────────────┐  ║
║    │      Sign Out          │  ║
║    └────────────────────────┘  ║
║                                ║
╚════════════════════════════════╝
```

**Features:**
- Welcome message
- User information card showing email and phone
- Sign out button at bottom

---

## 🎨 Design Elements

### Color Scheme
- **Primary Blue:** `#007AFF` (buttons, focused inputs)
- **Background:** `#f8f9fa` (light gray)
- **Text:** `#333` (dark gray)
- **Error Red:** `#FF3B30`
- **Border:** `#ddd` (light gray)

### Typography
- **Headings:** 32px, bold
- **Subheadings:** 16px, regular
- **Body:** 14-16px
- **Small text:** 11-12px

### Components

#### Input Fields
- White background
- Light gray border (1px)
- Rounded corners (8px)
- Blue border when focused (2px)
- Red border when error
- Eye icon for password fields

#### Buttons
- **Primary:** Blue background, white text
- **Secondary:** White background, blue border, blue text
- Rounded corners (8px)
- Disabled state: 50% opacity
- Loading state: spinner animation

#### Password Requirements Box
- Light blue background (`#e8f4ff`)
- Small text
- Bullet points
- Rounded corners

---

## 🎬 User Flows

### Flow 1: First Time User
```
Open App
   ↓
Sign In Screen
   ↓
Tap "Create Account"
   ↓
Fill all fields
   ↓
Tap "Create Account"
   ↓
[Validation passes]
   ↓
See success alert
   ↓
Automatically signed in
   ↓
Home Screen appears
```

### Flow 2: Returning User
```
Open App
   ↓
Sign In Screen
   ↓
Enter credentials
   ↓
Tap "Sign In"
   ↓
[Credentials valid]
   ↓
Home Screen appears
```

### Flow 3: Sign Out
```
Home Screen
   ↓
Tap "Sign Out"
   ↓
Return to Sign In Screen
```

---

## 🔍 Validation States

### Email Input
- ✅ **Valid:** `user@example.com` (green checkmark could be added)
- ❌ **Invalid:** `invalid-email` (red border, error message below)

### Password Input
- ✅ **Valid:** `MyPassword123!` (meets all requirements)
- ❌ **Invalid:** `weak` (red border, specific error message)

### Phone Input
- ✅ **Valid:** `(555) 123-4567`, `5551234567`, `555-123-4567`
- ❌ **Invalid:** `123` (red border, error message)

### Error Messages
Appear below input fields in red text:
- "Email is required"
- "Please enter a valid email address"
- "Password must be at least 8 characters long"
- "Passwords do not match"
- "Phone number must be 10-11 digits"

---

## 📸 How to Take Screenshots

### On iOS:
1. Run: `npm run ios`
2. Use Simulator → File → Save Screen Shot
3. Or press `⌘ + S` in simulator

### On Android:
1. Run: `npm run android`
2. Use emulator toolbar screenshot button
3. Or use `⌘ + S` / `Ctrl + S`

### On Physical Device:
1. Scan QR code with Expo Go
2. Use device screenshot method:
   - **iOS:** Side button + Volume Up
   - **Android:** Power + Volume Down

---

## 🎯 Testing Checklist

- [ ] Sign In screen displays correctly
- [ ] Create Account screen displays correctly
- [ ] Home screen displays correctly
- [ ] Input fields accept text
- [ ] Password visibility toggle works
- [ ] Error messages appear on invalid input
- [ ] Success alert appears on account creation
- [ ] Navigation between screens works
- [ ] Sign out returns to Sign In screen
- [ ] App looks good on different screen sizes

---

## 💡 Customization Ideas

Want to make it your own? Try:
- Change the primary color in component styles
- Add a logo to the header
- Add animations for screen transitions
- Add icons to input fields
- Create a splash screen with your brand
- Add dark mode support
- Add haptic feedback on button presses
