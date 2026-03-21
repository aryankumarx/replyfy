# 🎯 QUICK REFERENCE CARD

## 🆓 FREE Option (RECOMMENDED FOR BEGINNERS)

### What to Use: Google Gemini (100% FREE)
- **Cost:** $0/month - Forever!
- **Limits:** 1.5 million requests/month (enough for 1,000+ users)
- **Setup Guide:** `docs/FREE_SETUP_GUIDE.md`
- **Get API Key:** https://aistudio.google.com/app/apikey (No credit card needed!)

### Quick Setup (FREE):
```bash
1. Get Gemini API key (FREE): https://aistudio.google.com/app/apikey
2. cd backend
3. cp package-gemini.json package.json
4. npm install
5. cp .env.example .env
6. Edit .env → add GEMINI_API_KEY
7. Update routes/suggest.js to use gemini.service.js
8. npm run dev
```

---

## 💰 Premium Option (For Scale)

### What to Use: Claude (Paid, Better Quality)
- **Cost:** ~$0.05/user/month
- **Better for:** 10,000+ users, better quality responses
- **Setup Guide:** `docs/SETUP_GUIDE.md`
- **Get API Key:** https://console.anthropic.com/ ($5 free credits)

### Quick Setup (Paid):
```bash
1. Get Claude API key: https://console.anthropic.com/
2. cd backend
3. npm install
4. cp .env.example .env
5. Edit .env → add ANTHROPIC_API_KEY
6. npm run dev
```

---

## 💻 IDE Setup (Pick One)

| IDE | Best For | Download | Guide |
|-----|----------|----------|-------|
| **VS Code** | Most stable, popular | https://code.visualstudio.com/ | `docs/ENVIRONMENT_SETUP.md` |
| **Cursor** | AI-powered coding | https://cursor.sh/ | `docs/ENVIRONMENT_SETUP.md` |
| **Windsurf** | AI assistant | https://codeium.com/windsurf | `docs/ENVIRONMENT_SETUP.md` |

**Recommendation:** Start with VS Code

---

## 📋 Prerequisites Checklist

### Must Have:
- [ ] Node.js 18+ → https://nodejs.org/
- [ ] Android Studio → https://developer.android.com/studio
- [ ] Gemini OR Claude API key (Gemini is FREE!)
- [ ] 30-45 minutes

### Verify Installation:
```bash
node --version   # Should show v18+ or v20+
npm --version    # Should show 9+ or 10+
adb --version    # Should show Android Debug Bridge
```

---

## 🚀 Quick Start Commands

### Backend (Terminal 1):
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add API key
npm run dev
```

### Frontend Metro (Terminal 2):
```bash
cd frontend
npm install
npm start
```

### Frontend Run (Terminal 3):
```bash
cd frontend
npx react-native run-android
```

---

## 📂 Project Structure

```
ai-keyboard-assistant/
├── START_HERE.md              ← Read this first!
├── docs/
│   ├── FREE_SETUP_GUIDE.md   ← 🆓 Use Gemini (FREE!)
│   ├── ENVIRONMENT_SETUP.md   ← Install IDEs & tools
│   ├── SETUP_GUIDE.md         ← Use Claude (paid)
│   └── FAQ.md                 ← Common questions
├── backend/                   ← Node.js API
│   ├── src/services/
│   │   ├── gemini.service.js ← FREE option
│   │   └── claude.service.js ← Paid option
│   └── package-gemini.json   ← FREE dependencies
└── frontend/                  ← React Native app
```

---

## 🆘 Common Issues & Fixes

### Backend won't start
```bash
# Check if port 3000 is free
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows

# Verify .env file exists
ls backend/.env

# Check Node version
node --version  # Must be 18+
```

### Frontend can't connect
```javascript
// For Android Emulator (in api.service.js)
const API_URL = 'http://10.0.2.2:3000/api';

// For Real Device (find your IP first)
// Windows: ipconfig
// Mac/Linux: ifconfig
const API_URL = 'http://YOUR_IP:3000/api';
```

### Build fails
```bash
cd frontend/android
./gradlew clean
cd ../..
npx react-native start --reset-cache
npx react-native run-android
```

---

## 💰 Cost Comparison

### FREE Gemini (Year 1)
```
✅ API: $0/month
✅ Hosting: $0 (localhost)
✅ Total: $0/month
✅ Support: 1,000+ users
```

### Paid Claude (Year 1)
```
📊 API: ~$50/month (1,000 users)
📊 Hosting: ~$20/month
📊 Total: ~$70/month
📊 Better quality responses
```

**Start FREE, upgrade when profitable!**

---

## 📖 Documentation Map

| If you want to... | Read this |
|-------------------|-----------|
| **Start 100% FREE** | `docs/FREE_SETUP_GUIDE.md` |
| **Install VS Code/Cursor** | `docs/ENVIRONMENT_SETUP.md` |
| **Use Claude (paid)** | `docs/SETUP_GUIDE.md` |
| **Deploy to production** | `docs/DEPLOYMENT.md` |
| **Understand the code** | `docs/PROJECT_STRUCTURE.md` |
| **Find answers** | `docs/FAQ.md` |

---

## ⏱️ Time Estimates

- **Read documentation:** 15 minutes
- **Install prerequisites:** 30 minutes
- **Setup backend:** 10 minutes
- **Setup frontend:** 15 minutes
- **First successful run:** 5 minutes
- **Total:** ~1 hour (first time)

---

## 🎯 Success Path

```
Day 1:    Install tools + Setup (1 hour)
            ↓
Day 2-7:  Test & customize
            ↓
Week 2:   Share with 10 friends
            ↓
Week 3:   Collect feedback
            ↓
Month 2:  Deploy (still FREE!)
            ↓
Month 3:  100 users (still FREE!)
            ↓
Month 6:  1,000 users → Consider upgrading to Claude
```

---

## 🔄 Switching from Gemini to Claude

When you're ready to upgrade:

1. Get Claude API key: https://console.anthropic.com/
2. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-api03-xxx`
3. In `routes/suggest.js`:
   ```javascript
   // Change from:
   const geminiService = require('../services/gemini.service');
   // To:
   const claudeService = require('../services/claude.service');
   ```
4. Restart backend: `npm run dev`

**That's it!** No other changes needed.

---

## 📞 Getting Help

**1. Check documentation first:**
- FREE setup: `docs/FREE_SETUP_GUIDE.md`
- Paid setup: `docs/SETUP_GUIDE.md`
- Common issues: `docs/FAQ.md`

**2. Still stuck?**
- Create GitHub issue
- Email: support@example.com

**3. Gemini-specific help:**
- Gemini Docs: https://ai.google.dev/docs
- Rate limits: https://ai.google.dev/gemini-api/docs/quota

---

## ✅ Final Checklist

Before you start:
- [ ] Read `START_HERE.md`
- [ ] Choose FREE (Gemini) or Paid (Claude)
- [ ] Install Node.js 18+
- [ ] Install Android Studio
- [ ] Choose IDE (VS Code recommended)
- [ ] Get API key (Gemini is FREE!)
- [ ] Set aside 1 hour

Ready to build:
- [ ] Run setup commands
- [ ] Test with example message
- [ ] Generate 3 AI suggestions
- [ ] Copy to WhatsApp
- [ ] Success! 🎉

---

## 🎓 What You'll Learn

By completing this project:
- ✅ Node.js/Express API development
- ✅ React Native mobile apps
- ✅ AI integration (Gemini/Claude)
- ✅ RESTful API design
- ✅ State management
- ✅ Deployment strategies

**Skills value:** $50,000+ in freelance market

---

## 🌟 Pro Tips

1. **Start FREE** - Use Gemini until you have 1,000+ users
2. **Use VS Code** - Most stable for beginners
3. **Test early** - Share with friends before strangers
4. **Read FAQ** - Most questions already answered
5. **Ask for help** - Don't waste hours stuck

---

**Ready to start? Open `START_HERE.md` and choose your path!** 🚀

---

*Version: 1.0.0 (FREE)*  
*Last Updated: March 2026*  
*Cost: $0 to start, scale when ready*
