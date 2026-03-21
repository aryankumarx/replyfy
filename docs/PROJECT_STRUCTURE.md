# 📁 Project Structure

This document explains the organization of the AI Keyboard Assistant codebase.

## Overview

```
ai-keyboard-assistant/
├── backend/              # Node.js Express API
├── frontend/             # React Native mobile app
├── docs/                 # Documentation
├── README.md            # Main project documentation
└── .gitignore           # Git ignore rules
```

---

## Backend Structure

```
backend/
├── src/
│   ├── server.js                    # Main Express server
│   ├── routes/
│   │   └── suggest.js               # API routes for suggestions
│   └── services/
│       └── claude.service.js        # Claude AI integration
├── package.json                     # Dependencies
├── .env.example                     # Environment variables template
└── .env                            # Your actual env vars (not in git)
```

### Key Files Explained

**`server.js`**
- Initializes Express app
- Sets up middleware (CORS, Helmet, rate limiting)
- Defines routes
- Error handling

**`routes/suggest.js`**
- POST `/api/suggest` - Generate suggestions
- GET `/api/suggest/usage/:userId` - Check usage
- POST `/api/suggest/test` - Test endpoint
- Handles rate limiting and usage tracking

**`services/claude.service.js`**
- Wrapper for Claude API
- Language detection (English/Hindi/Hinglish)
- Suggestion generation logic
- Fallback responses when API fails

---

## Frontend Structure

```
frontend/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js           # Main screen - message input
│   │   ├── SuggestionsScreen.js    # Display AI suggestions
│   │   └── SettingsScreen.js       # App settings
│   ├── services/
│   │   └── api.service.js          # Backend API communication
│   └── store/
│       └── useStore.js             # Zustand state management
├── App.js                          # Main app component
├── package.json                    # Dependencies
└── android/                        # Android-specific code
```

### Key Files Explained

**`App.js`**
- Navigation setup
- Theme configuration
- Screen routing

**`screens/HomeScreen.js`**
- Message input interface
- Usage tracking display
- Quick examples
- Paste from clipboard functionality

**`screens/SuggestionsScreen.js`**
- Display 3 AI-generated suggestions
- Copy to clipboard functionality
- Tone indicators (casual, professional, brief)
- Retry mechanism

**`screens/SettingsScreen.js`**
- Account information
- Usage statistics
- Upgrade to Pro
- About section

**`services/api.service.js`**
- HTTP client configuration
- API endpoint methods
- Error handling
- Health check

**`store/useStore.js`**
- Global state management using Zustand
- User data (ID, tier, usage)
- Current message and suggestions
- Loading states

---

## Data Flow

```
1. User Input
   ↓
HomeScreen
   ↓
[User enters/pastes message]
   ↓
[Clicks "Get AI Suggestions"]
   ↓
2. API Call
   ↓
api.service.js
   ↓
POST /api/suggest
   ↓
3. Backend Processing
   ↓
suggest.js (route)
   ↓
[Check usage limits]
   ↓
claude.service.js
   ↓
[Call Claude API]
   ↓
[Detect language]
   ↓
[Generate 3 suggestions]
   ↓
4. Response
   ↓
SuggestionsScreen
   ↓
[Display suggestions]
   ↓
[User taps to copy]
   ↓
[Copied to clipboard]
   ↓
5. User Action
   ↓
[Paste in WhatsApp/other app]
```

---

## API Request/Response Format

### Request to `/api/suggest`

```javascript
{
  "message": "User's received message",
  "userId": "unique-user-id",
  "userTier": "free" | "pro",
  "contextMessages": [
    {
      "sender": "them" | "you",
      "text": "previous message"
    }
  ]
}
```

### Response from `/api/suggest`

```javascript
{
  "success": true,
  "suggestions": [
    {
      "text": "Suggested response text",
      "tone": "casual" | "professional" | "brief",
      "label": "Friendly & warm"
    },
    // ... 2 more suggestions
  ],
  "usage": {
    "used": 5,
    "limit": 20,
    "remaining": 15
  },
  "metadata": {
    "language": "english" | "hindi" | "hinglish",
    "userId": "user-123",
    "timestamp": "2024-03-21T10:30:00Z",
    "model": "claude-sonnet-4"
  }
}
```

---

## State Management (Zustand)

```javascript
useStore = {
  // User data
  userId: string,
  userTier: 'free' | 'pro',
  
  // Usage tracking
  usage: {
    used: number,
    limit: number,
    remaining: number
  },
  
  // Current state
  currentMessage: string,
  contextMessages: array,
  suggestions: array,
  isLoading: boolean,
  error: string | null,
  
  // Configuration
  apiUrl: string,
  
  // Actions
  setCurrentMessage: (message) => void,
  setSuggestions: (suggestions) => void,
  updateUsage: (usage) => void,
  clearSuggestions: () => void,
  // ... more actions
}
```

---

## Environment Variables

### Backend `.env`

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
PORT=3000
NODE_ENV=development

# Optional
JWT_SECRET=your-secret-key
FREE_TIER_DAILY_LIMIT=20
PRO_TIER_DAILY_LIMIT=1000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

### Frontend Configuration

Update `src/services/api.service.js`:

```javascript
const API_URL = 'http://localhost:3000/api';  // Development
// const API_URL = 'https://your-api.vercel.app/api';  // Production
```

---

## Adding New Features

### 1. Add a New API Endpoint

**Backend (`backend/src/routes/suggest.js`):**

```javascript
router.post('/custom-tone', async (req, res) => {
  const { message, customTone } = req.body;
  
  // Your logic here
  
  res.json({ success: true, suggestion: "..." });
});
```

**Frontend (`frontend/src/services/api.service.js`):**

```javascript
async getCustomToneSuggestion(message, tone) {
  const response = await this.client.post('/suggest/custom-tone', {
    message,
    customTone: tone
  });
  return response.data;
}
```

### 2. Add a New Screen

**Create file (`frontend/src/screens/NewScreen.js`):**

```javascript
import React from 'react';
import { View, Text } from 'react-native';

function NewScreen() {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
}

export default NewScreen;
```

**Register in App.js:**

```javascript
import NewScreen from './src/screens/NewScreen';

// In Stack.Navigator:
<Stack.Screen 
  name="NewScreen" 
  component={NewScreen} 
  options={{ title: 'New Feature' }}
/>
```

### 3. Add State to Store

**In `frontend/src/store/useStore.js`:**

```javascript
const useStore = create((set) => ({
  // Add new state
  newFeature: false,
  
  // Add new action
  setNewFeature: (value) => set({ newFeature: value }),
}));
```

---

## Testing Strategies

### Backend Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create test file
# backend/src/routes/__tests__/suggest.test.js
```

```javascript
const request = require('supertest');
const app = require('../../server');

describe('POST /api/suggest', () => {
  it('should return suggestions', async () => {
    const response = await request(app)
      .post('/api/suggest')
      .send({ message: 'Hello' });
    
    expect(response.status).toBe(200);
    expect(response.body.suggestions).toHaveLength(3);
  });
});
```

### Frontend Testing

```bash
# Install React Native Testing Library
npm install --save-dev @testing-library/react-native
```

---

## Performance Optimization

### Backend

1. **Caching common responses**
   ```javascript
   const cache = new Map();
   
   const cacheKey = `${message}-${language}`;
   if (cache.has(cacheKey)) {
     return cache.get(cacheKey);
   }
   ```

2. **Connection pooling for database**
   ```javascript
   const pool = new Pool({
     max: 20,
     idleTimeoutMillis: 30000
   });
   ```

### Frontend

1. **Memoization**
   ```javascript
   const MemoizedComponent = React.memo(SuggestionCard);
   ```

2. **Lazy loading**
   ```javascript
   const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));
   ```

---

## Security Best Practices

1. **Never commit `.env` files**
2. **Validate all inputs**
3. **Use rate limiting**
4. **Encrypt sensitive data**
5. **Use HTTPS in production**
6. **Keep dependencies updated**
7. **Implement proper error handling**
8. **Don't expose stack traces to users**

---

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 3000 is already in use
- Verify `.env` file exists
- Check Claude API key is valid

**Frontend can't connect:**
- Ensure backend is running
- Check API_URL matches your setup
- For emulator: use `10.0.2.2` not `localhost`
- For device: use computer's IP address

**Build fails:**
- Run `./gradlew clean` in android folder
- Clear Metro cache: `npm start -- --reset-cache`
- Check Node.js version (18+ required)

---

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Update documentation
6. Submit a pull request

---

## License

MIT License - See LICENSE file for details

---

This structure is designed to be:
- **Modular** - Easy to add/remove features
- **Scalable** - Can handle growth
- **Maintainable** - Clean separation of concerns
- **Testable** - Each component can be tested independently
