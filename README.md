<div align="center">
  
# Replyfy - v1.3.0
*Never type another boring reply again*

[![Live API](https://img.shields.io/badge/Live-API-blue)](https://replyfy.onrender.com) 
[![Download APK](https://img.shields.io/badge/Download-APK-brightgreen)](https://github.com/aryankumarx/replyfy/releases)

</div>

## 📸 See It In Action

*Seamless floating interface over WhatsApp, Telegram, and SMS*

| Active Chat Environment | Context-Aware Bubble | Instant AI Generation |
|-------------------------|---------------------|----------------------|
| ![Chat UI](docs/demo-chat.jpeg) <br> <small>*Reading messages*</small> | ![Floating Bubble](docs/demo-bubble.jpeg) <br> <small>*Hit Bubble*</small> | ![Smart Reply](docs/demo-generate.jpeg) <br> <small>*4 instant suggestions*</small> |

---



## Overview

Replyfy is a native Android floating bubble that generates contextual AI responses for chat applications. Built with Google Gemini 2.5 Flash and a custom Node.js Express backend, it overlays WhatsApp, Telegram, and SMS to provide instant reply suggestions without app switching.

---

## Version History

| Version | Date | Size | Key Changes |
|---------|------|------|-------------|
| **v1.3.0** | Apr 2026 | 46MB | Migrated to robust Gemini 2.5 Flash Lite, exponential backoff anti-crash, security hardening |
| **v1.2.0 Beta** | Apr 2026 | 25MB | Added 6 Diverse AI Tones, Major UI Revamp |
| **v1.1.0 Beta** | Apr 2026 | 25MB | ProGuard compression, ClipboardGrabberActivity, security hardening |
| v1.0.0 | Mar 2026 | 104MB | Initial stable release |

**Latest:** [v1.3.0 APK (46MB)](https://github.com/aryankumarx/replyfy/releases/latest/download/app-release.apk)

---

## What's New in v1.3.0

- **Gemini 2.5 Flash-Lite Migration** - Re-engineered backend to use the newest, fastest, and most quota-generous Google AI model, bypassing legacy rate-limit crashes.
- **DDoS/Quota Exponential Backoff** - System gracefully sleeps and automatically recovers spanning a 124-second window if free-tier limits are ever reached, practically eliminating crashes.
- **Security Hardening** - Completely isolated Android API keys inside a gitignored `secrets.properties` injected securely via Gradle BuildConfig, completely eliminating API token scraping risks on GitHub.
- **Smaller Footprint** - APK is now stripped down further to ~23MB.

## Previous Highlights (v1.2.0)
- **Separated User Dashboards** - The mobile app features decoupled, aesthetic dashboards (Home, Tone, and Settings).
- **Tone Selection on Bubble** - The floating bubble overlay natively integrates smart tone selection.
- **6 Unique Smart Tones** - Generate replies spanning Gen Z, Sarcastic, Sweet, Professional, Decline, and Quick styles.
- **UI & Visual Overhaul** - Stunning glassmorphism UI with custom color-coded badges matching every tone profile.

---

## Features

### Floating Architecture
- Context-aware activation via AccessibilityService (only appears in chat apps)
- Auto-generates replies when clipboard text detected during typing
- Instant paste execution without leaving conversation

### Privacy & Security
- Regex blocks sensitive data (passwords, `sk-` API keys, `ghp-` tokens, JWTs)
- Zero-storage backend proxy - no databases, no logging
- 10 requests/minute IP rate limiting with Helmet.js headers
- Automatic clipboard clearing after 10 seconds

### Language & Tone Support
| Tone | Style | Availability |
|------|--------|-----------|
| **Gen Z** | Trendy, emojis, abbreviations | English, Hinglish |
| **Sarcastic** | Witty, playful, dry humor | English, Hinglish |
| **Sweet** | Empathetic, warm, polite | English, Hindi |
| **Professional** | Formal, respectful, concise | English, Hindi |
| **Decline** | Polite refusal, setting boundaries | English, Hindi |
| **Quick** | 1-3 words, rapid response | All |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React Native 0.73 + Kotlin Native Modules |
| **Backend** | Node.js 18+ + Express.js |
| **AI Engine** | Google Gemini 2.5 Flash-Lite |
| **Native** | Kotlin (`WindowManager`, `AccessibilityService`) |
| **Security** | Helmet.js, express-rate-limit, express-validator |
| **Deployment** | Render.com |

---


## Installation

### Prerequisites
- Android Studio (API 34+ SDK)
- Node.js 18+
- [Free Gemini API key](https://aistudio.google.com/)

### Backend Setup
```bash
git clone https://github.com/aryankumarx/replyfy.git
cd replyfy/backend
npm install
cp .env.example .env
# Edit .env: add GEMINI_API_KEY=your_key_here
npm run dev
```

### Android Development
```bash
cd replyfy/AIKeyboardMobile
npm install
# Create android/local.properties:
# API_URL=https://your-render-url.onrender.com
# API_KEY=your-secret-key
npx react-native run-android
```

### Build Release APK
```bash
cd replyfy/AIKeyboardMobile/android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

---

## Known Issues

- First API request: 2-3 seconds (Render.com cold start)
- Background monitoring requires app running in foreground
- Android 10+ clipboard restrictions bypassed via foreground service

---

## Roadmap

### V1.4.0 (Next)
- Background clipboard service (true background operation)
- Voice-to-text input integration
- Custom tone builder
- Conversation history & favorites

### V2.0.0 (Future)
- Claude AI integration (premium)
- Browser extension

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m "Add YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open Pull Request


---
## Support

- [Documentation](README.md)
- [Discussions](https://github.com/aryankumarx/replyfy/discussions)
- [Bug Reports](https://github.com/aryankumarx/replyfy/issues)
- Email: aryanvoid505@gmail.com



## License

[MIT License](LICENSE) - Free to use, modify, and distribute.

---

<div align="center">

**Made With ❤️ by Aryan Kumar**

<a href="https://github.com/aryankumarx"><img src="https://img.shields.io/badge/GitHub-Follow-blue?logo=github" alt="Follow on GitHub"></a>
</div>