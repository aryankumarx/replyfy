# 📁 QUICK FILE FINDER

**Can't find a file? Use this guide!**

---

## 🎯 START HERE FILES (Root folder)

**Choose ONE to start:**
- `🎯_START_HERE_FREE.md` ← **FREE VERSION START (You!)**
- `START_HERE.md` ← Paid version start
- `PREREQUISITES.md` ← What to install first
- `FREE_SETUP_GUIDE.md` ← Setup guide (FREE)
- `FREE_VS_PAID.md` ← Compare versions

---

## 🔧 CODE FILES

### Backend (API Server)
```
backend/
├── .env.example          ← Copy this to .env, add your API key
├── package.json          ← Original (Claude)
├── package-gemini-free.json  ← Use this for FREE version!
│
└── src/
    ├── server.js         ← Main Express server
    ├── routes/
    │   └── suggest.js    ← API endpoints (/api/suggest)
    └── services/
        ├── gemini.service.js   ← FREE AI (use this!)
        └── claude.service.js   ← Paid AI
```

### Frontend (Mobile App)
```
frontend/
├── package.json          ← React Native dependencies
├── App.js               ← Main app file
│
└── src/
    ├── screens/
    │   ├── HomeScreen.js         ← Input message screen
    │   ├── SuggestionsScreen.js  ← Show AI suggestions
    │   └── SettingsScreen.js     ← Settings page
    │
    ├── services/
    │   └── api.service.js        ← Connects to backend
    │
    └── store/
        └── useStore.js           ← App state management
```

---

## 📚 DOCUMENTATION FILES

### Must Read (in order):
1. `PREREQUISITES.md` - Install tools (1 hour)
2. `FREE_SETUP_GUIDE.md` - Setup project (30 min)
3. `docs/FAQ.md` - When stuck

### Reference:
- `FREE_VS_PAID.md` - Compare FREE vs PAID
- `PROJECT_SUMMARY.md` - Full overview
- `docs/PROJECT_STRUCTURE.md` - How code works
- `docs/DEPLOYMENT.md` - Deploy when ready
- `INDEX.md` - All documentation links

---

## 🔍 FIND FILES BY TASK

### "I need to change the API key"
→ `backend/.env`

### "I want to use FREE version"
→ `backend/package-gemini-free.json` (copy to package.json)
→ `backend/src/services/gemini.service.js` (already created!)

### "App can't connect to backend"
→ `frontend/src/services/api.service.js` (line 3: change API_URL)

### "Change app colors"
→ `frontend/App.js` (line 13-20: theme colors)

### "Add new screen"
→ Create in `frontend/src/screens/`
→ Register in `frontend/App.js`

### "Backend won't start"
→ Check: `backend/.env` (API key set?)
→ Check: `backend/package.json` (correct version?)

### "Something broke, need help"
→ `docs/FAQ.md` (50+ answered questions)

---

## ⚡ QUICK SETUP CHECKLIST

**For FREE version, you only need to edit 3 files:**

### File 1: `backend/package.json`
```bash
# Replace with free version
cp backend/package-gemini-free.json backend/package.json
```

### File 2: `backend/.env`
```bash
# Copy example
cp backend/.env.example backend/.env

# Then edit and add your GEMINI_API_KEY
```

### File 3: `backend/src/routes/suggest.js`
Change line 2 from:
```javascript
const claudeService = require('../services/claude.service');
```
To:
```javascript
const geminiService = require('../services/gemini.service');
```

**That's it! Only 3 files to change.**

---

## 📂 COMPLETE FILE TREE

```
ai-keyboard-assistant/
│
├── 🎯_START_HERE_FREE.md     ← YOUR STARTING POINT
├── PREREQUISITES.md
├── FREE_SETUP_GUIDE.md
├── FREE_VS_PAID.md
├── FILE_FINDER.md            ← This file!
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── package-gemini-free.json  ← Use this!
│   └── src/
│       ├── server.js
│       ├── routes/suggest.js
│       └── services/
│           ├── gemini.service.js  ← FREE AI
│           └── claude.service.js
│
├── frontend/
│   ├── package.json
│   ├── App.js
│   └── src/
│       ├── screens/
│       ├── services/
│       └── store/
│
├── docs/
│   ├── FAQ.md
│   ├── SETUP_GUIDE.md
│   ├── PROJECT_STRUCTURE.md
│   └── DEPLOYMENT.md
│
├── quickstart.sh             ← Auto setup (Mac/Linux)
└── quickstart.bat            ← Auto setup (Windows)
```

---

## 🎯 BY SCENARIO

### "Just downloaded, where to start?"
1. Open: `🎯_START_HERE_FREE.md`
2. Read it (2 min)
3. Follow the path it suggests

### "Installing tools, what's next?"
→ `PREREQUISITES.md`

### "Tools installed, ready to build"
→ `FREE_SETUP_GUIDE.md`

### "Something's broken"
→ `docs/FAQ.md`

### "Want to understand the code"
→ `docs/PROJECT_STRUCTURE.md`

### "Ready to launch"
→ `docs/DEPLOYMENT.md`

### "Can't find something"
→ This file! (`FILE_FINDER.md`)

---

## 🔎 SEARCH TIPS

### In VS Code:
- **Find file:** `Ctrl+P` then type filename
- **Search in files:** `Ctrl+Shift+F` then search
- **Go to line:** `Ctrl+G`

### In Cursor AI:
- **Ask AI:** `Ctrl+K` then "Where is the API key?"
- **Chat:** `Ctrl+L` then ask questions

---

## 📊 FILE COUNT

```
Documentation: 12 files
Backend Code: 5 files
Frontend Code: 6 files
Config: 3 files
Total: ~25 files
```

**You only need to change 3 files for FREE version!**

---

**Lost? Start here:** `🎯_START_HERE_FREE.md`

**Questions?** Check `docs/FAQ.md`
