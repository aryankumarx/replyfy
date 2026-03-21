# 💻 Complete IDE & Environment Setup Guide

This guide covers setting up your development environment from scratch, including VS Code, Cursor (Antigravity), and Windsurf.

---

## 🎯 Choose Your IDE

All three work great with this project. Pick one:

| IDE | Best For | Download |
|-----|----------|----------|
| **VS Code** | Most popular, free, lots of extensions | https://code.visualstudio.com/ |
| **Cursor** | AI-powered coding, ChatGPT built-in | https://cursor.sh/ |
| **Windsurf (Codeium)** | AI assistant, copilot features | https://codeium.com/windsurf |

**My Recommendation:** Start with VS Code (most stable), try Cursor later (amazing AI features)

---

## 📦 Prerequisites (Install These First)

### 1. Node.js (Required)

**Windows:**
1. Download: https://nodejs.org/
2. Choose LTS version (20.x)
3. Run installer
4. Check all boxes in the setup wizard
5. Click "Install"

**Mac:**
```bash
# Option 1: Download from nodejs.org
# Option 2: Use Homebrew
brew install node@20
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

### 2. Git (Recommended)

**Windows:**
- Download: https://git-scm.com/download/win
- Install with default settings

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

**Verify:**
```bash
git --version
```

---

### 3. Android Studio (For Mobile Development)

**All Platforms:**
1. Download: https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio
4. Go to: More Actions → SDK Manager
5. Install:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (if available)

**Configure Environment Variables:**

**Windows:**
```
1. Search "Environment Variables" in Start menu
2. Click "Environment Variables" button
3. Under "System variables", click "New"
4. Variable name: ANDROID_HOME
5. Variable value: C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
6. Click OK
7. Edit "Path" variable and add:
   - %ANDROID_HOME%\platform-tools
   - %ANDROID_HOME%\emulator
```

**Mac (add to ~/.zshrc or ~/.bash_profile):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Apply changes
source ~/.zshrc
```

**Linux (add to ~/.bashrc):**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Apply changes
source ~/.bashrc
```

**Verify:**
```bash
adb --version  # Should show Android Debug Bridge version
```

---

## 🔧 VS Code Setup

### 1. Install VS Code

Download and install from: https://code.visualstudio.com/

### 2. Install Essential Extensions

Open VS Code → Click Extensions icon (or Ctrl+Shift+X)

Install these:

**JavaScript/Node.js:**
- **ESLint** (by Microsoft) - JavaScript linting
- **Prettier** (by Prettier) - Code formatting
- **JavaScript (ES6) code snippets** - Quick code snippets

**React Native:**
- **React Native Tools** (by Microsoft) - Debugging and IntelliSense
- **ES7+ React/Redux/React-Native snippets** - Code snippets

**General Development:**
- **GitLens** - Git supercharged
- **Path Intellisense** - Auto-complete file paths
- **Auto Rename Tag** - Rename HTML/JSX tags
- **Bracket Pair Colorizer 2** - Colorize matching brackets

**API Testing:**
- **Thunder Client** (or REST Client) - Test APIs without leaving VS Code

**Optional but Helpful:**
- **Error Lens** - Highlight errors inline
- **Material Icon Theme** - Better file icons
- **One Dark Pro** - Popular color theme

### 3. Configure VS Code

**Settings (Ctrl+,)**

Add these to settings.json (Ctrl+Shift+P → "Preferences: Open Settings (JSON)"):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ]
}
```

### 4. Open the Project

```bash
cd ai-keyboard-assistant
code .
```

Or in VS Code: File → Open Folder → Select ai-keyboard-assistant

### 5. Use Integrated Terminal

View → Terminal (or Ctrl+`)

You can now run all commands inside VS Code!

**Split terminals:**
- Backend: `cd backend && npm run dev`
- Frontend Metro: `cd frontend && npm start`
- Frontend Build: `cd frontend && npx react-native run-android`

---

## 🤖 Cursor Setup (AI-Powered)

### 1. Install Cursor

Download from: https://cursor.sh/

**What is Cursor?**
- VS Code fork with AI built-in
- ChatGPT-like assistant in your IDE
- AI code completion
- Natural language to code

### 2. Open Project

```bash
cd ai-keyboard-assistant
cursor .
```

Or: File → Open Folder

### 3. Use AI Features

**Ctrl+K** - AI code generation
- Type: "Add error handling to this function"
- Type: "Convert this to use async/await"
- Type: "Add JSDoc comments"

**Ctrl+L** - Chat with AI about code
- Ask: "How does the suggest.js route work?"
- Ask: "How can I add a new endpoint?"

**Cmd/Ctrl+Shift+L** - AI code completion

### 4. Extensions

Cursor supports all VS Code extensions!
Install the same ones listed in VS Code section.

### 5. Configure

Same settings as VS Code. Cursor reads `.vscode/settings.json`

---

## 🌊 Windsurf (Codeium) Setup

### 1. Install Windsurf

Download from: https://codeium.com/windsurf

**What is Windsurf?**
- AI-first code editor
- Built-in copilot
- Context-aware suggestions
- Free tier available

### 2. Open Project

```bash
cd ai-keyboard-assistant
windsurf .
```

Or: File → Open Folder

### 3. Use AI Features

**AI Autocomplete:**
- Start typing, get AI suggestions
- Tab to accept

**AI Chat:**
- Click AI icon in sidebar
- Ask questions about code
- Get explanations

**Command Palette:**
- Ctrl+Shift+P
- Type "Codeium: "
- See all AI commands

### 4. Extensions

Windsurf supports VS Code extensions.

### 5. Configure

Create `.windsurf/settings.json`:

```json
{
  "codeium.enableCodeLens": true,
  "codeium.enableSearchIndexing": true
}
```

---

## 🔥 Quick Start in Any IDE

### 1. Open Project

```bash
cd ai-keyboard-assistant
code .     # VS Code
cursor .   # Cursor
windsurf . # Windsurf
```

### 2. Open 3 Terminal Tabs

**Tab 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

**Tab 2 - Frontend Metro:**
```bash
cd frontend
npm install
npm start
```

**Tab 3 - Frontend Run:**
```bash
cd frontend
npx react-native run-android
```

---

## 📱 Android Emulator Setup

### Option 1: Use Android Studio Emulator

**1. Open Android Studio**

**2. Click "More Actions" → "Virtual Device Manager"**

**3. Click "Create Device"**

**4. Choose:**
- Phone: Pixel 6
- System Image: API 33 (Android 13)
- Name: TestDevice

**5. Click "Finish"**

**6. Launch emulator** by clicking the play button

**7. Run your app:**
```bash
cd frontend
npx react-native run-android
```

### Option 2: Use Real Android Device

**1. Enable Developer Options:**
- Settings → About Phone
- Tap "Build Number" 7 times

**2. Enable USB Debugging:**
- Settings → Developer Options
- Enable "USB Debugging"

**3. Connect phone to computer via USB**

**4. Verify connection:**
```bash
adb devices
```

You should see your device listed.

**5. Run app:**
```bash
cd frontend
npx react-native run-android
```

---

## 🐛 Debugging Setup

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env",
      "console": "integratedTerminal"
    },
    {
      "name": "Attach to React Native",
      "cwd": "${workspaceFolder}/frontend",
      "type": "reactnative",
      "request": "attach"
    }
  ]
}
```

**Set breakpoints:** Click left of line number

**Start debugging:** F5 or Run → Start Debugging

### Chrome DevTools (for React Native)

**1. Start Metro bundler:**
```bash
npm start
```

**2. In the app, press:**
- Android: Ctrl+M (emulator) or shake (real device)
- Select "Debug"

**3. Open Chrome:**
```
http://localhost:8081/debugger-ui/
```

**4. Open DevTools:** F12

---

## 🧩 Useful Keyboard Shortcuts

### VS Code / Cursor

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Command Palette | Ctrl+Shift+P | Cmd+Shift+P |
| Quick Open | Ctrl+P | Cmd+P |
| Terminal | Ctrl+` | Cmd+` |
| Search | Ctrl+Shift+F | Cmd+Shift+F |
| Go to Definition | F12 | F12 |
| Format Document | Shift+Alt+F | Shift+Opt+F |
| Toggle Comment | Ctrl+/ | Cmd+/ |
| Multi-cursor | Alt+Click | Opt+Click |

### Cursor AI Shortcuts

| Action | Shortcut |
|--------|----------|
| AI Generation | Ctrl+K |
| AI Chat | Ctrl+L |
| AI Completion | Cmd/Ctrl+Shift+L |

---

## 📊 Recommended Workspace Layout

### For Backend Development:

```
┌─────────────────────────────┐
│  File Explorer              │
│  ├── backend/               │
│  │   ├── src/               │
│  │   │   ├── server.js      │
│  │   │   ├── routes/        │
│  │   │   └── services/      │
│  └── frontend/              │
├─────────────────────────────┤
│  Editor (server.js)         │
│                             │
│  Code here...               │
│                             │
├─────────────────────────────┤
│  Terminal                   │
│  $ npm run dev              │
│  Server running...          │
└─────────────────────────────┘
```

### For Frontend Development:

```
┌──────────┬──────────────────┐
│  Files   │  Editor          │
│          │  (HomeScreen.js) │
│          │                  │
│          │  Code here...    │
│          │                  │
├──────────┴──────────────────┤
│  Terminal 1: npm start      │
│  Terminal 2: run-android    │
└─────────────────────────────┘
```

---

## ✅ Environment Verification Checklist

Before you start coding, verify everything is set up:

```bash
# Node.js
node --version  # Should be v18+ or v20+
npm --version   # Should be 9+ or 10+

# Git (optional but recommended)
git --version

# Android SDK
adb --version

# Environment variables (should print paths)
# Windows:
echo %ANDROID_HOME%

# Mac/Linux:
echo $ANDROID_HOME
```

**All should print version numbers or paths!**

---

## 🎓 Learning Resources

### JavaScript/Node.js
- MDN Web Docs: https://developer.mozilla.org/
- Node.js Docs: https://nodejs.org/docs/

### React Native
- Official Docs: https://reactnative.dev/
- React Native Express: https://www.reactnative.express/

### VS Code
- Tips & Tricks: https://code.visualstudio.com/docs/getstarted/tips-and-tricks
- Shortcuts: https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf

---

## 🆘 Common Issues

### "command not found: node"

**Fix:** Node.js not in PATH
- Windows: Reinstall Node.js, check "Add to PATH"
- Mac/Linux: Add to `.bashrc` or `.zshrc`

### "adb: command not found"

**Fix:** ANDROID_HOME not set correctly
- Verify ANDROID_HOME points to Android SDK
- Add platform-tools to PATH

### "Metro bundler failed to start"

**Fix:**
```bash
cd frontend
npx react-native start --reset-cache
```

### Port already in use

**Fix:**
```bash
# Find and kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

## 🎉 You're Ready!

Your development environment is now fully set up!

**Next steps:**
1. Open the project in your chosen IDE
2. Follow the FREE_SETUP_GUIDE.md
3. Start coding!

**Happy coding!** 🚀
