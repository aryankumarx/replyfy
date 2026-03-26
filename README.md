# 🤖 AI Keyboard Assistant

A full-stack, AI-powered smart reply assistant that generates contextual responses for any incoming message. Features a **Node.js/Express** secure backend, a **web demo UI**, and a **React Native Android app** with clipboard listener, incognito mode, security dashboard & floating bubble overlay — all powered by **Google Gemini AI** (completely free).

> 🔗 **Live Demo:** [ai-keyboard-assistant.onrender.com](https://ai-keyboard-assistant.onrender.com)

## 🌟 Features

- ✅ **4 Smart Reply Tones** — Casual, Professional, Brief, and Quick (1-3 word) replies
- ✅ **Multi-Language Detection** — Automatically detects English, Hindi, and Hinglish (Roman Hindi) and replies in the same language
- ✅ **Human-like Responses** — No robotic replies, writes like a real person texting
- ✅ **Web Demo UI** — Beautiful dark-themed interface to test the API live
- ✅ **Free AI** — Uses Google Gemini 2.5 Flash-Lite (free tier, no credit card)
- ✅ **Smart Rate Limiting** — Response caching, retry with backoff, cooldown protection
- ✅ **Privacy First** — Zero message storage, processed in real-time only
- ✅ **Password/Secret Detection** — Auto-blocks sensitive text (API keys, tokens, passwords)
- ✅ **Auto-Clear Clipboard** — Wipes clipboard 10 seconds after copying a reply

## 🖥️ Web Demo

The project includes a sleek web demo at `http://localhost:3000` — just paste a message and get instant reply suggestions.

```
┌──────────────────────────────────────┐
│  ⌨️  AI Keyboard Assistant           │
│                                      │
│  📩 Incoming Message                 │
│  ┌────────────────────────────────┐  │
│  │ kal milte hai bhai             │  │
│  └────────────────────────────────┘  │
│  [⚡ Generate Smart Replies]         │
│                                      │
│  😊 Haan bhai pakka! Kal milte hain  │
│  💼 Zarur milenge kal. Time bata do  │
│  ⚡ Done kal milte hai               │
│  💬 Pakka!                           │
└──────────────────────────────────────┘
```

## 🏗️ Architecture

```
Browser (Web Demo)       React Native App (Android)
       │                        │
       ▼                        ▼
┌─────────────────────────────────────┐     ┌────────────────────┐
│  Express.js Backend (Render.com)    │ ──► │  Google Gemini AI   │
│  • API Key Auth (x-api-key)         │     │  (2.5-flash-lite)   │
│  • Input Sanitization (XSS)         │ ◄── │  FREE tier           │
│  • Rate limiting + Response Cache   │     └────────────────────┘
│  • Hindi/Hinglish Language Detection│
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
ai-keyboard-assistant/
├── backend/                      # Node.js/Express API (deployed on Render)
│   ├── src/
│   │   ├── server.js             # Express app with Helmet, CORS, CSP
│   │   ├── routes/suggest.js     # API key auth + express-validator
│   │   └── services/gemini.service.js  # Gemini AI + cache + language detection
│   └── .env                      # API keys (gitignored)
├── frontend/                     # Web demo (served by backend)
│   └── index.html                # Glassmorphic dark-themed UI
├── AIKeyboardMobile/             # React Native Android app
│   ├── App.tsx                   # Dashboard UI, clipboard listener, incognito mode
│   └── android/
│       └── app/src/main/java/com/aikeyboardmobile/
│           ├── MainActivity.kt           # React Native entry point
│           ├── MainApplication.kt        # App + native module registration
│           ├── FloatingBubbleService.kt  # 🫧 Foreground service (overlay bubble)
│           ├── FloatingBubbleModule.kt   # 🔌 React Native ↔ Kotlin bridge
│           ├── FloatingBubblePackage.kt  # 📦 Native module package registration
│           ├── ClipboardGrabberActivity.kt # 📋 Android 10+ clipboard workaround
│           └── ChatAccessibilityService.kt # 🔗 Chat app detection service
└── DEVELOPMENT_JOURNAL.md        # Full development history & decisions
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js & Express.js | REST API server |
| Google Gemini 2.5 Flash-Lite | AI response generation (FREE) |
| React Native (Bare) | Android mobile app |
| Kotlin | Native Android modules (overlay, clipboard, accessibility) |
| Vanilla HTML/CSS/JS | Web demo frontend |
| express-validator | Input sanitization & XSS prevention |
| Helmet.js + CORS | HTTP security headers |
| express-rate-limit | Rate limiting |
| @react-native-clipboard | Native clipboard access |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup & Run

```bash
cd backend
npm install
```

Create a `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

```bash
npm run dev
```

Open **http://localhost:3000** in your browser 🎉

### Test via curl

```bash
curl -s -X POST http://localhost:3000/api/suggest/test ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Hey! How are you?\"}"
```

## 📖 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Web demo UI |
| POST | `/api/suggest` | Generate AI reply suggestions |
| POST | `/api/suggest/test` | Test endpoint (no rate limiting) |
| GET | `/api/suggest/usage/:userId` | Check daily usage |

### Example Response

```json
{
  "success": true,
  "suggestions": [
    { "text": "Hey! Doing great thanks for asking", "tone": "casual", "label": "Friendly" },
    { "text": "I'm well, thank you. How about yourself?", "tone": "professional", "label": "Polite" },
    { "text": "Good thanks! You?", "tone": "brief", "label": "Short" },
    { "text": "Great!", "tone": "quick", "label": "Quick Reply" }
  ]
}
```

## 🛡️ Security & Protections

| Protection | Details |
|-----------|---------|
| **API Key Auth (`x-api-key`)** | Backend rejects unauthorized/public requests without a secret key |
| **Input Sanitization (XSS)** | `express-validator` strictly escapes inputs & blocks payloads >1000 chars |
| **Sensitive Text Detection** | Blocks passwords, API keys, tokens from being sent to AI |
| **Auto-Clear Clipboard** | Clipboard wiped 10s after copying a reply (configurable) |
| **Response Cache** | Same message = instant response from cache (5 min TTL) |
| **Retry + Backoff** | Auto-retries on 429 errors (2s → 4s → 8s) |
| **Frontend Cooldown** | 3-second gap enforced between requests |
| **Daily Usage Limit** | Configurable per-user daily limit |

## 📱 Mobile App Features

### ✅ Working Features
- 🎨 **Premium Dark Theme Dashboard** — Hand-coded React Native UI with animations, gradient cards, pulse indicators
- 📋 **Clipboard Listener** — Instantly reads copied text when inside the app (configurable toggle)
- 🕵️ **Incognito Mode** — Privacy switch that completely pauses all clipboard tracking
- 🔒 **Password / Secret Detection** — Auto-blocks API keys, tokens, and password-like strings
- 🧹 **Auto-Clear Clipboard** — Wipes clipboard 10 seconds after copying a smart reply
- 🛡️ **Security Status Dashboard** — Live blocked count, auto-clear status, privacy mode indicator
- ⚡ **Smart Reply Generation** — Sends copied text to Gemini AI and displays 4 toned replies
- 🔐 **Privacy Permission Modal** — First-launch consent with clear privacy promises

### 🚧 In Development
- 🫧 **Floating Chat Head Bubble** — Native Android overlay service (code written, currently being debugged for emulator compatibility)
- 🔗 **Accessibility Service Integration** — Auto-show bubble only in chat apps (WhatsApp, Telegram, etc.)

## 🔮 Future Plans

- [x] ~~**React Native Mobile App**~~ — ✅ Built with clipboard listener & incognito mode
- [x] ~~**API Security Hardening**~~ — ✅ API key auth + express-validator
- [x] ~~**Multi-Language Support**~~ — ✅ English, Hindi, Hinglish detection
- [x] ~~**Security Dashboard**~~ — ✅ Blocked count, auto-clear, privacy indicators
- [x] ~~**Password/Secret Detection**~~ — ✅ Auto-blocks sensitive text
- [ ] **Floating Bubble Chat Head** — 🚧 Native Android overlay (in progress)
- [ ] **Claude AI Integration** — Premium tier with Anthropic's Claude
- [ ] **Voice-to-Text** — Reply using voice input
- [ ] **Conversation History** — Save favorite responses locally

## 👨‍💻 Built By

**Aryan Kumar** — Privacy-first • Zero storage • Open source
