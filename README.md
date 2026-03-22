# 🤖 AI Keyboard Assistant — Backend API

A Node.js/Express backend that generates smart reply suggestions using **Google Gemini AI**. This is the server-side engine for a planned React Native mobile app.

## 🌟 Features

- ✅ **AI-Powered Reply Suggestions** — Generates 3 contextual reply options for any incoming message
- ✅ **Multi-Tone Responses** — Casual, Professional, and Brief suggestions
- ✅ **Multi-Language** — English, Hindi, and Hinglish support
- ✅ **Free AI** — Uses Google Gemini 2.5 Flash (completely free, no credit card needed)
- ✅ **Rate Limiting & Security** — Helmet, CORS, and per-user daily usage limits
- ✅ **Privacy First** — Zero message storage, messages are only passed to AI in real-time

## 🏗️ Architecture

```
Client (curl / Mobile App / Frontend)
          │ HTTPS
          ▼
┌─────────────────────┐
│  Express.js API     │
│  (Node.js Backend)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Google Gemini API   │
│  (gemini-2.5-flash)  │
└─────────────────────┘
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js & Express.js | REST API server |
| Google Gemini 2.5 Flash | AI response generation (FREE) |
| Helmet.js | Security headers |
| express-rate-limit | Rate limiting |
| dotenv | Environment variable management |
| nodemon | Development auto-restart |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
cd backend
npm install
```

Create a `.env` file (or copy from `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
FREE_TIER_DAILY_LIMIT=20
```

### Run

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### Test

```bash
curl -s -X POST http://localhost:3000/api/suggest/test -H "Content-Type: application/json" -d "{\"message\": \"Hey! How are you?\"}"
```

## 📖 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/suggest` | Generate AI reply suggestions |
| POST | `/api/suggest/test` | Test endpoint (no rate limiting) |
| GET | `/api/suggest/usage/:userId` | Check user's daily usage |

### Example Response

```json
{
  "success": true,
  "suggestions": [
    { "text": "Hey! I'm doing great, thanks for asking!", "tone": "casual", "label": "Friendly" },
    { "text": "I'm well, thank you. How about yourself?", "tone": "professional", "label": "Polite" },
    { "text": "Good, thanks! You?", "tone": "brief", "label": "Short" }
  ]
}
```

## 🔮 Future Plans

- [ ] **React Native Mobile App** — Android & iOS frontend with message input UI
- [ ] **Claude AI Integration** — Premium tier using Anthropic's Claude for higher quality
- [ ] **Dark Mode** — UI theming support
- [ ] **Voice-to-Text** — Respond using voice input
- [ ] **Direct Keyboard Integration** — Access suggestions directly from your Android keyboard
- [ ] **Conversation History** — Save favorite responses locally
