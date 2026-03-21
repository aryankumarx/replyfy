@echo off
REM AI Keyboard Assistant - Quick Start Script for Windows

echo ========================================
echo  AI Keyboard Assistant - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [OK] npm found
npm --version
echo.

REM Ask for Claude API key
echo Configuration
echo ==============
set /p CLAUDE_KEY="Enter your Claude API key (sk-ant-api03-...): "

if "%CLAUDE_KEY%"=="" (
    echo [ERROR] API key is required
    pause
    exit /b 1
)

REM Setup backend
echo.
echo Setting up Backend...
echo =====================
cd backend

if not exist ".env" (
    copy .env.example .env
    echo [OK] Created .env file
)

REM Update .env with API key (uncomment ANTHROPIC line if needed; safe for keys with %% in batch)
powershell -NoProfile -Command "$k=$env:CLAUDE_KEY; (Get-Content .env) | ForEach-Object { if ($_ -match '^\#\s*ANTHROPIC_API_KEY=your_claude_api_key_here\s*$' -or $_ -match '^ANTHROPIC_API_KEY=your_claude_api_key_here\s*$') { 'ANTHROPIC_API_KEY=' + $k } else { $_ } } | Set-Content -Encoding utf8 .env"
echo [OK] Updated .env with your API key

echo.
echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [OK] Backend dependencies installed

REM Start backend
echo.
echo Starting backend server...
start "AI Keyboard Backend" cmd /k "npm run dev"
echo [OK] Backend server started in new window
echo     URL: http://localhost:3000

REM Wait for backend
echo Waiting for backend to be ready...
timeout /t 5 /nobreak >nul

REM Setup frontend
echo.
echo Setting up Frontend...
echo =====================
cd ..\frontend

echo.
echo Installing frontend dependencies...
echo [WARNING] This may take 5-10 minutes...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [OK] Frontend dependencies installed

REM Success message
echo.
echo ========================================
echo          Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Open a new terminal and run:
echo    cd frontend
echo    npm start
echo.
echo 2. In another terminal, run:
echo    cd frontend
echo    npx react-native run-android
echo.
echo 3. Test the app with example messages!
echo.
echo ========================================
echo.
echo Backend is running at: http://localhost:3000
echo.
echo Check docs\SETUP_GUIDE.md for detailed instructions
echo.
pause
