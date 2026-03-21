# 🎯 Getting Started

**Welcome to AI Keyboard Assistant!** This guide will get you up and running in 30 minutes.

## ⚡ Quick Start (Choose Your Path)

### Path 1: Complete Beginner (Recommended)
**"I'm new to coding and want step-by-step instructions"**

👉 Read: [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md)

This guide walks you through:
- Installing all required software
- Getting your Claude API key
- Setting up the backend
- Running the mobile app
- Testing everything

---

### Path 2: Experienced Developer
**"I know React Native and Node.js, just show me the commands"**

#### Backend:
```bash
cd backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm start
# In another terminal:
npx react-native run-android
```

Done! ✅

---

### Path 3: Automated Setup
**"I want a script to do it for me"**

#### Mac/Linux:
```bash
chmod +x quickstart.sh
./quickstart.sh
```

#### Windows:
```bash
quickstart.bat
```

The script will:
- Check prerequisites
- Ask for your Claude API key
- Install all dependencies
- Start the backend
- Guide you through frontend setup

---

## 📚 Documentation Structure

```
docs/
├── SETUP_GUIDE.md        # Detailed beginner setup (START HERE if new)
├── DEPLOYMENT.md         # How to deploy to production
├── PROJECT_STRUCTURE.md  # How the code is organized
└── FAQ.md               # Common questions & answers
```

**Where to go next:**
- Want to understand the codebase? → `PROJECT_STRUCTURE.md`
- Ready to launch? → `DEPLOYMENT.md`
- Have questions? → `FAQ.md`

---

## 🎬 What You're Building

An AI-powered mobile app that helps you respond to messages in WhatsApp, Telegram, and other chat apps using Claude AI.

**Key Features:**
- 🤖 3 AI-generated response suggestions
- 🌍 Supports English, Hindi, and Hinglish
- ⚡ Sub-2-second response time
- 🔒 Privacy-first (zero message storage)
- 📊 Usage tracking (20/day free, unlimited Pro)

**Tech Stack:**
- Backend: Node.js + Express + Claude API
- Frontend: React Native
- State: Zustand
- UI: React Native Paper

---

## 🔑 Prerequisites

Before you start, make sure you have:

✅ **Node.js 18+** - [Download](https://nodejs.org/)  
✅ **npm or yarn** - Comes with Node.js  
✅ **Android Studio** - [Download](https://developer.android.com/studio)  
✅ **Claude API Key** - [Get one](https://console.anthropic.com/) (Free $5 credit)  
✅ **30-45 minutes** of time  

**Optional but helpful:**
- Git - For version control
- VS Code - For code editing
- Physical Android device - For testing

---

## 🚀 Your First Run

After setup, here's what to do:

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```
   ✅ You should see: "AI Keyboard API running on port 3000"

2. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/api/suggest/test
   ```
   ✅ You should get JSON with suggestions

3. **Start the mobile app:**
   ```bash
   cd frontend
   npm start
   # In another terminal:
   npx react-native run-android
   ```
   ✅ App launches on your device/emulator

4. **Try it out:**
   - Tap an example message
   - Click "Get AI Suggestions"
   - See 3 AI-generated responses
   - Tap to copy any suggestion

---

## 💡 Common First-Time Issues

### Issue: "ANTHROPIC_API_KEY is not set"
**Fix:** 
1. Make sure `.env` file exists in `backend/` folder
2. Check that you added your API key correctly
3. Restart the backend server

### Issue: "Unable to connect to development server"
**Fix:**
1. Check backend is running (`http://localhost:3000/health` should work)
2. Update `API_URL` in `frontend/src/services/api.service.js`
3. For emulator: Use `http://10.0.2.2:3000/api`
4. For real device: Use `http://YOUR_COMPUTER_IP:3000/api`

### Issue: "Module not found"
**Fix:**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Issue: Android build fails
**Fix:**
```bash
cd frontend/android
./gradlew clean
cd ../..
npx react-native start --reset-cache
```

---

## 🎯 Next Steps After Setup

### Level 1: Customize the App
- Change the app name
- Update colors and branding
- Modify suggestion prompts
- Add your own examples

**Where:** See `PROJECT_STRUCTURE.md` for file locations

### Level 2: Add Features
- Custom tone preferences
- Voice input
- Conversation history
- Smart templates

**Where:** See `PROJECT_STRUCTURE.md` → "Adding New Features"

### Level 3: Deploy to Production
- Deploy backend to Vercel/Railway
- Build release APK
- Publish to Google Play Store
- Add payment system

**Where:** See `DEPLOYMENT.md`

---

## 📊 Project Timeline

**Week 1:** Setup + Basic Customization
- Day 1-2: Get everything running
- Day 3-4: Customize branding
- Day 5-7: Test with real messages

**Week 2-4:** Add Features + Testing
- Add 2-3 new features
- Test with 10-20 beta users
- Fix bugs based on feedback

**Week 5-8:** Prepare for Launch
- Deploy backend
- Build release APK
- Create Play Store listing
- Soft launch to friends

**Month 3+:** Public Launch + Growth
- Launch on ProductHunt
- Market on social media
- Iterate based on user feedback
- Plan next features

---

## 💰 Monetization Strategy

**Free Tier:**
- 20 suggestions per day
- All basic features
- Supported by ads (optional)

**Pro Tier ($3.99/month):**
- Unlimited suggestions
- Priority support
- Custom tone preferences
- No ads

**Revenue Projection:**
- 1,000 users × 10% conversion = 100 Pro users
- 100 × $3.99 = **$399/month revenue**
- API costs: ~$70/month
- **Profit: ~$329/month**

---

## 🤝 Getting Help

**Stuck on setup?**
1. Check `FAQ.md` for common issues
2. Read the detailed `SETUP_GUIDE.md`
3. Create a GitHub issue
4. Email: support@example.com

**Want to contribute?**
1. Fork the repository
2. Read `PROJECT_STRUCTURE.md`
3. Pick an issue
4. Submit a pull request

**Have questions about features?**
- Check `FAQ.md`
- Create a feature request issue
- Join our community (Discord coming soon)

---

## 📖 Recommended Reading Order

1. **This file** (You are here!) ✅
2. `docs/SETUP_GUIDE.md` - If you're new to development
3. `docs/PROJECT_STRUCTURE.md` - To understand the codebase
4. `docs/FAQ.md` - For common questions
5. `docs/DEPLOYMENT.md` - When ready to launch

---

## 🎉 Success Criteria

You'll know you're ready to move forward when:

✅ Backend starts without errors  
✅ Frontend app launches on your device  
✅ You can generate AI suggestions  
✅ Suggestions copy to clipboard  
✅ You understand the basic file structure  

---

## 🚦 Current Status

**What's Complete:**
- ✅ Backend API with Claude integration
- ✅ React Native mobile app
- ✅ Usage tracking
- ✅ Multi-language support (English/Hindi/Hinglish)
- ✅ Three tone options

**Coming Soon (Phase 2):**
- 🚧 iOS app
- 🚧 Custom tone preferences
- 🚧 Voice input
- 🚧 Conversation history

**Future (Phase 3):**
- 📅 Team/Business features
- 📅 Browser extension
- 📅 API for third parties

---

## 🎁 Bonus Resources

**Design Assets:** (Add later)
- App icon templates
- Screenshot templates
- Marketing materials

**Video Tutorials:** (Add later)
- Setup walkthrough
- Feature demonstrations
- Deployment guide

**Community:**
- GitHub Discussions
- Discord server (coming soon)
- Twitter: @aikeyboard (coming soon)

---

**Ready to start?**

👉 **New to development?** Go to [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md)

👉 **Experienced developer?** Run the commands in "Path 2" above

👉 **Want automation?** Use `./quickstart.sh` or `quickstart.bat`

---

**Good luck building your AI Keyboard Assistant!** 🚀

Questions? Open an issue or check the FAQ!
