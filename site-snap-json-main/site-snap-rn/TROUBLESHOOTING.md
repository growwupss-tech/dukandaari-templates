# Troubleshooting Guide - React Native App

## Current Issues & Solutions

### Issue 1: Port Allocation Error (ERR_SOCKET_BAD_PORT)

**Error:**
```
RangeError [ERR_SOCKET_BAD_PORT]: options.port should be >= 0 and < 65536. Received type number (65536).
```

**Cause:** 
Node.js v22 has stricter port validation that conflicts with Expo CLI's `freeport-async` package.

**Solutions (in order of recommendation):**

#### Solution 1: Use iOS/Android Simulator Directly (BEST)
Bypass the Expo dev server port issue entirely:

```bash
# For iOS (requires Xcode)
npx expo run:ios

# For Android (requires Android Studio)
npx expo run:android
```

This builds and runs the app directly on the simulator without the dev server port issues.

#### Solution 2: Downgrade Node.js
Use Node.js v18 LTS instead of v22:

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or using brew
brew install node@18
brew link node@18 --force --overwrite

# Then restart Expo
cd /Users/yashsangwan/Desktop/startup/site-snap-json-main/site-snap-rn
npx expo start --clear
```

#### Solution 3: Use Expo Tunnel Mode
```bash
npx expo start --tunnel
```

This uses ngrok tunneling which bypasses local port allocation.

#### Solution 4: Set Fixed Metro Port
```bash
RCT_METRO_PORT=8081 npx expo start
```

### Issue 2: Font Loader Error

**Error:**
```
_ExpoFontLoader.default.getLoadedFonts is not a function
```

**Solution:**
```bash
npm install expo-font
```

This has been installed in the current setup.

### Issue 3: TurboModule Errors (if using SDK 54)

**Error:**
```
'PlatformConstants' could not be found
```

**Solution:**
We've downgraded to SDK 51 which doesn't have this issue.

## Recommended Setup Steps

### Option A: Use iOS Simulator (Easiest)

1. **Install Xcode** from Mac App Store (if not installed)

2. **Run the app:**
   ```bash
   cd /Users/yashsangwan/Desktop/startup/site-snap-json-main/site-snap-rn
   npx expo run:ios
   ```

3. **App will build and launch automatically**

### Option B: Use Android Emulator

1. **Install Android Studio** and create an AVD

2. **Start the emulator** from Android Studio

3. **Run the app:**
   ```bash
   cd /Users/yashsangwan/Desktop/startup/site-snap-json-main/site-snap-rn
   npx expo run:android
   ```

### Option C: Downgrade Node.js and Use Expo Go

1. **Switch to Node.js 18:**
   ```bash
   nvm use 18  # or install if needed: nvm install 18
   ```

2. **Clear everything:**
   ```bash
   cd /Users/yashsangwan/Desktop/startup/site-snap-json-main/site-snap-rn
   rm -rf node_modules package-lock.json .expo
   npm install
   ```

3. **Start Expo:**
   ```bash
   npx expo start --clear
   ```

4. **Scan QR code** with Expo Go app

## Quick Commands Reference

```bash
# Clean restart
rm -rf node_modules package-lock.json .expo
npm install
npx expo start --clear

# iOS simulator
npx expo run:ios

# Android emulator
npx expo run:android

# Tunnel mode (slower but works)
npx expo start --tunnel

# With specific metro port
RCT_METRO_PORT=8081 npx expo start

# Check Node version
node --version

# Switch Node version (with nvm)
nvm use 18
```

## Current Package Versions

- **Expo SDK:** 51.0.0
- **React Native:** 0.74.5
- **Node.js Required:** v18 LTS (not v22)

## If Nothing Works

### Nuclear Option: Complete Reset

```bash
cd /Users/yashsangwan/Desktop/startup/site-snap-json-main/site-snap-rn

# Remove everything
rm -rf node_modules package-lock.json .expo ios android

# Reinstall
npm install

# Try iOS simulator directly
npx expo run:ios
```

## Additional Tips

1. **Always use `--clear` flag** when restarting to clear Metro cache
2. **Check firewall settings** if using Expo Go
3. **Ensure devices are on same WiFi** when using Expo Go
4. **Use simulators** for fastest development experience
5. **Tunnel mode** works when on different networks but is slower

## Still Having Issues?

1. Check Node.js version: `node --version`
   - If v22, downgrade to v18
   
2. Check Expo CLI version: `npx expo --version`
   
3. Try prebuild (creates native projects):
   ```bash
   npx expo prebuild
   npx expo run:ios
   ```

4. Check for running Metro processes:
   ```bash
   lsof -i :8081
   # Kill if needed
   kill -9 <PID>
   ```

