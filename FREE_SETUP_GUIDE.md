# 🆓 FREE VERSION SETUP GUIDE - Zero Cost!

**Perfect for students, testing, and initial launch with NO API bills!**

---

## 🎯 What You'll Use (All FREE!)

✅ **Google Gemini API** - 100% FREE (1,500 requests/day)  
✅ **VS Code** - FREE code editor  
✅ **Node.js** - FREE runtime  
✅ **Android Studio** - FREE for Android development  

**Total Cost: $0 forever** (within free limits)

---

## 📋 Prerequisites Installation (Step-by-Step)

### Your System:
- ✅ Windows/Mac/Linux
- ✅ 16GB RAM (perfect!)
- ✅ Fast internet (you have this!)

**Time needed: 1 hour for complete setup**

---

## Step 1: Install Node.js (5 minutes)

### Windows:
1. Go to: https://nodejs.org/
2. Download "LTS" version (looks like 18.x.x or 20.x.x)
3. Run installer
4. Click "Next" → "Next" → "Install"
5. **Verify:**
   ```cmd
   node --version
   npm --version
   ```
   Should show version numbers

### Mac:
```bash
# Using Homebrew (install Homebrew first if needed)
brew install node

# OR download from https://nodejs.org/
```

### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

---

## Step 2: Install VS Code (5 minutes)

### All Platforms:
1. Go to: https://code.visualstudio.com/
2. Download for your OS
3. Install (default settings are fine)
4. **Recommended Extensions** (install from VS Code):
   - ESLint
   - Prettier
   - React Native Tools
   - GitLens (optional but helpful)

**To install extensions:**
1. Open VS Code
2. Click Extensions icon (left sidebar) or press `Ctrl+Shift+X`
3. Search for extension name
4. Click "Install"

---

## Step 3: Install Git (5 minutes)

### Windows:
1. Download: https://git-scm.com/download/win
2. Install (default settings)
3. Verify:
   ```cmd
   git --version
   ```

### Mac:
```bash
# Already installed on most Macs
git --version

# If not installed:
brew install git
```

### Linux:
```bash
sudo apt-get install git
```

---

## Step 4: Install Android Studio (20 minutes)

### All Platforms:
1. **Download:** https://developer.android.com/studio
2. **Install:**
   - Windows: Run .exe installer
   - Mac: Drag to Applications
   - Linux: Extract and run studio.sh

3. **First Launch Setup:**
   - Choose "Standard" installation
   - Accept licenses
   - Let it download Android SDK (takes 10-15 min)

4. **Install Android SDK:**
   - Open Android Studio
   - Go to: Tools → SDK Manager
   - Check these:
     - ✅ Android SDK Platform 33
     - ✅ Android SDK Build-Tools
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
   - Click "Apply" → "OK"

5. **Create Virtual Device (Emulator):**
   - Go to: Tools → Device Manager
   - Click "Create Device"
   - Choose "Pixel 5" or similar
   - Select System Image: "R" (API 30) or "S" (API 31)
   - Click "Finish"

---

## Step 5: Set Environment Variables (10 minutes)

### Windows:
1. Search "Environment Variables" in Start Menu
2. Click "Environment Variables"
3. Under "User variables", click "New"
4. Add these:

```
Variable: ANDROID_HOME
Value: C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk

Variable: Path (edit existing)
Add: %ANDROID_HOME%\platform-tools
Add: %ANDROID_HOME%\emulator
Add: %ANDROID_HOME%\tools
Add: %ANDROID_HOME%\tools\bin
```

5. Click OK → OK → OK
6. **Restart your computer**
7. **Verify:**
   ```cmd
   adb --version
   ```

### Mac/Linux:
Add to `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then:
```bash
source ~/.zshrc  # or source ~/.bash_profile
adb --version
```

---

## Step 6: Get FREE Gemini API Key (2 minutes)

1. **Go to:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click:** "Create API Key"
4. **Copy the key** (looks like: `AIzaSyB...`)
5. **Save it** somewhere safe!

**Limits (FREE):**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ No credit card needed
- ✅ Never expires

**This means:**
- ✅ 1,500 AI suggestions per day = enough for 75 users (20 each)
- ✅ Perfect for testing and initial launch!

---

## Step 7: Setup the Project (10 minutes)

### Open in VS Code:

**Windows:**
```cmd
cd Downloads\ai-keyboard-assistant
code .
```

**Mac/Linux:**
```bash
cd ~/Downloads/ai-keyboard-assistant
code .
```

### Setup Backend (FREE version):

**Terminal in VS Code** (Ctrl+` or View → Terminal):

```bash
# Navigate to backend
cd backend

# Use FREE version package.json
cp package-gemini-free.json package.json

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Edit .env file:

Open `backend/.env` in VS Code and change:

```bash
# Replace this line:
ANTHROPIC_API_KEY=your_claude_api_key_here

# With this:
GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE

# Rest stays the same:
PORT=3000
NODE_ENV=development
FREE_TIER_DAILY_LIMIT=20
```

### Update suggest.js to use Gemini:

Open `backend/src/routes/suggest.js`

**Change line 2 from:**
```javascript
const claudeService = require('../services/claude.service');
```

**To:**
```javascript
const geminiService = require('../services/gemini.service');
```

**Change line 67 from:**
```javascript
const result = await claudeService.generateSuggestions(message, {
```

**To:**
```javascript
const result = await geminiService.generateSuggestions(message, {
```

**Save the file** (Ctrl+S)

---

## Step 8: Test Backend (2 minutes)

```bash
# Make sure you're in backend folder
cd backend

# Start the server
npm run dev
```

**You should see:**
```
🚀 AI Keyboard API running on port 3000
📝 Environment: development
🔐 Gemini API Key: ✅ Configured
```

**Test it (in new terminal):**
```bash
curl -X POST http://localhost:3000/api/suggest/test
```

**You should see** 3 AI-generated suggestions!

---

## Step 9: Setup Frontend (15 minutes)

**New terminal in VS Code:**

```bash
cd frontend

# Install dependencies (takes 5-10 min)
npm install

# Install React Native CLI globally
npm install -g react-native-cli
```

---

## Step 10: Run the App! (5 minutes)

### Start Metro Bundler:
```bash
# In frontend folder
npm start
```

### Start Android Emulator:
1. Open Android Studio
2. Click "Device Manager" (right sidebar)
3. Click ▶️ (Play) next to your virtual device
4. Wait for emulator to boot (~1 min)

### Run the App (New Terminal):
```bash
# In frontend folder
npx react-native run-android
```

**First build takes 5-10 minutes!**

---

## ✅ You're Done! Test It:

1. App opens on emulator
2. Tap an example message
3. Click "Get AI Suggestions"
4. See 3 FREE AI-generated responses!
5. Tap to copy

---

## 🎯 Using Cursor AI / Antigravity

### Cursor AI (Recommended!):

**Download:** https://cursor.sh/

**Why Cursor?**
- ✅ Built on VS Code (same interface)
- ✅ AI autocomplete built-in
- ✅ Chat with your codebase
- ✅ FREE tier available

**Setup:**
1. Download and install Cursor
2. Open project: File → Open Folder → Select `ai-keyboard-assistant`
3. Use Ctrl+K to ask AI questions about the code!

**Examples:**
- "How do I add a new screen?"
- "Explain this file"
- "Fix this error: [paste error]"

### Antigravity:

I'm not familiar with "Antigravity" - did you mean:
- **GitHub Copilot**? (AI coding assistant)
- **Tabnine**? (AI autocomplete)
- **Replit**? (Online IDE)

Let me know and I'll add instructions!

---

## 💰 Cost Comparison

### With Claude (Paid):
- ✅ Better quality
- ✅ More reliable
- ❌ ~$50/month for 1,000 users
- ❌ Needs credit card

### With Gemini (FREE):
- ✅ Completely FREE
- ✅ 1,500 requests/day
- ✅ Good quality (especially Hinglish!)
- ✅ No credit card
- ⚠️ Daily limit (but 1,500 is a lot!)

**When to upgrade to Claude:**
- You have >75 daily active users
- You need higher quality
- You're making money ($500+/month revenue)

---

## 🆘 Troubleshooting

### "Module not found @google/generative-ai"
```bash
cd backend
npm install @google/generative-ai
```

### "Port 3000 already in use"
**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### "Android Emulator won't start"
1. Open Android Studio
2. Tools → AVD Manager
3. Delete existing device
4. Create new device (Pixel 5, API 30)

### "App not connecting to backend"
In `frontend/src/services/api.service.js`, change:
```javascript
const API_URL = 'http://10.0.2.2:3000/api'; // For emulator
```

---

## 🎉 Next Steps

1. **Customize:**
   - Change app colors
   - Add your branding
   - Modify suggestions

2. **Test with friends:**
   - Share APK
   - Get feedback
   - Iterate

3. **Deploy:**
   - Backend to Vercel (FREE tier)
   - Keep using Gemini FREE
   - Upgrade to Claude when making money

---

## 📊 FREE Tier Limits

**Gemini FREE Tier:**
- 60 requests/minute
- 1,500 requests/day
- Unlimited API key usage

**What this means:**
- Support 75 users (20 requests/day each)
- Perfect for MVP and testing
- No risk, no cost!

**When you hit limits:**
- Implement caching
- Add "try again in 1 hour" message
- OR upgrade to paid tier ($0.50/1M tokens)

---

## ✨ Pro Tips

1. **Start FREE** - Prove the concept first
2. **Track usage** - Know when to upgrade
3. **Cache responses** - Reduce API calls
4. **Upgrade gradually** - Only when making money

---

**You're all set! Zero cost, full features, ready to test!** 🚀

Questions? Check `docs/FAQ.md` or create an issue!
