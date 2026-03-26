# AI Keyboard Assistant - Development Journal & Architecture
*Last Updated: March 26, 2026*

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
**Status:** ✅ App UI Fully Working | 🚧 Floating Bubble In Development

**Architecture & Framework:**
- **Framework:** Bare React Native (Not Expo Go) initialized via `@react-native-community/cli`. This allows deep integration with Android OS Permissions (Clipboard reading, Background Services, Floating Windows) which restricted environments like Expo block.

### ✅ Working Features (Pushed to GitHub)
- **UI File (`App.tsx`):** Hand-coded a beautiful React Native Dashboard supporting:
  - **Incognito Mode:** A privacy switch that strictly disables clipboard parsing.
  - **Auto-Clipboard Listener:** Checks OS Clipboard every 1.5 seconds. If new text is copied from an app like WhatsApp, it captures it for processing.
  - **Security Status Dashboard:** Live blocked count, auto-clear status, and privacy mode indicator.
  - **Password/Secret Detection:** Auto-blocks API keys (`sk-`, `ghp_`, `AIza`, `Bearer`, `eyJ`), tokens, and password-like strings from being sent to the AI.
  - **Auto-Clear Clipboard:** Automatically wipes the clipboard 10 seconds after the user copies a smart reply.
  - **Permission Modal:** First-launch privacy consent modal with clear promises (zero storage, no keylogging).
  - **Smart Reply Cards:** Tap any AI suggestion → copied to clipboard instantly with toast notification.
  - **Animated UI:** Fade-in, slide-up, pulse animations using React Native's `Animated` API.

### 🚧 In Development (Code Written, Debugging)
**Complex Custom Native Android Modules (`com.aikeyboardmobile`):**
- **Floating Chat Head Service (`FloatingBubbleService.kt`):** A custom Foreground Service that draws a persistent `⌨️` bubble over ANY app (via `SYSTEM_ALERT_WINDOW`). Features a full input panel with EditText, Paste button, Generate button, and reply cards — all rendered as native Android Views programmatically.
- **Clipboard Grabber (`ClipboardGrabberActivity.kt`):** An invisible 1×1 pixel Activity that briefly gains foreground focus to legally read the clipboard on Android 10+ (bypassing background clipboard restrictions).
- **Native Bridge (`FloatingBubbleModule.kt`):** Exposes Kotlin overlay permission checks and service start/stop commands directly to the React Native JS thread for seamless setting toggles.
- **Chat Accessibility Service (`ChatAccessibilityService.kt`):** Detects which app is in the foreground (WhatsApp, Telegram, Instagram, etc.) and broadcasts state changes to auto-show/hide the floating bubble. Currently not wired to the bubble service.

---

## 🔮 What Needs To Be Built Next (Roadmap)
1. **Fix Floating Bubble:** Debug the overlay service to work reliably on emulator and physical devices.
2. **Wire Accessibility Service:** Connect `ChatAccessibilityService` → `FloatingBubbleService` so the bubble auto-shows only in chat apps.
3. **Claude AI Integration**: Setup paid-tier fallback to Claude using Anthropic API.
4. **Settings Configurations**: Local preferences for auto-clear delay times and chat-head themes.
5. **Favorites Manager**: Save top replies locally via AsyncStorage.
