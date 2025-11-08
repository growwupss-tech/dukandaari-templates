# SiteSnap - React Native App

This is the React Native version of the SiteSnap web application. It maintains all features, design, and functionality of the original web app while providing a native mobile experience.

## 🚀 Features

All features from the web app have been converted to React Native:

- **Splash Screen** - Beautiful animated splash with gradient background
- **Authentication** - Google and Phone login options
- **Seller Onboarding**
  - Seller details form
  - Business type selection (Portfolio vs Product Seller)
  - Template selection with preview
- **Product Management**
  - Create, edit, and delete products
  - Category management
  - Image and video upload support
  - Product specifications and attributes
  - Inventory tracking
  - Product visibility toggle
- **Analytics Dashboard**
  - Visitor analytics with interactive charts (Victory Native)
  - Product performance tracking
  - Multiple time period views (15 days, 30 days, 6 months, 1 year)
  - WhatsApp inquiries tracking
- **Navigation** - Drawer navigation with all main sections
- **Data Persistence** - AsyncStorage for offline data storage
- **📊 JSON Data System** - Same JSON data files as web app
  - Import/Export data between web and mobile
  - Reset to defaults
  - Backup and restore functionality
  - Settings screen for data management

## 📱 Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library (Stack & Drawer)
- **React Native Paper** - UI component library
- **Victory Native** - Charts and data visualization
- **AsyncStorage** - Local data persistence
- **Expo Image Picker** - Image/video selection
- **Expo Linear Gradient** - Gradient backgrounds

## 🎨 Design

The app maintains the same design system as the web app:
- Primary color: #1A5FFF (Blue)
- Accent color: #FF6B6B (Red/Pink)
- All spacing, typography, and shadows match the web version
- Smooth animations and transitions
- Modern, clean UI with rounded corners

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

For iOS development:
- macOS
- Xcode
- iOS Simulator

For Android development:
- Android Studio
- Android SDK
- Android Emulator

## 🛠️ Installation

1. Navigate to the React Native app directory:
```bash
cd site-snap-rn
```

2. Install dependencies:
```bash
npm install
```

Or with yarn:
```bash
yarn install
```

## 🏃 Running the App

### Start the development server:
```bash
npm start
```

This will open the Expo Developer Tools in your browser.

### Run on iOS Simulator:
```bash
npm run ios
```

### Run on Android Emulator:
```bash
npm run android
```

### Run on Physical Device:
1. Install the Expo Go app on your iOS or Android device
2. Scan the QR code shown in the terminal or Expo Developer Tools
3. The app will load on your device

## 📂 Project Structure

```
site-snap-rn/
├── App.tsx                 # Root component
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── src/
    ├── components/        # Reusable components
    │   ├── ui/           # UI components (Button, Input, Card, etc.)
    │   ├── CategoryList.tsx
    │   ├── CustomDrawer.tsx
    │   ├── FileUploader.tsx
    │   └── ProductList.tsx
    ├── data/             # JSON data files (same as web app)
    │   ├── seller.json
    │   ├── categories.json
    │   ├── products.json
    │   ├── templates.json
    │   └── analytics.json
    ├── navigation/        # Navigation configuration
    │   └── AppNavigator.tsx
    ├── screens/          # Screen components
    │   ├── SplashScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── SellerDetailsScreen.tsx
    │   ├── BusinessTypeScreen.tsx
    │   ├── TemplatesScreen.tsx
    │   ├── ProductsScreen.tsx
    │   ├── DashboardScreen.tsx
    │   └── SettingsScreen.tsx
    ├── services/         # Business logic
    │   └── dataService.ts
    ├── utils/            # Utility functions
    │   └── dataSync.ts
    └── theme/            # Theme configuration
        └── index.ts
```

## 🔄 Key Conversions from Web to React Native

### Components
- `div` → `View`
- `span`, `p`, `h1` → `Text`
- `img` → `Image`
- `button` → `TouchableOpacity` / Custom `Button` component
- `input` → `TextInput` / Custom `Input` component

### Styling
- Tailwind CSS → React Native StyleSheet
- CSS classes → Style objects
- Flexbox (similar but with minor differences)

### Storage
- `localStorage` → `AsyncStorage`
- All data operations are now async

### Navigation
- React Router → React Navigation (Stack & Drawer)
- `useNavigate()` → `navigation.navigate()`
- URL routes → Screen names

### Charts
- Recharts → Victory Native
- Similar API but adapted for mobile

### File Uploads
- Web file input → Expo Image Picker
- Base64 encoding for image storage

## 🎯 Features Parity

All features from the web app are implemented:

| Feature | Web App | React Native App |
|---------|---------|------------------|
| Splash Screen | ✅ | ✅ |
| Login (Google/Phone) | ✅ | ✅ |
| Seller Details Form | ✅ | ✅ |
| Business Type Selection | ✅ | ✅ |
| Template Selection | ✅ | ✅ |
| Category Management | ✅ | ✅ |
| Product CRUD | ✅ | ✅ |
| Image/Video Upload | ✅ | ✅ |
| Product Specifications | ✅ | ✅ |
| Product Attributes | ✅ | ✅ |
| Inventory Status | ✅ | ✅ |
| Product Visibility | ✅ | ✅ |
| Analytics Dashboard | ✅ | ✅ |
| Visitor Charts | ✅ | ✅ |
| Product Performance | ✅ | ✅ |
| Drawer Navigation | ✅ | ✅ |
| Data Persistence | ✅ | ✅ |

## 🔐 Permissions

The app requires the following permissions:
- **Photo Library** - To upload product images and videos
- **Camera** (optional) - To take photos directly

These are requested when the user tries to upload media.

## 📱 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Or use EAS Build (recommended):
```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### iOS Build Issues
```bash
cd ios
pod install
cd ..
npm run ios
```

### Android Build Issues
- Ensure Android Studio is properly installed
- Check that ANDROID_HOME environment variable is set
- Verify that an emulator is running or a device is connected

## 📝 Notes

- The app uses AsyncStorage for data persistence (similar to localStorage in web)
- **JSON data files** provide default data (same structure as web app)
- Data can be exported/imported between web and mobile apps
- Settings screen allows data management (export, import, reset)
- Charts require Victory Native which works on both iOS and Android
- Image picker requires native permissions
- All styling maintains the same visual design as the web app

## 📊 JSON Data System

The React Native app uses **the exact same JSON data files** as the web app:

### Data Files (src/data/)
- `seller.json` - Seller information
- `categories.json` - Product categories
- `products.json` - Product catalog
- `templates.json` - Template designs
- `analytics.json` - Analytics data

### How It Works
1. **First Launch**: JSON files are loaded into AsyncStorage
2. **Runtime**: All operations use AsyncStorage (fast, offline)
3. **Sync**: Export/Import between web and mobile via Settings screen

### Settings Screen Features
- 📤 **Export Data** - Copy all data to clipboard
- 📥 **Import Data** - Import from web app or backup
- 🔄 **Reset to Defaults** - Restore original JSON data
- 🗑️ **Clear All Data** - Delete everything

### Documentation
- [DATA_MANAGEMENT.md](./DATA_MANAGEMENT.md) - Complete data guide
- [JSON_DATA_IMPLEMENTATION.md](./JSON_DATA_IMPLEMENTATION.md) - Implementation details

## 🤝 Contributing

This is a direct conversion of the web app to React Native. To maintain feature parity:
1. Any new features in the web app should be added here
2. Keep design system synchronized
3. Maintain the same data structure
4. Test on both iOS and Android

## 📄 License

Same as the original web app.

## 🔗 Related

- Web App: Located in the parent directory
- Uses the same data structure and business logic
- Can share data export/import functionality (future feature)

## 🎉 Success!

You now have a fully functional React Native app with all the features of the original web app!

For support or questions, please refer to the Expo documentation:
- https://docs.expo.dev/
- https://reactnavigation.org/
- https://formidable.com/open-source/victory/docs/native/

