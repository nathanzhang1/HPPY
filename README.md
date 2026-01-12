# HPPY - React Native Authentication App

A mobile authentication starter app built with React Native and Expo, featuring industry-standard security practices and user-friendly authentication flows.

## Features

- ✅ **Create Account** with comprehensive validation
- ✅ **Sign In** functionality
- ✅ **Industry-standard password requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- ✅ **Email validation**
- ✅ **Phone number validation**
- ✅ **Secure password handling** (masked input with toggle visibility)
- ✅ **Form validation and error handling**
- ✅ **Loading states for better UX**
- ✅ **Responsive UI design**

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** or **yarn** (comes with Node.js)
   - Verify installation: `npm --version` or `yarn --version`

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go App** on your mobile device
   - iOS: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

5. **Optional: iOS Simulator / Android Emulator**
   - **For iOS** (Mac only):
     - Install [Xcode](https://developer.apple.com/xcode/) from the Mac App Store
     - Open Xcode, go to Preferences → Components, install iOS Simulator
   - **For Android**:
     - Install [Android Studio](https://developer.android.com/studio)
     - Set up an Android Virtual Device (AVD) through Android Studio

## Installation & Setup

Follow these steps to set up and run the app on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/nathanzhang1/HPPY.git
cd HPPY
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Start the Development Server

```bash
npm start
```

Or:

```bash
expo start
```

This will start the Expo development server and display a QR code in your terminal.

## Running the App

Once the development server is running, you have several options to run the app:

### Option 1: Run on Physical Device (Recommended for Quick Testing)

1. Install the **Expo Go** app on your iOS or Android device
2. Scan the QR code displayed in your terminal with:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app's QR scanner
3. The app will load on your device

### Option 2: Run on iOS Simulator (Mac only)

```bash
npm run ios
```

Or press `i` in the terminal where Expo is running.

### Option 3: Run on Android Emulator

1. Start your Android emulator from Android Studio
2. Run:
   ```bash
   npm run android
   ```
   Or press `a` in the terminal where Expo is running.

### Option 4: Run in Web Browser

```bash
npm run web
```

Or press `w` in the terminal where Expo is running.

## Project Structure

```
HPPY/
├── App.js                          # Main application entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
├── babel.config.js                 # Babel configuration
├── assets/                         # App assets (icons, splash screens)
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Button.js              # Custom button component
│   │   └── Input.js               # Custom input component with validation
│   ├── context/                    # React Context for state management
│   │   └── AuthContext.js         # Authentication state and logic
│   ├── screens/                    # App screens
│   │   ├── SignInScreen.js        # Sign in screen
│   │   ├── CreateAccountScreen.js # Account creation screen
│   │   └── HomeScreen.js          # Authenticated home screen
│   └── utils/                      # Utility functions
│       └── validation.js          # Input validation functions
└── README.md                       # This file
```

## How to Use the App

### Creating a New Account

1. Launch the app
2. On the Sign In screen, tap **"Create Account"**
3. Fill in the following information:
   - **Email**: Must be a valid email format
   - **Phone Number**: Enter a valid phone number (10+ digits)
   - **Password**: Must meet all security requirements (see requirements below)
   - **Confirm Password**: Must match your password
4. Tap **"Create Account"**
5. Upon success, you'll be automatically signed in

### Password Requirements

For security, passwords must contain:
- ✓ At least 8 characters
- ✓ One uppercase letter (A-Z)
- ✓ One lowercase letter (a-z)
- ✓ One number (0-9)
- ✓ One special character (!@#$%^&*)

### Signing In

1. Enter your registered email
2. Enter your password
3. Tap **"Sign In"**
4. Upon successful authentication, you'll see the home screen with your account details

### Signing Out

1. From the home screen, tap **"Sign Out"**
2. You'll be returned to the sign-in screen

## Development Commands

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device (Mac only)
- `npm run web` - Run in web browser

## Technical Details

### State Management
- Uses React Context API for authentication state management
- In-memory storage for demo purposes (users array stored in context)

### Navigation
- React Navigation v6 with Native Stack Navigator
- Conditional rendering based on authentication state

### Security Features
- Password input masking with toggle visibility
- Comprehensive input validation
- Industry-standard password requirements
- Email format validation
- Phone number format validation

### UI/UX Features
- Responsive design
- Loading states during authentication
- Error handling and user feedback
- Focus states on inputs
- Keyboard-aware scrolling
- Safe area handling for different devices

## Future Enhancements

Possible additions for production use:
- Password reset/forgot password functionality
- Email verification
- SMS verification for phone numbers
- Persistent storage (AsyncStorage, SecureStore)
- Backend API integration
- Social authentication (Google, Apple, Facebook)
- Biometric authentication (Face ID, Touch ID)
- Session management and token refresh
- Profile management
- More robust error handling

## Notes

- This is a starter/demo application with in-memory authentication
- For production use, integrate with a secure backend API
- Passwords are stored in plain text in memory (for demo only)
- In production, use secure storage and proper authentication services

## Troubleshooting

### Common Issues

1. **"Metro bundler error"**
   - Clear cache: `expo start -c`

2. **"Cannot connect to Metro"**
   - Ensure your device and computer are on the same network
   - Try using tunnel mode: `expo start --tunnel`

3. **"Module not found"**
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

4. **iOS Simulator not launching**
   - Ensure Xcode and Command Line Tools are installed
   - Try: `sudo xcode-select --switch /Applications/Xcode.app`

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.