# 🤖 AI Keyboard Assistant

An AI-powered mobile application designed to help you respond to messages quickly and contextually. It works as a smart companion for messaging apps like WhatsApp, Telegram, and SMS.

## 🌟 Key Features

- ✅ **Smart Reply Suggestions**: Generates 3 contextual response options (Casual, Professional, Brief).
- ✅ **Dual-Model Support**:
  - **Gemini 2.5 Flash (Default)**: Free, fast, and high-quality responses using Google's AI.
  - **Claude 3.5 Sonnet (Future)**: Support for Anthropic's Claude for pro-level conversational quality.
- ✅ **Multi-Tone Support**: Toggle between Friendly, Formal, and Direct responses.
- ✅ **Multi-Language**: Intelligent support for English, Hindi, and Hinglish.
- ✅ **Privacy First**: Zero message storage on our servers (only passed to AI in real-time).

## 🏗️ Tech Stack

- **Frontend**: React Native (Android/iOS)
- **Backend**: Node.js & Express.js
- **State Management**: Zustand
- **UI Framework**: React Native Paper (Material Design)
- **AI Integration**: Google Gemini REST API & Anthropic SDK

## 🚀 Current Project Status

| Module | Status | Details |
|--------|--------|---------|
| **Backend API** | ✅ Ready | Express server with Gemini integration and rate limiting. |
| **FREE Tier (Gemini)** | ✅ Working | Zero-cost AI suggestions using my 2.5-flash setup. |
| **Android App** | 🚧 Beta | Basic UI for message input and suggestion display. |
| **iOS App** | ⏳ Planned | Code exists but testing is pending. |
| **Claude Integration**| ⏳ Planned | Code exists, switching requires a paid API key. |

## 🛠️ How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install
# Update .env with your GEMINI_API_KEY
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npx react-native start
# Press 'a' for Android or 'i' for iOS
```

## 🛣️ Roadmap

- [ ] **Dark Mode Implementation**: High priority UI update.
- [ ] **Voice-to-Text**: Respond to messages using your voice.
- [ ] **Conversation History**: Save your favorite generated responses locally.
- [ ] **Direct Keyboard Integration**: Making the assistant accessible directly from your Android keyboard.
- [ ] **Claude AI Upgrade**: Improved tone accuracy and reasoning for Pro users.

