# HPPY Authentication Flow

## App Structure Overview

```
┌─────────────────────────────────────────┐
│         App.js (Entry Point)            │
│   ┌─────────────────────────────────┐   │
│   │      AuthProvider               │   │
│   │  (Authentication State & Logic) │   │
│   │                                 │   │
│   │  ┌──────────────────────────┐   │   │
│   │  │  NavigationContainer     │   │   │
│   │  │                          │   │   │
│   │  │  ┌────────────────────┐  │   │   │
│   │  │  │   AppNavigator     │  │   │   │
│   │  │  │                    │  │   │   │
│   │  │  │  Conditional Route │  │   │   │
│   │  │  │  Based on user     │  │   │   │
│   │  │  └────────────────────┘  │   │   │
│   │  └──────────────────────────┘   │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Navigation Flow

### Unauthenticated Flow (user = null)
```
┌──────────────────┐
│  SignInScreen    │
│  - Email input   │
│  - Password      │
│  - Sign In btn   │
│  - Create Acct   │
└────────┬─────────┘
         │
         │ Tap "Create Account"
         ▼
┌──────────────────────┐
│ CreateAccountScreen  │
│ - Email input        │
│ - Phone input        │
│ - Password input     │
│ - Confirm Password   │
│ - Requirements info  │
│ - Create Account btn │
│ - Back to Sign In    │
└──────────────────────┘
```

### Authenticated Flow (user exists)
```
┌──────────────────┐
│   HomeScreen     │
│  - Welcome msg   │
│  - User info     │
│    • Email       │
│    • Phone       │
│  - Sign Out btn  │
└──────────────────┘
```

## User Authentication Journey

### 1. First Time User - Create Account

```
Start
  │
  ▼
Sign In Screen
  │
  │ (User taps "Create Account")
  ▼
Create Account Screen
  │
  │ User fills:
  │ • Email: user@example.com
  │ • Phone: (123) 456-7890
  │ • Password: SecurePass123!
  │ • Confirm: SecurePass123!
  ▼
Validation Check
  │
  ├─ Invalid ──► Show error messages
  │              (stays on form)
  │
  ▼ Valid
Create Account (AuthContext)
  │
  ├─ Email exists ──► Show error alert
  │
  ▼ Success
Auto Sign In
  │
  ▼
Home Screen
  (User is authenticated)
```

### 2. Returning User - Sign In

```
Start
  │
  ▼
Sign In Screen
  │
  │ User enters:
  │ • Email: user@example.com
  │ • Password: SecurePass123!
  ▼
Validation Check
  │
  ├─ Invalid ──► Show error messages
  │
  ▼ Valid
Sign In (AuthContext)
  │
  ├─ Invalid credentials ──► Show error alert
  │
  ▼ Success
Home Screen
  (User is authenticated)
```

### 3. Sign Out

```
Home Screen
  │
  │ (User taps "Sign Out")
  ▼
Sign Out (AuthContext)
  │
  ├─ Clear user state
  ▼
Sign In Screen
  (User is logged out)
```

## Validation Rules

### Email Validation
- ✅ Required field
- ✅ Must match email format: `user@domain.com`
- ✅ Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Password Validation (Industry Standard)
- ✅ Required field
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*(),.?":{}|<>)

### Phone Number Validation
- ✅ Required field
- ✅ Minimum 10 digits
- ✅ Accepts formats:
  - `1234567890`
  - `(123) 456-7890`
  - `123-456-7890`
  - `+1234567890`

### Confirm Password Validation
- ✅ Required field
- ✅ Must match password exactly

## Components

### Reusable Components

#### Input Component
- Text input with label
- Error message display
- Focus states
- Password visibility toggle (for secure fields)
- Customizable keyboard types
- Props:
  - `label`: Field label
  - `value`: Current value
  - `onChangeText`: Change handler
  - `placeholder`: Placeholder text
  - `secureTextEntry`: Boolean for password masking
  - `keyboardType`: Input type (email, phone-pad, etc.)
  - `error`: Error message to display
  - `autoCapitalize`: Capitalization behavior

#### Button Component
- Primary and secondary variants
- Loading state with spinner
- Disabled state
- Props:
  - `title`: Button text
  - `onPress`: Click handler
  - `variant`: 'primary' or 'secondary'
  - `loading`: Boolean for loading state
  - `disabled`: Boolean for disabled state

## State Management

### AuthContext
- **State:**
  - `user`: Current authenticated user object or null
  - `users`: Array of registered users (in-memory storage)

- **Methods:**
  - `signIn(email, password)`: Authenticate user
  - `createAccount(email, password, phone)`: Register new user
  - `signOut()`: Clear user session

## Security Features

### Implemented
1. ✅ Password masking with visibility toggle
2. ✅ Industry-standard password requirements
3. ✅ Email validation to prevent invalid formats
4. ✅ Phone number validation
5. ✅ Password confirmation to prevent typos
6. ✅ Input sanitization through validation
7. ✅ Error messages for failed authentication
8. ✅ Loading states to prevent double submission

### For Production (Not Implemented)
- 🔐 Backend API integration
- 🔐 Encrypted password storage (hashing + salting)
- 🔐 Secure token-based authentication (JWT)
- 🔐 Session management
- 🔐 Rate limiting for login attempts
- 🔐 Two-factor authentication (2FA)
- 🔐 Email verification
- 🔐 SMS verification for phone numbers
- 🔐 Password reset functionality
- 🔐 Secure storage (React Native SecureStore)

## File Dependencies

```
App.js
├── NavigationContainer (@react-navigation/native)
├── createNativeStackNavigator (@react-navigation/native-stack)
├── AuthContext (./src/context/AuthContext)
├── SignInScreen (./src/screens/SignInScreen)
├── CreateAccountScreen (./src/screens/CreateAccountScreen)
└── HomeScreen (./src/screens/HomeScreen)

AuthContext.js
└── React Context API

SignInScreen.js
├── AuthContext (useAuth hook)
├── Input (./src/components/Input)
├── Button (./src/components/Button)
└── validation (./src/utils/validation)

CreateAccountScreen.js
├── AuthContext (useAuth hook)
├── Input (./src/components/Input)
├── Button (./src/components/Button)
└── validation (./src/utils/validation)

HomeScreen.js
├── AuthContext (useAuth hook)
└── Button (./src/components/Button)

Input.js
└── React Native components

Button.js
└── React Native components

validation.js
└── Pure JavaScript validation functions
```

## Testing the App

### Manual Test Cases

#### Test Case 1: Create Account - Success
1. Launch app
2. Tap "Create Account"
3. Enter:
   - Email: `test@example.com`
   - Phone: `(123) 456-7890`
   - Password: `Test123!@#`
   - Confirm: `Test123!@#`
4. Tap "Create Account"
5. **Expected:** Success alert, navigate to Home Screen

#### Test Case 2: Create Account - Weak Password
1. Launch app
2. Tap "Create Account"
3. Enter:
   - Email: `test@example.com`
   - Phone: `(123) 456-7890`
   - Password: `test123` (missing uppercase and special char)
   - Confirm: `test123`
4. Tap "Create Account"
5. **Expected:** Error message about password requirements

#### Test Case 3: Create Account - Passwords Don't Match
1. Launch app
2. Tap "Create Account"
3. Enter:
   - Email: `test@example.com`
   - Phone: `(123) 456-7890`
   - Password: `Test123!@#`
   - Confirm: `Different123!`
4. Tap "Create Account"
5. **Expected:** Error message "Passwords do not match"

#### Test Case 4: Create Account - Duplicate Email
1. Create an account with `test@example.com`
2. Sign out
3. Try to create another account with `test@example.com`
4. **Expected:** Error alert "An account with this email already exists"

#### Test Case 5: Sign In - Success
1. Create an account (if not exists)
2. Sign out
3. Enter correct email and password
4. Tap "Sign In"
5. **Expected:** Navigate to Home Screen with user info

#### Test Case 6: Sign In - Invalid Credentials
1. On Sign In screen
2. Enter incorrect email or password
3. Tap "Sign In"
4. **Expected:** Error alert "Invalid email or password"

#### Test Case 7: Sign Out
1. While signed in on Home Screen
2. Tap "Sign Out"
3. **Expected:** Navigate back to Sign In screen

## Next Steps for Production

1. **Backend Integration**
   - Set up authentication API (Firebase, Auth0, custom)
   - Implement secure password hashing (bcrypt, Argon2)
   - Add JWT token management
   
2. **Enhanced Security**
   - Add email verification flow
   - Implement SMS verification
   - Add forgot password / reset password
   - Implement 2FA
   - Add biometric authentication

3. **Persistent Storage**
   - Use AsyncStorage for non-sensitive data
   - Use SecureStore for sensitive tokens
   - Implement automatic session refresh

4. **Error Handling**
   - Add network error handling
   - Implement retry mechanisms
   - Better user feedback for edge cases

5. **Testing**
   - Unit tests for validation functions
   - Integration tests for authentication flow
   - E2E tests with Detox or Appium

6. **Analytics & Monitoring**
   - Track authentication events
   - Monitor error rates
   - User behavior analytics
