# 🤖 AI Keyboard Assistant

A smart AI-powered reply suggestion tool that generates contextual responses for any incoming message. Built with **Node.js/Express** backend and a **web demo UI**, powered by **Google Gemini AI** (completely free).

## 🌟 Features

- ✅ **4 Smart Reply Tones** — Casual, Professional, Brief, and Quick (1-3 word) replies
- ✅ **Multi-Language Detection** — Automatically detects English, Hindi, and Hinglish (Roman Hindi) and replies in the same language
- ✅ **Human-like Responses** — No robotic replies, writes like a real person texting
- ✅ **Web Demo UI** — Beautiful dark-themed interface to test the API live
- ✅ **Free AI** — Uses Google Gemini 2.5 Flash-Lite (free tier, no credit card)
- ✅ **Smart Rate Limiting** — Response caching, retry with backoff, cooldown protection
- ✅ **Privacy First** — Zero message storage, processed in real-time only

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
Browser (Web Demo)
       │
       ▼
┌───────────────────────┐      ┌────────────────────┐
│  Express.js Backend   │ ──►  │  Google Gemini AI   │
│  • API routes         │      │  (2.5-flash-lite)   │
│  • Rate limiting      │ ◄──  │  FREE tier          │
│  • Response cache     │      └────────────────────┘
│  • Language detection │
└───────────────────────┘
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js & Express.js | REST API server |
| Google Gemini 2.5 Flash-Lite | AI response generation (FREE) |
| Vanilla HTML/CSS/JS | Web demo frontend |
| Helmet.js + CORS | Security |
| express-rate-limit | Rate limiting |

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
| **Response Cache** | Same message = instant response from cache (5 min TTL) |
| **Retry + Backoff** | Auto-retries on 429 errors (2s → 4s → 8s) |
| **Frontend Cooldown** | 3-second gap enforced between requests |
| **Daily Usage Limit** | Configurable per-user daily limit |

## 🔮 Future Plans

- [ ] **React Native Mobile App** — Android & iOS frontend
- [ ] **Claude AI Integration** — Premium tier with Anthropic's Claude
- [ ] **Direct Keyboard Integration** — Access from Android keyboard
- [ ] **Voice-to-Text** — Reply using voice input
- [ ] **Conversation History** — Save favorite responses locally
