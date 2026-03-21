# 🆓 100% FREE Setup Guide (Zero API Costs!)

This guide shows you how to set up the AI Keyboard Assistant using **Google Gemini** instead of Claude - completely FREE!

---

## Why Gemini?

✅ **Completely FREE** - No credit card needed  
✅ **1.5 million requests per month** - Enough for 1,000+ users  
✅ **60 requests per minute** - Fast enough for real-time use  
✅ **Supports Hindi/Hinglish/English** - Just like Claude  
✅ **Good quality** - Not as good as Claude, but free!

**Perfect for testing and initial launch!**

---

## Step 1: Get Free Gemini API Key (5 minutes)

1. **Go to Google AI Studio**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Sign in with your Google account**
   (Any Gmail account works - even new ones)

3. **Click "Get API Key"**

4. **Click "Create API Key"**

5. **Copy the key**
   It looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

6. **Done!** No credit card, no payment - 100% free!

---

## Step 2: Install Prerequisites

### Windows

**1. Install Node.js:**
```
Download from: https://nodejs.org/
Choose: LTS version (18.x or 20.x)
Run installer with default settings
```

**2. Verify installation:**
```bash
node --version
npm --version
```

**3. Install Android Studio (for mobile app):**
```
Download from: https://developer.android.com/studio
Install with default settings
Open Android Studio → Tools → SDK Manager
Install: Android SDK Platform 33
```

**4. Set Environment Variable:**
```
Control Panel → System → Advanced System Settings → Environment Variables
Add new System Variable:
Name: ANDROID_HOME
Value: C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

---

### Mac

**1. Install Homebrew (if not installed):**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**2. Install Node.js:**
```bash
brew install node@20
```

**3. Verify:**
```bash
node --version
npm --version
```

**4. Install Android Studio:**
```
Download from: https://developer.android.com/studio
Drag to Applications folder
Open → Tools → SDK Manager → Install Android SDK Platform 33
```

**5. Add to ~/.zshrc or ~/.bash_profile:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then run:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

---

### Linux (Ubuntu/Debian)

**1. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Verify:**
```bash
node --version
npm --version
```

**3. Install Android Studio:**
```bash
# Download from: https://developer.android.com/studio
# Extract and run:
tar -xvf android-studio-*.tar.gz
cd android-studio/bin
./studio.sh
```

**4. Add to ~/.bashrc:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

```bash
source ~/.bashrc
```

---

## Step 3: Setup Backend (FREE Version)

**1. Navigate to backend folder:**
```bash
cd ai-keyboard-assistant/backend
```

**2. Replace package.json with Gemini version:**
```bash
# Windows
copy package-gemini.json package.json

# Mac/Linux
cp package-gemini.json package.json
```

**3. Install dependencies:**
```bash
npm install
```

**4. Create .env file:**
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**5. Edit .env file:**

Open `.env` in any text editor and add:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Gemini API Configuration (FREE!)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Security
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Rate Limiting
FREE_TIER_DAILY_LIMIT=20
PRO_TIER_DAILY_LIMIT=1000

# CORS (allowed origins)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

**6. Update routes to use Gemini:**

Edit `backend/src/routes/suggest.js`:

Find this line:
```javascript
const claudeService = require('../services/claude.service');
```

Replace with:
```javascript
const geminiService = require('../services/gemini.service');
```

Find this line:
```javascript
const result = await claudeService.generateSuggestions(message, {
```

Replace with:
```javascript
const result = await geminiService.generateSuggestions(message, {
```

**7. Start the backend:**
```bash
npm run dev
```

✅ You should see:
```
🚀 AI Keyboard API running on port 3000
📝 Environment: development
🔐 Gemini API Key: ✅ Configured
```

**8. Test it (in a new terminal):**
```bash
curl -X POST http://localhost:3000/api/suggest/test -H "Content-Type: application/json" -d "{\"message\": \"Hey, how are you?\"}"
```

✅ You should get 3 AI suggestions!

---

## Step 4: Setup Frontend

**1. Open NEW terminal**

**2. Navigate to frontend:**
```bash
cd ai-keyboard-assistant/frontend
```

**3. Install dependencies:**
```bash
npm install
```

⏳ **This will take 5-10 minutes** - be patient!

**4. Update API URL:**

For **Android Emulator**, edit `frontend/src/services/api.service.js`:

```javascript
const API_URL = 'http://10.0.2.2:3000/api';
```

For **Real Android Device**, find your computer's IP:

**Windows:**
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# Look for inet (e.g., 192.168.1.100)
```

Then update:
```javascript
const API_URL = 'http://YOUR_IP_HERE:3000/api';
```

**5. Start Metro bundler:**
```bash
npm start
```

**6. In ANOTHER terminal, run the app:**
```bash
cd ai-keyboard-assistant/frontend
npx react-native run-android
```

⏳ **First build takes 5-10 minutes**

✅ App should launch!

---

## Step 5: Test It!

1. **On your Android device/emulator**, the app should be open

2. **Tap an example message** (e.g., "Hey! Are you free for dinner?")

3. **Click "Get AI Suggestions"**

4. **Wait 2-3 seconds**

5. **You should see 3 AI-generated suggestions!**

6. **Tap any suggestion** to copy it

7. **Open WhatsApp** and paste it!

---

## Troubleshooting

### "Module not found" error

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### "Unable to connect to development server"

1. Make sure backend is running (`npm run dev` in backend folder)
2. Check API_URL in `frontend/src/services/api.service.js`
3. For emulator: Use `http://10.0.2.2:3000/api`
4. For device: Use `http://YOUR_COMPUTER_IP:3000/api`

### Android build fails

```bash
cd frontend/android
./gradlew clean
cd ../..
npx react-native start --reset-cache
npx react-native run-android
```

### Gemini API not working

1. Check your API key is correct in `.env`
2. Make sure you're not hitting rate limits (60/min)
3. Check https://ai.google.dev/gemini-api/docs/troubleshooting

---

## VS Code Setup (Recommended)

**1. Install VS Code:**
```
Download from: https://code.visualstudio.com/
```

**2. Install helpful extensions:**
- ESLint (JavaScript linting)
- Prettier (Code formatting)
- React Native Tools
- Thunder Client (Test APIs)

**3. Open project in VS Code:**
```bash
code ai-keyboard-assistant
```

**4. Open integrated terminal:**
```
View → Terminal (or Ctrl+`)
```

Now you can run all commands inside VS Code!

---

## Cursor/Windsurf IDE Setup (Alternative)

Both work great with this project!

**Cursor:**
```
Download from: https://cursor.sh/
Open project folder
Works just like VS Code
```

**Windsurf (Codeium):**
```
Download from: https://codeium.com/windsurf
Open project folder
AI-powered coding assistance
```

Both have:
- ✅ Built-in terminal
- ✅ Git integration
- ✅ IntelliSense
- ✅ Debugging tools

---

## Cost Comparison

### FREE Gemini (What you're using now)
```
API Cost: $0/month
Hosting: $0 (localhost)
Total: $0/month
Perfect for: Testing, MVP, first 1,000 users
```

### Paid Claude (When you scale)
```
API Cost: ~$50/month (1,000 users)
Hosting: ~$20/month
Total: ~$70/month
Better for: Production, 10,000+ users
```

**You can always switch to Claude later when you're making money!**

---

## When to Upgrade to Claude?

Switch to Claude when:
- ✅ You have 1,000+ active users
- ✅ You're making $300+/month revenue
- ✅ You need better quality responses
- ✅ Gemini rate limits feel restrictive

**To switch back to Claude:**
1. Get Claude API key (https://console.anthropic.com/)
2. Replace Gemini service with Claude service
3. Update API key in `.env`
4. Restart backend

---

## Summary Checklist

- [ ] Installed Node.js 18+
- [ ] Installed Android Studio
- [ ] Got FREE Gemini API key
- [ ] Installed backend dependencies
- [ ] Created .env with Gemini key
- [ ] Updated routes to use Gemini
- [ ] Backend starts successfully
- [ ] Tested API endpoint
- [ ] Installed frontend dependencies
- [ ] Updated API_URL
- [ ] App runs on device/emulator
- [ ] Generated test suggestions

---

## Next Steps

**After successful setup:**
1. Test with real WhatsApp messages
2. Customize the branding
3. Share with 5-10 friends
4. Collect feedback
5. Iterate and improve

**When ready to scale:**
1. Deploy backend (Vercel free tier!)
2. Build release APK
3. Test with 50-100 users
4. Consider upgrading to Claude
5. Launch publicly!

---

## Getting Help

**Setup Issues:**
- Check `docs/FAQ.md`
- Create GitHub issue
- Email: support@example.com

**Gemini Issues:**
- Gemini Docs: https://ai.google.dev/docs
- Rate limits: https://ai.google.dev/gemini-api/docs/quota

---

**Congratulations! You now have a 100% FREE AI Keyboard Assistant!** 🎉

No costs until you're ready to scale! 🚀
