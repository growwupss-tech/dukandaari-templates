# 📁 Project Structure

Complete directory structure of the React Native app.

```
site-snap-rn/
│
├── 📱 App.tsx                          # Root component - App entry point
├── 📄 app.json                         # Expo configuration
├── ⚙️  babel.config.js                  # Babel configuration with module resolver
├── 📦 package.json                     # Dependencies and scripts
├── 🔧 tsconfig.json                    # TypeScript configuration
│
├── 📚 Documentation
│   ├── README.md                       # Main documentation
│   ├── QUICK_START.md                 # Quick start guide
│   ├── CONVERSION_SUMMARY.md          # Detailed conversion notes
│   └── PROJECT_STRUCTURE.md           # This file
│
├── 🗂️  src/                             # Source code directory
│   │
│   ├── 📱 screens/                     # Screen Components (7 screens)
│   │   ├── SplashScreen.tsx          # Animated splash with gradient
│   │   ├── LoginScreen.tsx           # Google/Phone login
│   │   ├── SellerDetailsScreen.tsx   # Seller information form
│   │   ├── BusinessTypeScreen.tsx    # Portfolio/Product selection
│   │   ├── TemplatesScreen.tsx       # Template selection grid
│   │   ├── ProductsScreen.tsx        # Product management hub
│   │   └── DashboardScreen.tsx       # Analytics dashboard
│   │
│   ├── 🧩 components/                  # Reusable Components
│   │   │
│   │   ├── ui/                        # UI Component Library
│   │   │   ├── Button.tsx            # Custom button (3 variants, 3 sizes)
│   │   │   ├── Input.tsx             # Custom input with labels
│   │   │   ├── Card.tsx              # Container with shadows
│   │   │   └── Badge.tsx             # Status badges
│   │   │
│   │   ├── CustomDrawer.tsx          # Drawer navigation menu
│   │   ├── ProductList.tsx           # Product CRUD with modal
│   │   ├── CategoryList.tsx          # Category management
│   │   └── FileUploader.tsx          # Image/video picker
│   │
│   ├── 🧭 navigation/                  # Navigation Configuration
│   │   └── AppNavigator.tsx          # Stack + Drawer navigation setup
│   │
│   ├── 💾 services/                    # Business Logic
│   │   └── dataService.ts            # AsyncStorage data layer
│   │                                  # (Seller, Products, Categories, Analytics)
│   │
│   └── 🎨 theme/                       # Design System
│       └── index.ts                   # Colors, spacing, fonts, shadows
│
├── 📸 assets/                          # (To be added)
│   ├── icon.png                       # App icon
│   ├── splash.png                     # Splash screen image
│   ├── adaptive-icon.png              # Android adaptive icon
│   └── favicon.png                    # Web favicon
│
├── 🚫 .gitignore                       # Git ignore rules
├── 📂 .expo/                           # Expo auto-generated files
└── 📦 node_modules/                    # Dependencies
```

## 📋 File Descriptions

### Root Level

| File | Purpose |
|------|---------|
| `App.tsx` | Root component, sets up providers and navigation |
| `app.json` | Expo configuration (app name, icons, permissions) |
| `babel.config.js` | Babel config with path aliases (@/) |
| `package.json` | NPM dependencies and scripts |
| `tsconfig.json` | TypeScript compiler options |

### Screens (`src/screens/`)

| Screen | Lines | Purpose |
|--------|-------|---------|
| `SplashScreen.tsx` | ~100 | Animated splash with auto-navigation |
| `LoginScreen.tsx` | ~150 | Authentication UI |
| `SellerDetailsScreen.tsx` | ~200 | Form for seller info |
| `BusinessTypeScreen.tsx` | ~200 | Business type selection |
| `TemplatesScreen.tsx` | ~250 | Template grid with selection |
| `ProductsScreen.tsx` | ~200 | Products & categories hub |
| `DashboardScreen.tsx` | ~350 | Analytics with charts & tables |

### Components (`src/components/`)

#### UI Components (`src/components/ui/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Button.tsx` | Pressable button | variant, size, disabled, loading |
| `Input.tsx` | Text input field | label, error, placeholder |
| `Card.tsx` | Container with border | style, children |
| `Badge.tsx` | Status indicator | variant, children |

#### Feature Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `CustomDrawer.tsx` | Navigation menu | All screens, logout |
| `ProductList.tsx` | Product CRUD | Modal form, image preview, delete |
| `CategoryList.tsx` | Category management | Add, delete categories |
| `FileUploader.tsx` | Media picker | Images, videos, multi-select |

### Services (`src/services/`)

| File | Purpose | Methods |
|------|---------|---------|
| `dataService.ts` | Data layer | getSeller, getProducts, getCategories, getAnalytics, etc. |

Key Classes:
- `DataService` - Singleton for all data operations
- Uses `AsyncStorage` for persistence
- Handles seller filtering
- Mock templates included

### Theme (`src/theme/`)

| Export | Purpose |
|--------|---------|
| `theme` | React Native Paper theme |
| `colors` | Color palette (primary, accent, etc.) |
| `shadows` | Shadow presets (soft, medium, strong) |
| `spacing` | Spacing scale (xs to xxl) |
| `fontSize` | Font size scale (xs to huge) |

### Navigation (`src/navigation/`)

| File | Purpose | Type |
|------|---------|------|
| `AppNavigator.tsx` | Navigation setup | Stack + Drawer |

Navigation Flow:
```
Stack Navigator (Auth)
├── Splash → Login
└── Main (Drawer)
    ├── Dashboard
    ├── SellerDetails
    ├── BusinessType
    ├── Templates
    └── Products
```

## 📊 Code Statistics

```
Total Files:    ~25 files
Total Lines:    ~3,500 lines
Screens:        7 screens
Components:     8 components
Languages:      TypeScript, TSX
```

### Breakdown by Directory

| Directory | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| `screens/` | 7 | ~1,500 | User-facing screens |
| `components/` | 8 | ~1,200 | Reusable components |
| `services/` | 1 | ~400 | Data layer |
| `theme/` | 1 | ~150 | Design system |
| `navigation/` | 1 | ~100 | Nav config |
| Root | 3 | ~150 | Setup files |

## 🎯 Import Paths

Using path aliases for clean imports:

```typescript
// ✅ Good (with @/)
import { Button } from '@/components/ui/Button';
import { dataService } from '@/services/dataService';
import { colors } from '@/theme';

// ❌ Avoid (relative paths)
import { Button } from '../../components/ui/Button';
```

## 📦 Dependencies Map

```
Core
├── expo                           # Development platform
├── react                          # React library
└── react-native                   # Mobile framework

Navigation
├── @react-navigation/native       # Navigation core
├── @react-navigation/stack        # Stack navigation
└── @react-navigation/drawer       # Drawer navigation

UI & Styling
├── react-native-paper             # Material Design
├── expo-linear-gradient           # Gradients
└── react-native-svg               # SVG support

Features
├── @react-native-async-storage    # Local storage
├── expo-image-picker              # Image/video picker
└── victory-native                 # Charts

Utils
├── react-native-gesture-handler   # Touch handling
└── react-native-reanimated        # Animations
```

## 🔍 Finding Files

### Need to modify a screen?
→ `src/screens/[ScreenName]Screen.tsx`

### Need to modify a component?
→ `src/components/[ComponentName].tsx`

### Need to change colors/spacing?
→ `src/theme/index.ts`

### Need to add/modify data operations?
→ `src/services/dataService.ts`

### Need to change navigation?
→ `src/navigation/AppNavigator.tsx`

### Need to update dependencies?
→ `package.json`

### Need to configure Expo?
→ `app.json`

## 🎨 Styling Location

All styles are co-located with components using `StyleSheet.create()`:

```typescript
// At bottom of each component file
const styles = StyleSheet.create({
  container: { ... },
  title: { ... },
  // etc.
});
```

Design tokens centralized in `src/theme/index.ts`.

## 🗂️ Related Files

| Task | Primary File | Related Files |
|------|-------------|---------------|
| Add new screen | `src/screens/NewScreen.tsx` | `navigation/AppNavigator.tsx` |
| Add new component | `src/components/NewComponent.tsx` | Import in screen |
| Modify data structure | `services/dataService.ts` | Update types |
| Change theme | `theme/index.ts` | Affects all components |
| Add navigation route | `navigation/AppNavigator.tsx` | Add screen import |

## 📚 Documentation Files

- `README.md` - Full documentation with setup
- `QUICK_START.md` - 5-minute quick start
- `CONVERSION_SUMMARY.md` - Detailed conversion notes
- `PROJECT_STRUCTURE.md` - This file

---

**Navigate with confidence! 🗺️**

