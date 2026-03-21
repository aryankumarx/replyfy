# 🔧 Complete Prerequisites Installation Guide

**Everything you need to install BEFORE starting the project**

**Your System:** Windows/Mac/Linux, 16GB RAM ✅  
**Time Needed:** 1 hour  
**Cost:** $0 (all free tools)

---

## ✅ Installation Checklist

- [ ] Node.js 18+
- [ ] VS Code or Cursor AI
- [ ] Git
- [ ] Android Studio + Android SDK
- [ ] Environment Variables
- [ ] Google Gemini API Key (FREE!)

---

## 1️⃣ Node.js Installation (5-10 min)

### Why: JavaScript runtime for backend

### Windows:
1. Go to: https://nodejs.org/
2. Click "LTS" version (green button)
3. Download and run installer
4. Click Next → Next → Install
5. Wait 2-3 minutes
6. Restart computer (important!)

**Verify:**
```cmd
# Open Command Prompt (Win+R, type "cmd")
node --version
npm --version
```
Should show: `v18.x.x` or `v20.x.x`

### Mac:
```bash
# Option 1: Download from website
# Go to https://nodejs.org/ and download

# Option 2: Using Homebrew (recommended)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# Verify
node --version
npm --version
```

### Linux (Ubuntu/Debian):
```bash
# Update package list
sudo apt update

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

---

## 2️⃣ Code Editor - VS Code or Cursor (10 min)

### Option A: VS Code (Recommended for Beginners)

**Download:** https://code.visualstudio.com/

**Windows:**
1. Download installer
2. Run and install
3. Check "Add to PATH" during installation

**Mac/Linux:**
1. Download
2. Drag to Applications (Mac) or extract (Linux)

**Essential Extensions:**
```
1. Open VS Code
2. Click Extensions icon (Ctrl+Shift+X)
3. Install these:
   - ESLint
   - Prettier - Code formatter
   - React Native Tools
   - Path Intellisense
```

### Option B: Cursor AI (Recommended for AI Help)

**Download:** https://cursor.sh/

**Why Cursor?**
- Built on VS Code (same interface)
- AI coding assistant built-in
- Free tier available
- Perfect for asking questions about code

**Setup:**
Same as VS Code, just download and install!

---

## 3️⃣ Git Installation (5 min)

### Why: Version control + project cloning

### Windows:
1. Download: https://git-scm.com/download/win
2. Run installer
3. Use default settings (just click Next)
4. Restart terminal

**Verify:**
```cmd
git --version
```

### Mac:
```bash
# Option 1: Included with Xcode Command Line Tools
xcode-select --install

# Option 2: Using Homebrew
brew install git

# Verify
git --version
```

### Linux:
```bash
sudo apt-get install git

# Verify
git --version
```

---

## 4️⃣ Android Studio (30 min - includes download time)

### Why: Build and test Android apps

### All Platforms:

**Step 1: Download**
- Go to: https://developer.android.com/studio
- Download for your OS
- File size: ~1GB (takes 5-10 min with fast internet)

**Step 2: Install**

**Windows:**
1. Run .exe installer
2. Click Next → Next → Install
3. Takes 5-10 minutes

**Mac:**
1. Open .dmg file
2. Drag Android Studio to Applications
3. Open from Applications

**Linux:**
```bash
# Extract downloaded tar.gz
cd ~/Downloads
tar -xvf android-studio-*.tar.gz
cd android-studio/bin
./studio.sh
```

**Step 3: First Launch Setup**

Android Studio will open setup wizard:

1. **Choose Setup Type:** Standard
2. **Accept Licenses:** Scroll and click Accept All
3. **Download Components:** This takes 10-15 min
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

**Step 4: Install Android SDK**

1. In Android Studio, go to: **Tools → SDK Manager**
2. **SDK Platforms tab:**
   - ✅ Android 13.0 (Tiramisu) - API 33
   - ✅ Android 12.0 (S) - API 31
   - ✅ Android 11.0 (R) - API 30

3. **SDK Tools tab:**
   - ✅ Android SDK Build-Tools 33
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (if on Intel)

4. Click **Apply** → **OK**
5. Wait 5-10 min for download

**Step 5: Create Virtual Device (Emulator)**

1. Go to: **Tools → Device Manager**
2. Click **Create Device**
3. Choose: **Pixel 5** or **Pixel 6**
4. Click **Next**
5. Select System Image: **R (API 30)** or **S (API 31)**
   - If not downloaded, click Download first
6. Click **Next** → **Finish**
7. Click ▶️ Play button to test emulator

---

## 5️⃣ Environment Variables (15 min)

### Why: Let React Native find Android SDK

### Windows:

1. **Open Environment Variables:**
   - Press Win+S
   - Search "Environment Variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button

2. **Add ANDROID_HOME:**
   - Under "User variables", click "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
   - Replace YOUR_USERNAME with your actual Windows username
   - Click OK

3. **Update Path:**
   - Under "User variables", find "Path"
   - Click "Edit"
   - Click "New" and add each of these:
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\emulator
     %ANDROID_HOME%\tools
     %ANDROID_HOME%\tools\bin
     ```
   - Click OK → OK → OK

4. **RESTART YOUR COMPUTER** (important!)

5. **Verify:**
   ```cmd
   # Open new Command Prompt
   adb --version
   emulator -version
   ```

### Mac:

1. **Find your shell:**
   ```bash
   echo $SHELL
   # If it says /bin/zsh → use .zshrc
   # If it says /bin/bash → use .bash_profile
   ```

2. **Edit config file:**
   ```bash
   # For zsh (most Macs):
   nano ~/.zshrc
   
   # For bash:
   nano ~/.bash_profile
   ```

3. **Add these lines:**
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

4. **Save:** Ctrl+O, Enter, Ctrl+X

5. **Reload:**
   ```bash
   source ~/.zshrc  # or source ~/.bash_profile
   ```

6. **Verify:**
   ```bash
   adb --version
   emulator -version
   ```

### Linux:

Same as Mac, but Android SDK is usually in:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

---

## 6️⃣ Get FREE Gemini API Key (2 min)

### Why: Power the AI suggestions (100% FREE!)

**Steps:**

1. **Go to:** https://makersuite.google.com/app/apikey

2. **Sign in** with Google account

3. **Click:** "Create API Key"

4. **Copy the key**
   - Looks like: `AIzaSyB...`
   - Save in a text file somewhere safe!

5. **That's it!** No credit card, no billing.

**What you get (FREE):**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Never expires
- ✅ No credit card needed

**Enough for:**
- 75 users per day (20 requests each)
- Perfect for testing and MVP!

---

## ✅ Verify Everything is Installed

### Run These Commands:

```bash
# Node.js
node --version
# Should show: v18.x.x or v20.x.x

# npm
npm --version
# Should show: 9.x.x or 10.x.x

# Git
git --version
# Should show: git version 2.x.x

# Android
adb --version
# Should show: Android Debug Bridge version x.x.x

# Java (comes with Android Studio)
java -version
# Should show: openjdk version "xx"
```

### If Any Command Fails:
- Windows: Restart computer
- Mac/Linux: Restart terminal
- Still failing? Go back to that installation step

---

## 📱 Test Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start emulator (use name from list)
emulator -avd Pixel_5_API_30

# Or use Android Studio:
# Tools → Device Manager → Click ▶️ Play
```

**Emulator should open!** (takes 1-2 min first time)

---

## 🎓 Recommended Learning (Optional)

**Never used terminal/command line?**
- Watch: "Command Line Crash Course" on YouTube (10 min)
- Practice: `cd`, `ls`/`dir`, `mkdir`

**Never coded before?**
- JavaScript basics: https://javascript.info/
- React Native intro: https://reactnative.dev/docs/tutorial

**Used other editors?**
- VS Code tutorial: https://code.visualstudio.com/docs/introvideos/basics

---

## 🆘 Common Installation Issues

### Node.js

**Issue:** "node command not found"
- **Fix:** Restart terminal/computer after installing
- **Windows:** Make sure you checked "Add to PATH"

**Issue:** "npm ERR! code EACCES"
- **Fix (Mac/Linux):**
  ```bash
  sudo chown -R $USER ~/.npm
  sudo chown -R $USER /usr/local/lib/node_modules
  ```

### Android Studio

**Issue:** "SDK location not found"
- **Fix:** Set ANDROID_HOME environment variable (see Step 5)

**Issue:** "Emulator won't start"
- **Fix:** Enable virtualization in BIOS
- **Windows:** Also install HAXM from SDK Manager

**Issue:** "License not accepted"
- **Fix:**
  ```bash
  cd $ANDROID_HOME/tools/bin
  ./sdkmanager --licenses
  # Type 'y' for each license
  ```

### Environment Variables

**Issue:** "adb not found" after setting PATH
- **Fix:** Restart computer (Windows especially)
- **Check:** Is ANDROID_HOME correct path?

---

## ⏱️ Time Estimate

| Step | Time |
|------|------|
| Node.js | 10 min |
| VS Code | 10 min |
| Git | 5 min |
| Android Studio | 30 min |
| Environment Variables | 15 min |
| Gemini API Key | 2 min |
| **Total** | **~1 hour** |

*Assumes fast internet for downloads*

---

## ✅ You're Ready When:

- [ ] `node --version` works
- [ ] `npm --version` works
- [ ] `git --version` works
- [ ] `adb --version` works
- [ ] Emulator boots successfully
- [ ] You have Gemini API key saved

---

## 🎯 What's Next?

**All prerequisites done?**

👉 **Next:** [FREE_SETUP_GUIDE.md](FREE_SETUP_GUIDE.md)

This will:
1. Setup the project
2. Configure Gemini API
3. Run the app
4. Test it!

---

**Questions?** Check [docs/FAQ.md](docs/FAQ.md) or create an issue!
