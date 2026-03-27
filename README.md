# 🤖 AI Keyboard Assistant

*Never struggle with replies again. An AI-powered keyboard assistant that generates smart, contextual responses for your messages in seconds.*

**[🌐 Live Demo](https://ai-keyboard-assistant.onrender.com)** • **[📱 Download APK](#)** • **[📖 Documentation](docs/)** • **[🤝 Contributing](#-contributing)**

</div>

---

## 💡 Why AI Keyboard Assistant?

In today's fast-paced digital world, we're constantly bombarded with messages across WhatsApp, Telegram, SMS, and more. **AI Keyboard Assistant** is your personal AI writing companion that:

- **⚡ Responds 10x faster** - Generate perfect replies in under 2 seconds
- **🌍 Speaks your language** - Native support for English, Hindi, and Hinglish
- **🔒 Respects your privacy** - Zero message storage, end-to-end encryption
- **🎯 Understands context** - AI adapts tone based on your conversation
- **📱 Works everywhere** - Floating bubble overlay for seamless multitasking

Whether you're a busy professional managing work chats, a student juggling group conversations, or anyone who values their time, this assistant helps you communicate smarter, not harder.

---

## 📸 See It In Action

*Showcasing the seamless floating interface directly above WhatsApp, Telegram, etc.*

| Active Chat Environment | Context-Aware Bubble | Instant AI Generation |
| :---: | :---: | :---: |
| <img src="docs/demo-chat.jpeg" width="250" alt="Chat UI"> <br> *Reading messages* | <img src="docs/demo-bubble.jpeg" width="250" alt="Floating Bubble"> <br> *Bubble appears on copy* | <img src="docs/demo-generate.jpeg" width="250" alt="Smart Reply"> <br> *Instant context replies* |

---

## ✨ Key Features

### 🎨 Four Smart Reply Tones
Choose the perfect response style for any situation:
* **🌟 Casual** - Friendly and conversational for friends and family
* **👔 Professional** - Polished responses for work communications
* **⚡ Brief** - Quick, concise replies when you're in a hurry
* **💬 Quick** - Ultra-short 1-3 word responses

### 🌐 Multilingual Intelligence
Automatically detects and responds in:
* **🇬🇧 English** - Natural, native-sounding responses
* **🇮🇳 Hindi** - Full Devanagari script support
* **🔤 Hinglish** - Roman Hindi with an 80+ word dictionary for perfect code-mixing

### 🫧 Floating Chat Head
Native Android overlay bubble (like Facebook Messenger) that:
* **Works over any app** - WhatsApp, Telegram, SMS, and more
* **No app switching needed** - Generate replies without leaving your conversation
* **Context Aware** - Dynamically appears only when you copy text within Chat Apps
* **Draggable and dismissible** - Position it wherever you like

### 🛡️ Privacy-First Architecture
Built with security as the foundation:
* **Zero message storage** - Nothing is saved to databases
* **API key authentication** - Enterprise-grade access control
* **Auto-clear clipboard** - Wipes sensitive data after 10 seconds
* **Incognito mode** - Instantly disable all background monitoring
* **XSS protection** - Complete input sanitization and validation
* **Password detection** - Automatically blocks sensitive data from being sent to the AI

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    React Native Android App                     │
│  • Real-time clipboard monitoring  • Floating chat head overlay │
│  • Security dashboard             • Incognito mode              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS (TLS 1.3)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Express.js Backend (Render.com)               │
│  • API key authentication         • Rate limiting (10 req/min)  │
│  • Input sanitization (XSS)       • Response caching (5 min)    │
│  • Password/token detection       • Exponential backoff         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Gemini AI API   │
                    │ (2.5 Flash-Lite) │
                    └──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
* Node.js 18+
* Android Studio (for mobile development)
* Gemini API key ([Get one free](https://aistudio.google.com/))

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/aryankumarx/ai-keyboard-assistant.git
cd ai-keyboard-assistant/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start development server
npm run dev
```
*The API will be running at `http://localhost:3000`*

### Mobile App Setup
```bash
# Navigate to mobile directory
cd ../AIKeyboardMobile

# Install dependencies
npm install

# Run on Android device/emulator
npx react-native run-android
```
> **Note:** Ensure Metro bundler is running via `npm start` in a separate terminal.

---

## 📁 Project Structure

```text
ai-keyboard-assistant/
│
├── backend/                           # Node.js Express API
│   ├── src/
│   │   ├── server.js                  # Main Express app
│   │   ├── routes/suggest.js          # API endpoints with auth
│   │   └── services/gemini.service.js # AI integration layer
│   └── .env                           # Environment variables
│
├── frontend/                          # Web demo interface
│   └── index.html                     # Glassmorphic UI
│
├── AIKeyboardMobile/                  # React Native app
│   ├── App.tsx                        # Main app component
│   └── android/                       # Native Android code
│       └── app/src/main/java/com/aikeyboardmobile/
│           ├── FloatingBubbleService.kt      # Overlay UI & API execution
│           ├── FloatingBubbleModule.kt       # Native bridge
│           ├── ClipboardGrabberActivity.kt   # Stealth clipboard reader
│           └── ChatAccessibilityService.kt   # Dynamic context awareness
│
└── docs/                              # Documentation
```

---

## 🛡️ Security Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Zero Storage** | All processing in-memory | No data leaks or breaches possible |
| **API Key Auth** | `x-api-key` header validation | Zero-trust access control |
| **Input Sanitization** | `express-validator` integration | Prevents XSS attacks |
| **Rate Limiting** | 10 requests/minute per IP | Deep DDoS protection |
| **Auto-Clear** | 10-second timer on clipboard | Prevents accidental data exposure |
| **Password Detection** | Regex pattern matching | Blocks sensitive data automatically |
| **Incognito Mode** | Hardware-level privacy switch | Complete control over monitoring |
| **Helmet.js CSP** | Content Security Policy headers | Prevents remote code injection |

---

## 🎯 Use Cases

**For Professionals**
* Quick, polished responses to client messages
* Maintain professional tone across all communications
* Save hours on email and chat responses

**For Students**
* Manage group project conversations efficiently
* Quick replies during busy study sessions
* Bilingual communication made easy

**For Everyone**
* Never leave someone on "seen" again
* Reduce decision fatigue from constant messaging
* Better work-life balance with faster communication

---

## 🗺️ Roadmap

**✅ Completed**
- [x] React Native mobile app with security dashboard
- [x] Backend API with enterprise-grade security
- [x] Multi-language support (English, Hindi, Hinglish)
- [x] Floating chat head overlay (Context-Aware)
- [x] Auto-clear clipboard and incognito mode
- [x] Web demo interface

**🚧 In Progress**
- [ ] Conversation history and local favorites wrapper
- [ ] Voice-to-text integration

**📅 Planned**
- [ ] iOS version platform support
- [ ] Claude AI integration (premium tier)
- [ ] Custom tone builder
- [ ] Team/business network features
- [ ] Browser extension

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

*See `CONTRIBUTING.md` for detailed guidelines.*

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments
* Google Gemini AI for the powerful free AI API
* React Native community for excellent mobile framework
* Express.js for the robust backend foundation
* All contributors who help make this project better

---
<div align="center">
⭐ Star this repo if you find it helpful!<br>
Made with 💜 by Aryan Kumar<br><br>
Report Bug • Request Feature • Give Feedback
</div>
