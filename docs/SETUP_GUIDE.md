# 🚀 Setup Guide for Beginners

This guide will walk you through setting up the AI Keyboard Assistant from scratch, even if you've never used React Native or Node.js before.

## ⏱️ Estimated Time: 30-45 minutes

---

## Part 1: Install Required Software

### 1. Install Node.js

**Windows/Mac/Linux:**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Install Git (Optional but recommended)

**Windows:**
- Download from [https://git-scm.com/](https://git-scm.com/)

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

### 3. Install React Native CLI

```bash
npm install -g react-native-cli
```

### 4. Install Android Studio (for Android development)

1. Download from [https://developer.android.com/studio](https://developer.android.com/studio)
2. Install with default settings
3. Open Android Studio
4. Go to: Tools → SDK Manager
5. Install:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Emulator

### 5. Set up Android Environment Variables

**Windows:**
```bash
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

**Mac/Linux:**
Add to `~/.bash_profile` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## Part 2: Get Your Claude API Key

1. **Create an Anthropic Account**
   - Go to [https://console.anthropic.com/](https://console.anthropic.com/)
   - Click "Sign Up"
   - Verify your email

2. **Get API Key**
   - Navigate to "API Keys" in the dashboard
   - Click "Create Key"
   - Name it "AI Keyboard Dev"
   - **Copy the key** (you won't see it again!)
   - It looks like: `sk-ant-api03-xxxxxxxxxxxxx`

3. **Add Credits (if needed)**
   - Anthropic gives you $5 free credits
   - This is enough for ~1000 suggestions (perfect for testing!)

---

## Part 3: Set Up the Backend

1. **Extract the project files**
   ```bash
   cd Downloads
   unzip ai-keyboard-assistant.zip
   cd ai-keyboard-assistant
   ```

2. **Navigate to backend folder**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   
   ⏳ This will take 2-3 minutes

4. **Create environment file**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Or on Windows:
   copy .env.example .env
   ```

5. **Edit the .env file**
   
   Open `.env` in any text editor and add your Claude API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
   PORT=3000
   NODE_ENV=development
   FREE_TIER_DAILY_LIMIT=20
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

   ✅ You should see:
   ```
   🚀 AI Keyboard API running on port 3000
   📝 Environment: development
   🔐 Claude API Key: ✅ Configured
   ```

7. **Test the API (in a new terminal)**
   ```bash
   curl -X POST http://localhost:3000/api/suggest/test \
     -H "Content-Type: application/json" \
     -d "{\"message\": \"Hey, how are you?\"}"
   ```

   ✅ You should see AI suggestions returned!

**⚠️ IMPORTANT:** Keep this terminal window open! The server needs to run while you test the app.

---

## Part 4: Set Up the Mobile App

1. **Open a NEW terminal window**

2. **Navigate to frontend folder**
   ```bash
   cd ai-keyboard-assistant/frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   
   ⏳ This will take 5-10 minutes

4. **Update API URL (IMPORTANT!)**
   
   Open `src/services/api.service.js` and change:
   ```javascript
   const API_URL = 'http://10.0.2.2:3000/api'; // For Android Emulator
   // OR
   const API_URL = 'http://YOUR_COMPUTER_IP:3000/api'; // For real device
   ```

   **To find your computer's IP:**
   - **Windows:** `ipconfig` → look for IPv4
   - **Mac/Linux:** `ifconfig` → look for inet

5. **Start React Native packager**
   ```bash
   npm start
   ```

6. **Run on Android (in ANOTHER new terminal)**
   ```bash
   cd ai-keyboard-assistant/frontend
   npx react-native run-android
   ```

   ⏳ First build takes 5-10 minutes

   ✅ App should launch on your emulator/device!

---

## Part 5: Test the App

1. **Open the app** on your Android device/emulator

2. **Try the example messages:**
   - Tap one of the example buttons
   - Click "Get AI Suggestions"
   - Wait 2-3 seconds
   - You should see 3 AI-generated suggestions!

3. **Copy a suggestion:**
   - Tap any suggestion card
   - It will be copied to clipboard
   - Open WhatsApp and paste it

---

## 🎉 Congratulations!

You now have a working AI Keyboard Assistant!

---

## Common Issues & Solutions

### Issue 1: "ANTHROPIC_API_KEY is not set"

**Solution:**
- Make sure you created `.env` file in `backend/` folder
- Check that the API key is correct
- Restart the backend server

### Issue 2: "Unable to connect to development server"

**Solution:**
- Make sure backend is running (`npm run dev` in backend folder)
- Check the API_URL in `api.service.js` matches your setup
- For emulator: use `http://10.0.2.2:3000/api`
- For real device: use `http://YOUR_COMPUTER_IP:3000/api`

### Issue 3: Android build fails

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue 4: "Rate limit exceeded"

**Solution:**
- You've used too many requests too quickly
- Wait 1 minute and try again
- Or increase the rate limit in `.env`

### Issue 5: Metro bundler issues

**Solution:**
```bash
# Clear cache
npx react-native start --reset-cache
```

---

## Next Steps

1. **Customize the App**
   - Change colors in `App.js`
   - Add your own branding
   - Modify suggestion prompts in `claude.service.js`

2. **Deploy**
   - Follow deployment guide in main README
   - Deploy backend to Vercel
   - Build release APK for Play Store

3. **Test with Real Users**
   - Share with 5-10 friends
   - Collect feedback
   - Iterate based on usage

---

## 📞 Need Help?

- **Can't get it working?** Create an issue on GitHub
- **Want to customize?** Check the code comments
- **Ready to deploy?** See the deployment guide

---

## 🎯 Quick Reference

**Backend Commands:**
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm start           # Start production server
```

**Frontend Commands:**
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start Metro bundler
npx react-native run-android  # Run on Android
npx react-native run-ios      # Run on iOS
```

**Useful URLs:**
- Backend API: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`
- Test Endpoint: `http://localhost:3000/api/suggest/test`

---

Good luck! 🚀
