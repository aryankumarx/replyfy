# AI Keyboard Assistant - Development Journal & Architecture
*Last Updated: March 2026*

This document serves as the master record of everything built, configured, and deployed for the AI Keyboard Assistant project. This is a highly secure, full-stack application designed with AppSec principles.

---

## 1. 🌐 The Backend API (Node.js & Express)
**Status:** ✅ Fully Built, Secured, and Deployed Live on Render.com (`https://ai-keyboard-assistant.onrender.com`)

**Core Features & Security:**
- **Google Gemini 2.5 Flash-Lite Integration:** Uses Google's generative AI to parse incoming text and return exactly 4 categorized smart replies (Casual, Professional, Brief, Quick).
- **Intelligent Language Detection:** Natively detects Romanized Hinglish (e.g., "kya haal hai") alongside traditional English and Devanagari Hindi, automatically adapting the AI's response language/tone to match the user.
- **Rate Limit Protection:** Configured with `express-rate-limit` to prevent IP spamming (Max 10 requests per minute).
- **API Key Authentication (`verifyApiKey`):** Implemented Zero-Trust architecture. The `/api/suggest` endpoint completely blocks unauthorized access without the strictly guarded `x-api-key` header (`APP_API_KEY`).
- **Input Sanitization (XSS Defense):** Utilizes `express-validator` to strict-type payloads, strip malicious HTML tags (`.escape()`), and limit payload size to a maximum of 1000 characters.
- **In-Memory Caching & Cooldowns:** Saves repeated identical requests for 5 minutes to prevent burning through the Gemini API Quota.

## 2. 💻 The Web Demo Frontend (HTML/JS)
**Status:** ✅ Fully Built & Pushed to GitHub

**Core Features:**
- Glassmorphic, highly modern, dark-themed UI.
- Sends the `x-api-key` securely via Fetch to communicate directly with the Render API.
- Implements frontend debouncing and a strict 3-second cooldown toggle to prevent users from rapidly clicking "Generate" and breaching API quotas.
- Displays responsive AI suggestion cards that copy strictly to the local clipboard when clicked.

## 3. 📱 The Mobile App (React Native - Android)
**Status:** 🚧 In Development (Currently Compiling Bare Native Android code via Gradle)

**Architecture & Framework:**
- **Framework:** Bare React Native (Not Expo Go) initialized via `@react-native-community/cli`. This allows deep integration with Android OS Permissions (Clipboard reading, Background Services, Floating Windows) which restricted environments like Expo block.
- **UI File (`App.tsx`):** Hand-coded a beautiful React Native Dashboard supporting:
  - **Incognito Mode:** A privacy switch that strictly disables clipboard parsing.
  - **Auto-Clipboard Listener:** Checks OS Clipboard every 1.5 seconds. If new text is copied from an app like WhatsApp, it captures it for processing.

**Complex Android Fixes Implemented:**
- **Gradle Version Override:** React Native 0.84 pulled Gradle 9.0 which natively stripped the `IBM_SEMERU` JVM vendor, causing the NDK C++ compiler to crash. *Fix:* Downgraded `gradle-wrapper.properties` to `8.10.2`.
- **Java 17 Isolation:** The local environment was executing Gradle using an old system-wide Java 8 installation. *Fix:* Hardcoded `org.gradle.java.home` in `gradle.properties` to securely point to the bundled Android Studio JDK 17 (`jbr`).
- **Device Resource Unlocking:** Overrode a corrupted Gradle Cache loop by manually killing the daemon (`./gradlew --stop`) and clearing the `transforms-*` cache to ensure a clean NDK compile.

---

## 🔮 What Needs To Be Built Next (Roadmap)
1. **Finish the Android Build:** Wait for the massive 10-minute NDK C++ compiler to finish its first run (`BUILD SUCCESSFUL`), and install it onto the emulator.
2. **Native Floating Bubble (SYSTEM_ALERT_WINDOW):** Write a tiny piece of custom Java/Kotlin code that draws a floating icon over WhatsApp natively. (Since the 7-year-old `react-native-floating-bubble` package cannot be used with React Native 0.84+).
3. **Headless JS Background Task:** Hook up `react-native-background-actions` so the Clipboard listener runs perfectly even when the AI Keyboard App is completely closed and swiped away!
