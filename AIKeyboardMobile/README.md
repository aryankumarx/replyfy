# 📱 AI Keyboard Mobile App

The Android mobile companion for **AI Keyboard Assistant** — a privacy-first, React Native app with native Kotlin modules for clipboard management, smart reply generation, and floating overlay bubbles.

## ✅ Current Working Features

### 🎨 Dashboard UI (`App.tsx`)
- Premium dark theme with animated pulse indicators & smooth transitions
- **Clipboard Listener** toggle — polls clipboard every 1.5s for new copied text
- **Incognito Mode** — one-tap privacy switch to pause all clipboard tracking
- **Auto-Clear Clipboard** — wipes clipboard 10s after you copy a reply
- **Security Status Card** — live blocked count, auto-clear status, privacy mode
- **Smart Reply Cards** — tap any AI suggestion to copy it instantly
- **Permission Modal** — first-launch consent with clear privacy promises

### 🛡️ Security (`App.tsx` + `FloatingBubbleService.kt`)
- **Sensitive text detection** — automatically blocks API keys, tokens, passwords from being sent to AI
- Pattern matching for: `sk-`, `api-`, `ghp_`, `AIza`, `Bearer`, `eyJ`, and mixed-case+digit+symbol strings

### 🔌 Native Modules (Kotlin)
| File | Purpose | Status |
|------|---------|--------|
| `FloatingBubbleService.kt` | Foreground service that draws a ⌨️ overlay bubble with input panel + reply cards | 🚧 Debugging |
| `FloatingBubbleModule.kt` | React Native ↔ Kotlin bridge (start/stop service, check overlay permission) | ✅ Working |
| `FloatingBubblePackage.kt` | Registers the native module with React Native | ✅ Working |
| `ClipboardGrabberActivity.kt` | Invisible 1×1px Activity for legal clipboard reading on Android 10+ | 🚧 Debugging |
| `ChatAccessibilityService.kt` | Detects active chat apps (WhatsApp, Telegram, etc.) to auto-show/hide bubble | 🚧 Not wired |
| `MainActivity.kt` | Standard React Native entry point | ✅ Working |
| `MainApplication.kt` | App bootstrap + native module registration | ✅ Working |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Android Studio (with an emulator or physical device)
- Java 17+

### Setup

```bash
# Install JS dependencies
npm install

# Start Metro bundler
npx react-native start

# In another terminal — run on Android
npx react-native run-android
```

### If you see "Unable to load script" error

```bash
# 1. Create assets directory
mkdir android\app\src\main\assets

# 2. Bundle JS offline
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res

# 3. Run the app again
npx react-native run-android
```

### If running from Android Studio

```bash
# Make sure Metro port is forwarded to emulator
adb reverse tcp:8081 tcp:8081

# Then start Metro
npx react-native start --reset-cache
```

## 📁 Key Files

```
AIKeyboardMobile/
├── App.tsx                  # Main dashboard UI (all working features)
├── index.js                 # React Native entry point
├── android/
│   └── app/src/main/
│       ├── AndroidManifest.xml              # Permissions & service declarations
│       ├── res/xml/accessibility_service_config.xml
│       ├── res/values/strings.xml
│       └── java/com/aikeyboardmobile/
│           ├── MainActivity.kt
│           ├── MainApplication.kt
│           ├── FloatingBubbleService.kt     # 🫧 Overlay bubble service
│           ├── FloatingBubbleModule.kt      # 🔌 JS ↔ Kotlin bridge
│           ├── FloatingBubblePackage.kt     # 📦 Module registration
│           ├── ClipboardGrabberActivity.kt  # 📋 Clipboard workaround
│           └── ChatAccessibilityService.kt  # 🔗 Chat app detector
└── package.json
```

## 🔮 Roadmap

- [ ] Fix floating bubble overlay on emulator/device
- [ ] Wire up accessibility service to auto-show bubble in chat apps only
- [ ] Claude AI fallback integration
- [ ] Local settings (auto-clear delay, theme customization)
- [ ] Favorites manager (save top replies via AsyncStorage)

## 👨‍💻 Built By

**Aryan Kumar** — Privacy-first • Zero storage • Open source
