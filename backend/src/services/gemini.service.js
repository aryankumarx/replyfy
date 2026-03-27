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
    // gemini-2.5-flash-lite has the highest free tier quota (~30-60 RPM)
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${this.apiKey}`;
    this._initialized = true;
    console.log('✅ Gemini service initialized (model: gemini-2.5-flash-lite)');
  }

  detectLanguage(text) {
    const lowerText = text.toLowerCase();
    
    // Check for Devanagari script (proper Hindi)
    const hindiChars = /[\u0900-\u097F]/;
    const hasDevanagari = hindiChars.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    
    // Common Hindi/Hinglish words written in Roman script
    const hindiWords = [
      'hai', 'hain', 'kya', 'kaise', 'kab', 'kahan', 'kyun', 'kyu',
      'nahi', 'nahin', 'mat', 'mujhe', 'tumhe', 'aapko', 'unko',
      'bhai', 'yaar', 'dost', 'bro', 'accha', 'achha', 'theek',
      'thik', 'haan', 'ji', 'aur', 'lekin', 'par', 'magar',
      'kal', 'aaj', 'abhi', 'baad', 'pehle', 'phir',
      'milte', 'milenge', 'chalte', 'chalo', 'chal', 'batao',
      'bata', 'bol', 'bolo', 'sun', 'suno', 'dekho', 'dekh',
      'kaisa', 'kaisi', 'kuch', 'bohot', 'bahut', 'zyada',
      'kam', 'sab', 'koi', 'woh', 'yeh', 'tum', 'hum', 'main',
      'mera', 'tera', 'uska', 'apna', 'khana', 'jana', 'aana',
      'karna', 'hoga', 'hogi', 'raha', 'rahi', 'wala', 'wali',
      'shukriya', 'dhanyavaad', 'namaste', 'padhna', 'likhna',
      'samajh', 'pata', 'lagta', 'lagti', 'bilkul', 'pakka',
      'matlab', 'scene', 'scene kya hai', 'arre', 'oye', 'chup'
    ];
    
    // Count how many Hindi words appear in the text
    const words = lowerText.split(/\s+/);
    const hindiWordCount = words.filter(w => hindiWords.includes(w.replace(/[.,!?]/g, ''))).length;
    const hindiRatio = hindiWordCount / Math.max(words.length, 1);
    
    if (hasDevanagari && hasEnglish) return 'hinglish';
    if (hasDevanagari) return 'hindi';
    
    // If 20%+ of words are Hindi (written in Roman), it's Hinglish
    if (hindiRatio >= 0.2) return 'hinglish';
    
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
   * Fetch with retry + exponential backoff for 429 errors
   */
  async _fetchWithRetry(url, options, retries = 3, baseDelay = 2000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const response = await fetch(url, options);
      
      if (response.status === 429 && attempt < retries) {
        // Extract retry delay from response if available
        const data = await response.json().catch(() => ({}));
        const retryInfo = data.error?.details?.find(d => d.retryDelay);
        const serverDelay = retryInfo?.retryDelay 
          ? parseFloat(retryInfo.retryDelay) * 1000 
          : null;
        
        const waitTime = serverDelay || (baseDelay * Math.pow(2, attempt));
        console.log(`⚠️ Rate limited (429). Retry ${attempt + 1}/${retries} in ${(waitTime/1000).toFixed(1)}s...`);
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
      langInstruction = `CRITICAL: The user is writing in Hinglish (mix of Hindi + English using Roman script).
You MUST reply in the SAME Hinglish style. Mix Hindi and English words naturally.
Example Hinglish replies: "Haan bhai, done!", "Theek hai, kal milte hain", "Sure yaar, no problem!"
Do NOT reply in pure English. Match the user's language style exactly.`;
    } else if (language === 'hindi') {
      langInstruction = `CRITICAL: The user is writing in Hindi.
You MUST reply in Hindi (Devanagari script).
Example: "हाँ भाई, ठीक है!", "कल मिलते हैं"
NEVER reply in English.`;
    } else {
      langInstruction = 'Reply in English.';
    }

    const prompt = `${contextStr}User received this message: "${userMessage}"

${langInstruction}

Generate exactly 4 reply suggestions that sound EXTREMELY human, engaging, and interesting:
1. Casual (Warm, super friendly, engaging. Include a matching emoji! 🌟)
2. Witty / Fun (A clever, slightly humorous, or charming comeback. Make them smile!)
3. Direct (Clear and straight to the point, but NOT robotic. Real-human tone.)
4. Quick (1-3 words ONLY. Extremely casual, like "Haha nice", "For sure!", or "Done bro")

IMPORTANT - BE EXTREMELY HUMAN AND ENGAGING:
- Write exactly like an interesting, fun person texting on WhatsApp or Instagram.
- NEVER use generic robotic AI phrases (like "I would be happy to" or "Yes, I agree").
- Use modern texting style. Lowercase at the start is fine.
- NO unnecessary punctuation. Real people text "Yeah that sounds good" not "Yes, that sounds good."
- Add emojis naturally to make the replies feel alive and expressive! ✨
- Match the EXACT language style of the incoming message. If they sound hype, match the energy!
- Max 100 characters for suggestions 1-3.
- Output ONLY the JSON array.

JSON Format:
[{"text":"...","tone":"casual","label":"Friendly"}, {"text":"...","tone":"witty","label":"Witty"}, {"text":"...","tone":"direct","label":"Direct"}, {"text":"...","tone":"quick","label":"Quick Reply"}]`;

    try {
      const response = await this._fetchWithRetry(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      // Extract text — skip "thinking" parts (thought: true)
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
      throw new Error(`No JSON array found in response`);
    }
  }

  getFallbackSuggestions(message, language) {
    const fallbacks = {
      english: [
        { text: "Thanks for letting me know!", tone: "casual", label: "Friendly" },
        { text: "I appreciate the message.", tone: "professional", label: "Polite" },
        { text: "Got it, thanks!", tone: "brief", label: "Short" },
        { text: "Ok!", tone: "quick", label: "Quick Reply" }
      ],
      hindi: [
        { text: "धन्यवाद! मुझे बता दिया।", tone: "casual", label: "मित्रवत" },
        { text: "आपका संदेश मिल गया।", tone: "professional", label: "विनम्र" },
        { text: "ठीक है, धन्यवाद!", tone: "brief", label: "संक्षिप्त" },
        { text: "ठीक है!", tone: "quick", label: "Quick Reply" }
      ],
      hinglish: [
        { text: "Thanks yaar! Noted.", tone: "casual", label: "Friendly" },
        { text: "Theek hai, message mil gaya.", tone: "professional", label: "Polite" },
        { text: "Ok noted!", tone: "brief", label: "Short" },
        { text: "Haan bhai!", tone: "quick", label: "Quick Reply" }
      ]
    };
    return fallbacks[language] || fallbacks.english;
  }
}

module.exports = new GeminiService();
