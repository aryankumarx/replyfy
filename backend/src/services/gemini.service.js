const fs = require('fs');
const path = require('path');

/**
 * Gemini Service - with rate limit protection
 * - Uses gemini-2.5-flash-lite (highest free quota: ~30-60 RPM)
 * - Retry with exponential backoff on 429 errors
 * - In-memory response cache to avoid duplicate API calls
 */

class GeminiService {
  constructor() {
    this.apiKey = null;
    this.apiUrl = null;
    this._initialized = false;
    
    // Simple in-memory cache: message -> { suggestions, timestamp }
    this._cache = new Map();
    this._cacheMaxAge = 5 * 60 * 1000; // Cache for 5 minutes
    this._cacheMaxSize = 100;           // Max 100 cached responses
  }

  _initialize() {
    if (this._initialized) return;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables.');
    }
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    this._initialized = true;
    console.log(`✅ Gemini service initialized (model: ${this.model})`);
  }


  detectLanguage(text) {
    const lowerText = text.toLowerCase().trim();
    
    // Check for Devanagari script (proper Hindi)
    const hindiChars = /[\u0900-\u097F]/;
    const hasDevanagari = hindiChars.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    
    // Common Hindi/Hinglish words written in Roman script (excluding pure English words like 'are', 'to', 'me')
    const hindiWords = new Set([
      'hai', 'hain', 'hnn', 'haan', 'han', 'haa', 'kya', 'kyaaa', 'kaise', 'kese', 'kaisa', 'kaisi',
      'kab', 'kahan', 'kaha', 'kidhar', 'kdr', 'idhar', 'udhar', 'kyun', 'kyu', 'kyuu', 'nahi', 'nahin', 'nhi',
      'naa', 'mat', 'mujhe', 'mjhe', 'tumhe', 'tmhe', 'aapko', 'apko', 'unko', 'isko', 'usko', 'sabko', 'kisko',
      'bhai', 'bhaiya', 'bhaii', 'yaar', 'yr', 'dost', 'accha', 'achha', 'acha', 'theek', 'thik', 'thk', 'sahi',
      'galat', 'mast', 'badhiya', 'aur', 'lekin', 'magar', 'kal', 'aaj', 'aj', 'abhi', 'abhie', 'baad',
      'pehle', 'phir', 'fir', 'milte', 'milenge', 'milna', 'chalte', 'chalo', 'chal', 'chaloge', 'chale', 'aao', 'aaja',
      'aana', 'jaa', 'jana', 'jaoge', 'batao', 'bata', 'btao', 'bolo', 'suno', 'dekho', 'dekh', 'dekha',
      'kuch', 'kch', 'bohot', 'bahut', 'bht', 'zyada', 'jyada', 'woh', 'yeh',
      'tum', 'tumhara', 'tumhari', 'hum', 'hamara', 'main', 'mai', 'mera', 'meri', 'mere', 'tera', 'teri', 'tere',
      'uska', 'uski', 'uske', 'apna', 'apni', 'apne', 'khana', 'peena', 'karna', 'karo', 'karega', 'karegi',
      'hoga', 'hogi', 'honge', 'raha', 'rahi', 'rahe', 'rha', 'rhi', 'rhe', 'wala', 'wali', 'wale', 'shukriya',
      'dhanyavaad', 'namaste', 'samajh', 'smjh', 'pata', 'pta', 'lagta', 'lagti', 'bilkul', 'pakka', 'matlab', 'mtlb',
      'scene', 'arre', 'arrey', 'arey', 'oye', 'chup', 'chahiye', 'sirf', 'toh', 'bhi', 'mein',
      'vibe', 'haal', 'sachi', 'sach'
    ]);
    
    if (hasDevanagari && hasEnglish) return 'hinglish';
    if (hasDevanagari) return 'hindi';
    
    // Check words in text
    const words = lowerText.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    if (words.length === 0) return 'english';

    let hindiWordCount = 0;
    for (const w of words) {
      if (hindiWords.has(w)) {
        hindiWordCount++;
      }
    }
    
    const hindiRatio = hindiWordCount / words.length;
    
    // If text has any Hindi word in short messages, or >= 15% in longer messages
    if (hindiWordCount >= 1 && (words.length <= 4 || hindiRatio >= 0.15)) {
      return 'hinglish';
    }
    
    return 'english';
  }

  /**
   * Check cache for a previous response
   */
  _getCached(message) {
    const key = message.trim().toLowerCase();
    const cached = this._cache.get(key);
    if (!cached) return null;
    
    // Check if cache entry is expired
    if (Date.now() - cached.timestamp > this._cacheMaxAge) {
      this._cache.delete(key);
      return null;
    }
    
    console.log('📦 Cache hit! Returning cached suggestions.');
    return cached.suggestions;
  }

  /**
   * Store response in cache
   */
  _setCache(message, suggestions) {
    const key = message.trim().toLowerCase();
    
    // Evict oldest entries if cache is full
    if (this._cache.size >= this._cacheMaxSize) {
      const oldest = this._cache.keys().next().value;
      this._cache.delete(oldest);
    }
    
    this._cache.set(key, { suggestions, timestamp: Date.now() });
  }

  /**
   * Fetch with retry + exponential backoff for 429 / 503 / temporary errors
   */
  async _fetchWithRetry(url, options, retries = 3, baseDelay = 2000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const response = await fetch(url, options);
      
      if ((response.status === 429 || response.status === 503 || response.status === 500) && attempt < retries) {
        // Extract retry delay from response if available
        const data = await response.json().catch(() => ({}));
        const retryInfo = data.error?.details?.find(d => d.retryDelay);
        const serverDelay = retryInfo?.retryDelay 
          ? parseFloat(retryInfo.retryDelay) * 1000 
          : null;
        
        const waitTime = serverDelay || (baseDelay * Math.pow(2, attempt));
        console.log(`⚠️ HTTP ${response.status}. Retry ${attempt + 1}/${retries} in ${(waitTime/1000).toFixed(1)}s...`);
        await new Promise(res => setTimeout(res, waitTime));
        continue;
      }
      
      return response;
    }
  }

  async generateSuggestions(userMessage, options = {}) {
    this._initialize();

    const {
      tonePreference = 'auto',
      contextMessages = [],
      userId = 'anonymous'
    } = options;

    // Check cache first — avoids unnecessary API calls
    const cached = this._getCached(userMessage);
    if (cached) {
      return {
        success: true,
        suggestions: cached,
        metadata: {
          language: this.detectLanguage(userMessage),
          userId,
          timestamp: new Date().toISOString(),
          model: 'gemini-2.5-flash-lite',
          cached: true
        }
      };
    }

    const language = this.detectLanguage(userMessage);

    let contextStr = '';
    if (contextMessages.length > 0) {
      contextStr = 'Previous conversation:\n' +
        contextMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n') +
        '\n\n';
    }

    // Build a strong language instruction
    let langInstruction;
    if (language === 'hinglish') {
      langInstruction = `CRITICAL LANGUAGE REQUIREMENT:
The incoming message is in Hinglish (Hindi words mixed with English in Roman / English alphabets).
ALL 7 REPLY SUGGESTIONS MUST BE 100% IN NATURAL HINGLISH (Roman script).
Do NOT reply in pure English. Use natural Desi texting words (e.g., "haan bhai", "chalega yaar", "scene set hai", "aaj nahi ho payega", "theek hai").`;
    } else if (language === 'hindi') {
      langInstruction = `CRITICAL LANGUAGE REQUIREMENT:
The incoming message is in Hindi (Devanagari script).
ALL 7 REPLY SUGGESTIONS MUST BE IN NATURAL HINDI (Devanagari script).
Do NOT reply in English.`;
    } else {
      langInstruction = 'Language: Reply in English, matching the conversational language of the incoming message.';
    }

    const prompt = `${contextStr}User received this text message: "${userMessage}"

${langInstruction}

You are an expert messaging assistant generating ultra-human, realistic chat suggestions for WhatsApp/Instagram.
Generate exactly 7 distinct reply suggestions matching the specified language:

1. Gen Z: Effortless modern slang, lowercase vibe, nonchalant (e.g. "bet", "lowkey real", "scene sorted hai bro", "full vibe").
2. Sarcastic: Witty, playful banter, dry humor, light teasing.
3. Sweet: Warm, genuine, polite, caring.
4. Professional: Courteous, articulate, well-mannered.
5. Decline: Natural, polite way to say no or disagree.
6. Quick Reply: Extremely short, punchy (1 to 4 words max).
7. Playful: Charming, witty, flirtatious/romantic rizz or poetic shayari vibe.

HUMANIZATION & TEXTING GUIDELINES:
- Write exactly how real humans text their friends/colleagues on mobile.
- Use emojis only when natural (0 or 1 per suggestion).
- Avoid ending casual texts with periods — real people do not put full stops on short texts.
- If the incoming message is simple or short (e.g. "kya haal", "hi", "kaisa hai"), give natural conversational replies without making up fake complex stories.
- STRICT RULE: Every single suggestion MUST be in the target language (Hinglish/Hindi/English).

Output ONLY a valid JSON array of objects.

JSON Format:
[{"text":"...","tone":"genz","label":"Gen Z"}, {"text":"...","tone":"sarcastic","label":"Sarcastic"}, {"text":"...","tone":"sweet","label":"Sweet"}, {"text":"...","tone":"professional","label":"Professional"}, {"text":"...","tone":"decline","label":"Decline"}, {"text":"...","tone":"quick","label":"Quick Reply"}, {"text":"...","tone":"playful","label":"Playful"}]`;

    try {
      const response = await this._fetchWithRetry(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      // Extract text — skip "thinking" parts (thought: true)
      console.log('RAW API DATA CANDIDATE 0:', JSON.stringify(data.candidates?.[0], null, 2));
      const parts = data.candidates?.[0]?.content?.parts || [];
      const responseText = parts.filter(p => p.text && !p.thought).map(p => p.text).join('').trim();

      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      const suggestions = this._extractJSON(responseText);

      // Cache the successful response
      this._setCache(userMessage, suggestions);

      return {
        success: true,
        suggestions,
        metadata: { language, userId, timestamp: new Date().toISOString(), model: 'gemini-2.5-flash-lite' }
      };

    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return {
        success: false,
        error: error.message,
        suggestions: this.getFallbackSuggestions(userMessage, language)
      };
    }
  }

  _extractJSON(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      const startIdx = text.indexOf('[');
      const endIdx = text.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        return JSON.parse(text.substring(startIdx, endIdx + 1));
      }
      console.error('RAW BAD TEXT:', text);
      throw new Error(`No JSON array found in response`);
    }
  }

  getFallbackSuggestions(message, language) {
    const fallbacks = {
      english: [
        { text: "Bet, say less!", tone: "genz", label: "Gen Z" },
        { text: "Groundbreaking, truly.", tone: "sarcastic", label: "Sarcastic" },
        { text: "Aww thank you so much! 😊", tone: "sweet", label: "Sweet" },
        { text: "Thank you for the update. I appreciate it.", tone: "professional", label: "Professional" },
        { text: "I won't be able to make it this time.", tone: "decline", label: "Decline" },
        { text: "Sounds good!", tone: "quick", label: "Quick Reply" },
        { text: "You always know how to make my day ✨", tone: "playful", label: "Playful" }
      ],
      hindi: [
        { text: "Bilkul scene set hai bro!", tone: "genz", label: "Gen Z" },
        { text: "Wah, kya baat hai!", tone: "sarcastic", label: "Sarcastic" },
        { text: "बहुत-बहुत धन्यवाद! 😊", tone: "sweet", label: "Sweet" },
        { text: "आपका संदेश मिल गया, धन्यवाद।", tone: "professional", label: "Professional" },
        { text: "माफ़ कीजियेगा, मैं इस बार नहीं आ पाऊंगा।", tone: "decline", label: "Decline" },
        { text: "ठीक है!", tone: "quick", label: "Quick Reply" },
        { text: "आपकी बात में अलग ही बात है ✨", tone: "playful", label: "Playful" }
      ],
      hinglish: [
        { text: "No cap, full vibe hai!", tone: "genz", label: "Gen Z" },
        { text: "Kya baat hai, award milega!", tone: "sarcastic", label: "Sarcastic" },
        { text: "Aww thanks yaar! 😊", tone: "sweet", label: "Sweet" },
        { text: "Thank you, message mil gaya.", tone: "professional", label: "Professional" },
        { text: "Sorry yaar, iss baar nahi ho payega.", tone: "decline", label: "Decline" },
        { text: "Haan bhai!", tone: "quick", label: "Quick Reply" },
        { text: "Aapka message dekh ke smile aa gayi ✨", tone: "playful", label: "Playful" }
      ]
    };
    return fallbacks[language] || fallbacks.english;
  }
}

module.exports = new GeminiService();
