# ❓ Frequently Asked Questions (FAQ)

## General Questions

### What is AI Keyboard Assistant?

AI Keyboard Assistant is a mobile app that helps you respond to messages quickly using AI. Instead of switching between your chat app and ChatGPT, you can get smart response suggestions right in your keyboard area.

### How does it work?

1. You receive a message in WhatsApp/Telegram/etc.
2. Copy or select the message
3. Open AI Keyboard Assistant
4. Get 3 AI-generated response suggestions
5. Tap to copy and paste back into your chat

### Is my data safe?

**Absolutely!** We follow zero-knowledge architecture:
- Messages are NEVER stored on our servers
- All API calls are encrypted
- We can't read your conversations even if we wanted to
- Messages are deleted from memory immediately after processing

### Which languages are supported?

- ✅ English
- ✅ Hindi
- ✅ Hinglish (mix of Hindi and English)
- 🚧 More languages coming soon (Spanish, French, etc.)

---

## Technical Questions

### Do I need to be a developer to use this?

No! The app is designed for everyday users. However, if you want to run your own server or customize the app, basic programming knowledge helps.

### What's the difference between Free and Pro?

| Feature | Free | Pro |
|---------|------|-----|
| Daily Suggestions | 20 | Unlimited |
| Response Speed | <2s | <1s (Priority) |
| Custom Tones | ❌ | ✅ |
| Ads | Yes | No |
| **Price** | Free | $3.99/month |

### How much does the Claude API cost?

Approximately **$0.05 per user per month** with typical usage (50 suggestions/month).

If you're running the backend yourself:
- 1,000 active users = ~$50/month in API costs
- You can charge $3.99/month for Pro = $3,990 revenue
- Profit: ~$3,940/month (after API costs)

### Can I use a different AI instead of Claude?

Yes! The backend is designed to be modular. You can easily swap Claude for:
- **OpenAI GPT-4** - Edit `claude.service.js` to use OpenAI SDK
- **Google Gemini** - Free tier available
- **Self-hosted Llama** - No API costs, just hosting

### Does this work on iOS?

The React Native app is designed to work on both Android and iOS. However, iOS has stricter limitations on keyboard extensions. The current version works best on Android.

iOS version is planned for Phase 2.

---

## Setup & Installation

### I don't have a Claude API key. How do I get one?

1. Go to https://console.anthropic.com/
2. Sign up for an account
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-api03-`)
6. Anthropic gives you $5 free credits to start!

### The backend won't start. What should I do?

**Check these common issues:**

1. **Port already in use:**
   ```bash
   # Kill process on port 3000
   # Mac/Linux:
   lsof -ti:3000 | xargs kill -9
   
   # Windows:
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Missing .env file:**
   ```bash
   cd backend
   cp .env.example .env
   # Then edit .env and add your API key
   ```

3. **Wrong Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

### The mobile app can't connect to the backend. Help!

**For Android Emulator:**
```javascript
// In frontend/src/services/api.service.js
const API_URL = 'http://10.0.2.2:3000/api';
```

**For Real Android Device:**
```javascript
// Find your computer's IP address first
// Windows: ipconfig
// Mac/Linux: ifconfig

const API_URL = 'http://192.168.1.XXX:3000/api';
```

**Make sure:**
- Backend is running (`npm run dev` in backend folder)
- Computer and phone are on the same WiFi network
- Firewall isn't blocking port 3000

### Build fails with "Gradle error". What do I do?

```bash
cd frontend/android
./gradlew clean
cd ../..
npx react-native run-android
```

If that doesn't work:
```bash
# Clear React Native cache
npx react-native start --reset-cache
```

---

## Usage Questions

### How accurate are the AI suggestions?

Claude Sonnet 4 is very accurate at understanding context and generating appropriate responses. However:
- **Always review** suggestions before sending
- Adjust based on your relationship with the person
- The AI doesn't know your full conversation history

### Can I customize the tone of suggestions?

In the current version, you get 3 preset tones:
1. Casual/Friendly
2. Professional/Polite
3. Brief/Direct

**Pro version** (coming soon) will allow custom tone preferences like:
- "Make it funnier"
- "More empathetic"
- "More assertive"

### Why am I getting generic responses?

The AI works best with **context**. If you only provide "Hey!" the suggestions will be generic.

**Better approach:**
- Include the previous message if relevant
- Add context about your relationship
- For Phase 2: Use the context messages feature

### Can I use this for work emails?

Yes! The "Professional/Polite" tone option is specifically designed for work communication. However, always review AI-generated content before sending in professional contexts.

---

## Privacy & Security

### What data do you collect?

We collect the **minimum** necessary:
- ✅ Usage statistics (how many suggestions generated)
- ✅ Error logs (to fix bugs)
- ❌ **NOT** your actual messages
- ❌ **NOT** who you're talking to
- ❌ **NOT** your contact list

### Is this GDPR compliant?

Yes! The zero-knowledge architecture makes GDPR compliance straightforward:
- No message storage = no personal data retention
- Users can delete their account anytime
- Clear privacy policy
- No third-party tracking

### Can the AI see my entire conversation history?

**No!** The AI only sees:
- The specific message you select
- Optionally: 2-3 previous messages if you choose to include them

It NEVER has access to your full chat history.

### What happens if your servers are hacked?

Even if our servers were compromised, hackers would find:
- User IDs (anonymous)
- Usage counts
- **NOT** your messages (we don't store them)

---

## Business & Monetization

### Can I make money with this?

**Absolutely!** Here's the math:

**Costs:**
- Claude API: ~$0.05/user/month
- Hosting: ~$20/month (1,000 users)
- Total: ~$70/month for 1,000 users

**Revenue (with 10% conversion to Pro at $3.99/month):**
- 100 Pro users × $3.99 = $399/month
- Profit: ~$329/month

**At 10,000 users:**
- Costs: ~$700/month
- Revenue: ~$3,990/month (1,000 Pro users)
- Profit: ~$3,290/month

### Can I white-label this for my company?

Yes! The code is open source (MIT License). You can:
- Rebrand the app
- Customize features
- Deploy your own instance
- Charge your own prices

Just maintain the attribution in the code.

### What about customer support costs?

With good documentation and a stable app:
- Expect ~2-5% of users to contact support
- Most questions answered by FAQ
- Budget 5-10 hours/week for 1,000 users

---

## Deployment & Scaling

### How many users can the backend handle?

**With basic setup (Vercel free tier):**
- ~100 concurrent users
- ~1,000 total users

**With paid hosting ($20-50/month):**
- ~1,000 concurrent users
- ~10,000 total users

**With proper scaling (Load balancer + Redis):**
- 50,000+ users

### What's the cheapest way to deploy?

1. **Backend:** Vercel (free tier)
2. **Database:** Supabase (free tier)
3. **Monitoring:** Free tier services
4. **Total:** $0/month for up to 100 users

### When should I upgrade to paid hosting?

Upgrade when:
- You have >100 daily active users
- Free tier rate limits kick in
- You need faster response times
- You want better uptime guarantees

---

## Troubleshooting

### "Daily limit reached" but I'm a new user

This happens when:
1. The user ID is shared (using "anonymous")
2. Someone else tested heavily on your IP

**Solution:**
- Implement proper user authentication
- Use unique user IDs
- Increase free tier limit in `.env`

### Suggestions are slow (>5 seconds)

**Check:**
1. Backend response time (should be <2s)
2. Network connection
3. Claude API status (status.anthropic.com)

**Optimize:**
- Use faster Claude model (Haiku instead of Sonnet)
- Implement caching for common messages
- Use a CDN

### App crashes on older Android versions

**Minimum requirements:**
- Android 8.0 (API level 26) or higher
- 2GB RAM
- 100MB storage

**To support older devices:**
- Lower `minSdkVersion` in `build.gradle`
- Test on older devices
- Use simpler UI components

---

## Feature Requests

### Can you add voice input?

Yes! This is planned for Phase 2. You'll be able to:
- Speak your message
- AI transcribes + refines it
- Get suggestions

### Can the AI learn my writing style?

This is a highly requested feature! Planned for Phase 3:
- AI analyzes your past responses
- Adapts suggestions to match your style
- Optional: learns relationship-specific tones

### Can I use this in group chats?

Current version is optimized for 1-on-1 conversations. Group chat support requires:
- Context about who's speaking
- Understanding group dynamics
- Multiple response strategies

Planned for future updates.

---

## Legal & Licensing

### Can I use this for commercial purposes?

Yes! The MIT license allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

Just keep the original license notice in the code.

### Do I need to credit Anthropic/Claude?

Not legally required, but **highly recommended** for ethical reasons:
- Mention "Powered by Claude AI"
- Link to Anthropic's website
- Follow their brand guidelines

### Can I sell this on the Play Store?

Yes! You can:
- Publish under your own name
- Charge for the app
- Keep 100% of revenue (minus app store fees)

---

## Getting Help

### Where can I get support?

1. **Documentation** - Check `docs/` folder first
2. **GitHub Issues** - Report bugs and request features
3. **Email** - support@example.com
4. **Community** - Join our Discord (coming soon)

### How do I report a bug?

1. Go to GitHub Issues
2. Click "New Issue"
3. Choose "Bug Report" template
4. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Device/OS version

### How do I request a feature?

Same process as bugs, but choose "Feature Request" template.

Include:
- Use case / why you need it
- How it should work
- Priority (nice-to-have vs critical)

---

## Contributing

### I want to contribute code. How do I start?

1. Fork the repository
2. Read `docs/PROJECT_STRUCTURE.md`
3. Pick an issue labeled "good first issue"
4. Create a feature branch
5. Make your changes
6. Write tests
7. Submit a pull request

### What skills do I need to contribute?

**Backend:**
- Node.js / Express
- REST APIs
- Basic security knowledge

**Frontend:**
- React Native
- JavaScript/TypeScript
- Mobile UI/UX

**Other:**
- Documentation writing
- UI/UX design
- Testing

---

Still have questions? Create an issue on GitHub or email support@example.com!
