# 🌐 Deployment Guide

This guide covers deploying your AI Keyboard Assistant to production.

---

## Backend Deployment (Multiple Options)

### Option 1: Vercel (Recommended - Easiest)

**Cost:** Free tier available, $20/month for pro

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` in backend folder**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy**
   ```bash
   cd backend
   vercel
   ```

4. **Add Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add:
     - `ANTHROPIC_API_KEY`
     - `JWT_SECRET`
     - `FREE_TIER_DAILY_LIMIT`

5. **Update Frontend**
   Change `API_URL` in `frontend/src/services/api.service.js`:
   ```javascript
   const API_URL = 'https://your-app.vercel.app/api';
   ```

---

### Option 2: Railway

**Cost:** $5/month

1. **Go to [railway.app](https://railway.app)**

2. **Click "Start a New Project"**

3. **Connect GitHub repo or deploy from CLI**

4. **Add environment variables** in Railway dashboard

5. **Deploy** - it's automatic!

---

### Option 3: DigitalOcean App Platform

**Cost:** $5-12/month

1. **Create account at [DigitalOcean](https://digitalocean.com)**

2. **Create new App**

3. **Connect your GitHub repo**

4. **Configure:**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 3000

5. **Add environment variables**

---

### Option 4: AWS EC2 (Advanced)

**Cost:** ~$10-20/month

1. **Launch EC2 instance** (t2.micro or t3.small)

2. **SSH into server**
   ```bash
   ssh -i your-key.pem ubuntu@your-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone your repo**
   ```bash
   git clone https://github.com/yourusername/ai-keyboard-assistant
   cd ai-keyboard-assistant/backend
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Set up PM2 (process manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start src/server.js --name ai-keyboard
   pm2 startup
   pm2 save
   ```

7. **Set up Nginx reverse proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

8. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

9. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Frontend Deployment (Android)

### Building Release APK

1. **Generate upload key**
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Create `gradle.properties`**
   
   In `android/gradle.properties`, add:
   ```
   MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
   MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
   MYAPP_UPLOAD_STORE_PASSWORD=YOUR_PASSWORD
   MYAPP_UPLOAD_KEY_PASSWORD=YOUR_PASSWORD
   ```

3. **Update `build.gradle`**
   
   In `android/app/build.gradle`, add:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file(MYAPP_UPLOAD_STORE_FILE)
               storePassword MYAPP_UPLOAD_STORE_PASSWORD
               keyAlias MYAPP_UPLOAD_KEY_ALIAS
               keyPassword MYAPP_UPLOAD_KEY_PASSWORD
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
           }
       }
   }
   ```

4. **Build the APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   APK location: `android/app/build/outputs/apk/release/app-release.apk`

5. **Test the APK**
   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

---

### Publishing to Google Play Store

1. **Create Google Play Developer Account**
   - Cost: $25 one-time fee
   - Go to [play.google.com/console](https://play.google.com/console)

2. **Create App**
   - Click "Create App"
   - Fill in app details
   - Choose category: Productivity

3. **Prepare Store Listing**
   - App name: "AI Keyboard Assistant"
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (minimum 2)
   - Feature graphic (1024x500)
   - App icon (512x512)

4. **Set Up Content Rating**
   - Answer questionnaire
   - Get rating

5. **Set Up Pricing & Distribution**
   - Free or Paid
   - Countries
   - Content guidelines

6. **Upload APK/AAB**
   ```bash
   # Build AAB (recommended for Play Store)
   cd android
   ./gradlew bundleRelease
   ```

   Upload: `android/app/build/outputs/bundle/release/app-release.aab`

7. **Submit for Review**
   - Review can take 1-7 days

---

## Database Setup (For Production)

For production, replace in-memory storage with a real database.

### Option A: Supabase (Recommended)

1. **Create account at [supabase.com](https://supabase.com)**

2. **Create new project**

3. **Create users table**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id TEXT UNIQUE NOT NULL,
     tier TEXT DEFAULT 'free',
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE usage (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id TEXT NOT NULL,
     date DATE DEFAULT CURRENT_DATE,
     count INTEGER DEFAULT 0,
     UNIQUE(user_id, date)
   );
   ```

4. **Update backend code**
   ```bash
   npm install @supabase/supabase-js
   ```

   In `backend/src/services/db.service.js`:
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_KEY
   );
   
   // Track usage
   async function incrementUsage(userId) {
     const { data, error } = await supabase
       .from('usage')
       .upsert({
         user_id: userId,
         date: new Date().toISOString().split('T')[0],
         count: 1
       }, {
         onConflict: 'user_id,date',
         increment: { count: 1 }
       });
   }
   ```

---

## Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/node
```

In `server.js`:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Uptime Monitoring (UptimeRobot)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor for your API endpoint
3. Get alerts via email/SMS

### 3. Analytics (PostHog - Privacy-friendly)

```bash
npm install posthog-node
```

Track events without invading privacy:
- "Suggestion Generated"
- "Suggestion Copied"
- "Daily Limit Reached"

---

## Security Checklist

Before going live:

- [ ] All API keys in environment variables (not in code)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Database uses connection pooling
- [ ] Logs don't contain user messages
- [ ] Privacy policy published
- [ ] Terms of service published

---

## Cost Estimate (Monthly)

| Service | Cost |
|---------|------|
| Backend hosting (Vercel/Railway) | $0-20 |
| Database (Supabase) | $0-25 |
| Claude API (1,000 users, 50 requests/user) | $250 |
| Error tracking (Sentry) | $0-26 |
| **Total** | **$250-321** |

**Revenue needed:** 63 Pro users at $3.99/month to break even

---

## Launch Checklist

**Week Before Launch:**
- [ ] Backend deployed and tested
- [ ] Frontend APK built and tested
- [ ] Google Play listing complete
- [ ] Privacy policy published
- [ ] Support email set up
- [ ] Analytics configured
- [ ] Error tracking enabled

**Launch Day:**
- [ ] Submit to Google Play
- [ ] Post on ProductHunt
- [ ] Share on Reddit (r/Android, r/productivity)
- [ ] Tweet about it
- [ ] Send to tech blogs

**Week After Launch:**
- [ ] Monitor error rates
- [ ] Respond to all reviews
- [ ] Fix critical bugs
- [ ] Analyze usage patterns
- [ ] Plan next features

---

## Need Help?

- Backend deployment issues? Check server logs
- Frontend build issues? Run `./gradlew clean`
- Play Store rejection? Read review feedback carefully
- High costs? Implement caching and rate limiting

Good luck with your launch! 🚀
