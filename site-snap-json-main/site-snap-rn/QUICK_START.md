# 🚀 Quick Start Guide

Get your React Native app running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd site-snap-rn
npm install
```

## Step 2: Start Development Server

```bash
npm start
```

This opens Expo DevTools in your browser.

## Step 3: Run on Device

### Option A: Use Your Phone (Easiest)
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal/browser
3. App loads on your phone!

### Option B: Use Simulator/Emulator
```bash
# For iOS (macOS only)
npm run ios

# For Android
npm run android
```

## 📱 App Flow

1. **Splash Screen** (2.5s auto-redirect)
2. **Login** → Choose Google or Phone
3. **Seller Details** → Fill your info
4. **Business Type** → Portfolio or Product Seller
5. **Templates** → Pick a design
6. **Products** → Add products & categories
7. **Dashboard** → View analytics

## 🎨 Key Features

- ✅ All web app features
- ✅ Native mobile UI
- ✅ Image/video uploads
- ✅ Interactive charts
- ✅ Offline data storage
- ✅ Drawer navigation

## 🛠️ Common Commands

```bash
# Start dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Clear cache
npm start -- --reset-cache

# Install pods (iOS)
cd ios && pod install && cd ..
```

## 📂 Project Structure

```
src/
├── components/      # Reusable UI
├── screens/        # App screens
├── navigation/     # Navigation setup
├── services/       # Data service
└── theme/          # Design system
```

## 🎯 Test Checklist

- [ ] Splash screen animates
- [ ] Login buttons work
- [ ] Forms save data
- [ ] Images upload
- [ ] Products CRUD works
- [ ] Charts display
- [ ] Drawer opens
- [ ] Navigation works
- [ ] Data persists

## 🐛 Troubleshooting

**Port already in use:**
```bash
killall node
npm start
```

**Can't find Expo Go QR:**
```bash
npm start -- --tunnel
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**iOS build fails:**
```bash
cd ios
pod install
cd ..
npm run ios
```

## 📚 Need Help?

- [Full README](./README.md)
- [Conversion Summary](./CONVERSION_SUMMARY.md)
- [Expo Docs](https://docs.expo.dev/)

## ✨ That's It!

Your app should be running now. Start building your business! 🎉

