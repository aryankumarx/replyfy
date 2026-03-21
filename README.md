# AI Keyboard Assistant

An AI-powered mobile app that helps you respond to messages quickly and contextually using Claude AI. Works with WhatsApp, Telegram, SMS, and any messaging app!

## 🌟 Features

- ✅ **AI-Powered Suggestions**: Get 3 contextually relevant response options
- ✅ **Multi-Tone Support**: Casual, Professional, and Brief responses
- ✅ **Multi-Language**: Supports English, Hindi, and Hinglish
- ✅ **Privacy-First**: Zero message storage, encrypted API calls
- ✅ **Fast**: Sub-2-second response time
- ✅ **Usage Tracking**: Free tier (20/day), Pro tier (unlimited)

## 📱 Screenshots

[Add screenshots of your app here]

## 🏗️ Architecture

```
┌─────────────────┐
│  React Native   │
│   Mobile App    │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Express.js API │
│    (Node.js)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Claude API     │
│  (Anthropic)    │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- React Native development environment setup
- Android Studio (for Android) or Xcode (for iOS)
- Claude API key from Anthropic

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Add your Claude API key**
   Edit `.env` and add:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **For Android:**
   ```bash
   npx react-native run-android
   ```

4. **For iOS:**
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

## 🔑 Getting Your Claude API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into your `.env` file

**Cost:** ~$0.05 per user per month with typical usage

## 📖 API Documentation

### POST `/api/suggest`

Generate AI response suggestions

**Request:**
```json
{
  "message": "Hey! Are you free for dinner tomorrow?",
  "userId": "user123",
  "userTier": "free",
  "contextMessages": []
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": [
    {
      "text": "I'd love to! What time works for you?",
      "tone": "casual",
      "label": "Friendly & warm"
    },
    {
      "text": "That sounds great! I'm available after 7 PM.",
      "tone": "professional",
      "label": "Polite & formal"
    },
    {
      "text": "Yes! Let me know the details.",
      "tone": "brief",
      "label": "Short & direct"
    }
  ],
  "usage": {
    "used": 1,
    "limit": 20,
    "remaining": 19
  }
}
```

### GET `/api/suggest/usage/:userId`

Check user's daily usage

**Response:**
```json
{
  "userId": "user123",
  "tier": "free",
  "usage": {
    "used": 5,
    "limit": 20,
    "remaining": 15,
    "resetTime": 1640995200000
  }
}
```

## 🧪 Testing

### Test Backend API

```bash
cd backend
npm run dev
```

Then in another terminal:

```bash
curl -X POST http://localhost:3000/api/suggest/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Test Frontend

```bash
cd frontend
npm start
```

Then press `a` for Android or `i` for iOS

## 🌐 Deployment

### Backend (Vercel)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd backend
   vercel
   ```

3. Add environment variables in Vercel dashboard

### Frontend (Google Play Store)

1. **Build APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Upload to Google Play Console**

## 🔒 Security Features

- ✅ End-to-end encryption for API calls
- ✅ No message storage on servers
- ✅ Rate limiting to prevent abuse
- ✅ Helmet.js for Express security headers
- ✅ CORS protection
- ✅ Input validation and sanitization

## 💰 Pricing Model

| Feature | Free | Pro |
|---------|------|-----|
| Daily Suggestions | 20 | Unlimited |
| Response Time | <2s | <1s (Priority) |
| Custom Tones | ❌ | ✅ |
| Ads | Yes | No |
| **Price** | **Free** | **$3.99/month** |

## 🛣️ Roadmap

### Phase 1 (MVP) ✅
- [x] Basic suggestion generation
- [x] Multi-language support
- [x] Usage tracking
- [x] Mobile app (Android)

### Phase 2 (Next 3 months)
- [ ] iOS app
- [ ] Custom tone preferences
- [ ] Conversation history
- [ ] Voice input support
- [ ] Smart templates

### Phase 3 (6 months)
- [ ] Team/Business plans
- [ ] Browser extension
- [ ] API for third parties
- [ ] Advanced analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own projects!

## 🐛 Known Issues

- Dark mode not yet implemented
- iOS version pending
- Limited to 1000 characters per message

## 📞 Support

- Email: support@example.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/ai-keyboard-assistant/issues)

## 🙏 Acknowledgments

- Built with [Claude API](https://www.anthropic.com/claude) by Anthropic
- UI components from [React Native Paper](https://reactnativepaper.com/)
- Icon design inspired by Material Design

---

Made with ❤️ for better conversations
