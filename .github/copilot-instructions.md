# Copilot Instructions for HPPY

## Build & Run Commands

```bash
# Frontend (React Native/Expo)
npm install
expo start              # or: npm start
expo start --ios
expo start --android

# Backend (Express/SQLite)
cd backend
npm install
cp .env.example .env    # First time setup
npm start               # Production
npm run dev             # Development with auto-reload
```

## Architecture

HPPY is a React Native / Expo mobile app with an Express.js backend for user wellness and happiness tracking.

### Backend (`backend/`)
- **Express.js** REST API on port 3000
- **SQLite** database (`hppy.db`) with better-sqlite3
- **bcrypt** for password hashing (12 salt rounds)
- **JWT** for authentication tokens

API endpoints:
```
POST /api/auth/register              - Create account (phone, password)
POST /api/auth/login                 - Sign in, returns JWT
GET  /api/auth/me                    - Get current user (requires auth)
POST /api/activities                 - Create activity (requires auth)
GET  /api/activities                 - Get all user's activities (requires auth)
PATCH /api/activities/:id            - Update activity (requires auth)
DELETE /api/activities/:id           - Delete activity (requires auth)
GET  /api/user/settings              - Get settings (notification_frequency, has_hatched, animals, items)
PATCH /api/user/settings             - Update settings (requires auth)
GET  /api/user/recommended-activities - Get user's recommended activities (requires auth)
POST /api/user/recommended-activities - Save recommended activities list (requires auth)
GET  /api/health                     - Health check
```

### Frontend Context Providers (wrap entire app in App.js)
- **AuthProvider** (`src/context/AuthContext.js`) - Manages user authentication state via backend API. Persists JWT tokens in AsyncStorage.
- **AnimatedBackgroundProvider** (`src/context/AnimatedBackgroundContext.js`) - Shared animation state for background wave effects across screens.

### API Service (`src/services/api.js`)
Centralized API client handling authentication headers and token storage:
```javascript
import api from '../services/api';
// Auth
await api.login(phone, password);
await api.register(phone, password);
await api.logout();
await api.checkAuth();
// Activities
await api.createActivity(name, happiness);
await api.getActivities();
await api.updateActivity(id, name, happiness);
await api.deleteActivity(id);
```

### Navigation Flow (conditional in AppNavigator)
```
Unauthenticated: Welcome → PhoneEntry → CreatePassword → SignIn
New User:        → Onboarding
Authenticated:   Home → ProfileCompletion, Data, Sanctuary, FittingRoom, Shop
```

### Key Directories
- `src/screens/` - Full-page screen components (Home, Data, Sanctuary, FittingRoom, Shop, ProfileCompletion, etc.)
- `src/components/` - Reusable UI components
- `src/components/home/` - Card components for HomeScreen grid layout
- `src/components/data/` - Data screen components (ActivityLog, WeeklyHappinessChart)
- `src/utils/validation.js` - Form validation functions (email, password, phone)
- `assets/fitting-room/` - Fitting room screen assets
- `assets/shop/` - Shop screen assets (experiment cards, item images)

## Conventions

### Reusable Components
Use the existing `Input` and `Button` components from `src/components/`:
- **Input**: Supports `label`, `error`, `secureTextEntry` with show/hide toggle, `keyboardType`
- **Button**: Variants are `primary`, `secondary`, `white`, `glass`. Supports `loading` and `disabled` states.

### Validation Pattern
Validation functions return `{ valid: boolean, message: string }`. Import from `src/utils/validation.js`:
```javascript
import { validateEmail, validatePassword, validatePhone, validateConfirmPassword } from '../utils/validation';
```

### Authentication
Access auth state and methods via the `useAuth()` hook:
```javascript
const { user, signIn, createAccount, signOut, hasCompletedOnboarding, completeOnboarding } = useAuth();
```

### Screen Structure
Screens use `SafeAreaView` from `react-native-safe-area-context` with `expo-status-bar`:
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
```

### Styling
- Inline `StyleSheet.create()` at bottom of each component file
- Primary blue: `#007AFF`
- Error red: `#FF3B30`
- Background gray: `#F5F5F5`
