# 🎯 YOUR FIRST 3 STEPS (Total Time: 1.5 Hours)

**For: Cybersecurity student with 16GB RAM, fast internet, initial stage (NO API costs)**

---

## ✅ STEP 1: Install Tools (1 Hour)

### Install These 4 Things:

#### 1. Node.js (10 min)
- Go to: https://nodejs.org/
- Download "LTS" (green button)
- Install → Click Next until done
- **Restart your computer**

**Test it:**
```bash
node --version
npm --version
```

---

#### 2. VS Code OR Cursor AI (10 min)

**Cursor AI (Recommended - Has AI Help!):**
- Download: https://cursor.sh/
- Install
- Open it

**OR VS Code (Traditional):**
- Download: https://code.visualstudio.com/
- Install
- Open it

Pick one, both work fine!

---

#### 3. Android Studio (30 min)
- Download: https://developer.android.com/studio
- Install (takes 10 min)
- Open it → Click "Standard" setup
- Let it download (~15 min)
- Create virtual device:
  - Tools → Device Manager
  - Create Device → Pixel 5
  - Download system image
  - Finish

---

#### 4. Get FREE Gemini API Key (2 min)
- Go to: https://makersuite.google.com/app/apikey
- Sign in with Google
- Click "Create API Key"
- **Copy and save it somewhere!**
- Looks like: `AIzaSyB...`

**THIS IS 100% FREE - No credit card!**

---

## ✅ STEP 2: Setup Project (30 Min)

### Open Terminal in Your Code Editor:

**In Cursor AI or VS Code:**
1. File → Open Folder → Select `ai-keyboard-assistant`
2. Terminal → New Terminal (or press Ctrl+`)

### Run These Commands:

```bash
# Go to backend folder
cd backend

# Use FREE version package
cp package-gemini-free.json package.json

# Install dependencies (takes 5 min)
npm install

# Create environment file
cp .env.example .env
```

### Edit .env File:

1. Open `backend/.env` in your editor
2. Find this line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Replace `your_gemini_api_key_here` with your actual key
4. Save the file (Ctrl+S)

### Tell Backend to Use Gemini:

1. Open `backend/src/routes/suggest.js`
2. Find line 2 (near top):
   ```javascript
   const claudeService = require('../services/claude.service');
   ```
3. Change it to:
   ```javascript
   const geminiService = require('../services/gemini.service');
   ```
4. Find line 67 (scroll down):
   ```javascript
   const result = await claudeService.generateSuggestions(message, {
   ```
5. Change it to:
   ```javascript
   const result = await geminiService.generateSuggestions(message, {
   ```
6. Save the file (Ctrl+S)

### Start Backend:

```bash
# Make sure you're in backend folder
npm run dev
```

**You should see:**
```
🚀 AI Keyboard API running on port 3000
```

**Keep this terminal open!**

---

## ✅ STEP 3: Run the App (10 Min)

### Open NEW Terminal:

```bash
# Go to frontend
cd frontend

# Install dependencies (takes 5 min)
npm install

# Start Metro bundler
npm start
```

**Keep this terminal open too!**

### Open ANOTHER Terminal:

```bash
# Go to frontend
cd frontend

# Run on Android
npx react-native run-android
```

**This takes 5-10 min first time!**

### Start Emulator (if not auto-started):

1. Open Android Studio
2. Click "Device Manager" (right side)
3. Click ▶️ Play next to Pixel 5

---

## 🎉 DONE! Test It:

1. App opens on emulator
2. Tap "Hey! Are you free for dinner tomorrow?"
3. Click "Get AI Suggestions"
4. See 3 FREE AI responses!
5. Tap any suggestion to copy

---

## 🆘 If Something Goes Wrong:

### "Module not found"
```bash
cd backend
npm install
# OR
cd frontend
npm install
```

### "Port 3000 already in use"
Close other programs using it, or:
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows (note PID, then taskkill)
```

### "Can't connect to backend"
In `frontend/src/services/api.service.js`, change line 3:
```javascript
const API_URL = 'http://10.0.2.2:3000/api';  // For emulator
```

### "Emulator won't start"
- Recreate device in Android Studio Device Manager
- Make sure virtualization is enabled in BIOS

---

## 📊 What You Just Built:

✅ Working AI keyboard assistant  
✅ Backend API with FREE AI  
✅ Mobile app  
✅ Zero monthly costs  
✅ Can handle 75 users/day  
✅ Ready to customize!  

---

## 🎯 Next Steps:

1. **Customize:**
   - Change app colors
   - Add your branding
   - Test with friends

2. **Learn More:**
   - Read `docs/PROJECT_STRUCTURE.md`
   - Check `docs/FAQ.md` for questions

3. **Deploy Later:**
   - Read `docs/DEPLOYMENT.md`
   - When ready to launch!

---

## 💰 Costs So Far: $0

**Gemini API:** FREE (1500/day)  
**Tools:** All free  
**Hosting:** Local (free)  

**When to upgrade to paid Claude:**
- You have >100 daily users
- You're making money
- You need better quality

---

## ✅ You're Done!

**Congratulations! You built a professional AI app for $0!** 🎉

**Questions?** Check `docs/FAQ.md`

**Want to understand the code?** Read `docs/PROJECT_STRUCTURE.md`

**Ready to deploy?** Read `docs/DEPLOYMENT.md`

---

**TOTAL TIME: ~1.5 hours**  
**TOTAL COST: $0**  
**VALUE: $10,000+**
