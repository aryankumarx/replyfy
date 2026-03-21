const fs = require('fs');
const path = require('path');

/**
 * Gemini Service - Uses REST API directly for maximum compatibility
 */

class GeminiService {
  constructor() {
    this.apiKey = null;
    this.apiUrl = null;
    this._initialized = false;
  }

  /**
   * Lazy initialization - only set up when first needed
   */
  _initialize() {
    if (this._initialized) return;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables. Add it to your .env file.');
    }

    this.apiKey = process.env.GEMINI_API_KEY;
    // Use gemini-2.5-flash (30 RPM, 1000 RPD)
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
    this._initialized = true;
    console.log('✅ Gemini service initialized successfully');
  }

  /**
   * Detect language mix in message (English, Hindi, Hinglish)
   */
  detectLanguage(text) {
    const hindiChars = /[\u0900-\u097F]/;
    const hasHindi = hindiChars.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    if (hasHindi && hasEnglish) return 'hinglish';
    if (hasHindi) return 'hindi';
    return 'english';
  }

  /**
   * Generate AI suggestions for a given message
   */
  async generateSuggestions(userMessage, options = {}) {
    this._initialize();

    const {
      tonePreference = 'auto',
      contextMessages = [],
      userId = 'anonymous'
    } = options;

    const language = this.detectLanguage(userMessage);

    let contextStr = '';
    if (contextMessages.length > 0) {
      contextStr = 'Previous conversation:\n' +
        contextMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n') +
        '\n\n';
    }

    const prompt = `${contextStr}User received this message: "${userMessage}"

Generate Exactly 3 response options with these tones:
1. Casual (friendly/warm)
2. Professional (polite/formal)
3. Brief (short/direct)

Rules:
- Language: ${language === 'hinglish' ? 'Mix Hindi and English' : language === 'hindi' ? 'Hindi' : 'English'}
- Max 100 characters per suggestion.
- Output ONLY the JSON array. No thinking, no text before/after.

JSON Format:
[
  {"text": "...", "tone": "casual", "label": "Friendly"},
  {"text": "...", "tone": "professional", "label": "Polite"},
  {"text": "...", "tone": "brief", "label": "Short"}
]`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            responseMimeType: "application/json" // Force JSON output
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      // Extract text - skip "thinking" parts
      const parts = data.candidates?.[0]?.content?.parts || [];
      const responseText = parts.filter(p => p.text && !p.thought).map(p => p.text).join('').trim();

      // DEBUG: Log response for troubleshooting
      fs.writeFileSync(path.join(__dirname, '../../last_gemini_raw.txt'), responseText);

      if (!responseText) {
        throw new Error('Empty response from Gemini API');
      }

      const suggestions = this._extractJSON(responseText);

      return {
        success: true,
        suggestions,
        metadata: { language, userId, timestamp: new Date().toISOString(), model: 'gemini-2.5-flash' }
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
      // 1. Basic try-parse
      return JSON.parse(text);
    } catch (e) {
      // 2. Extract array from within fences or text
      const startIdx = text.indexOf('[');
      const endIdx = text.lastIndexOf(']');
      
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        try {
          const raw = text.substring(startIdx, endIdx + 1);
          return JSON.parse(raw);
        } catch (innerE) {
          throw new Error(`JSON format issue: ${innerE.message}`);
        }
      }
      throw new Error(`No JSON array found: ${text.substring(0, 50)}...`);
    }
  }

  getFallbackSuggestions(message, language) {
    const fallbacks = {
      english: [
        { text: "Thanks for letting me know!", tone: "casual", label: "Friendly" },
        { text: "I appreciate the message.", tone: "professional", label: "Polite" },
        { text: "Got it, thanks!", tone: "brief", label: "Quick" }
      ],
      hindi: [
        { text: "धन्यवाद! मुझे बता दिया।", tone: "casual", label: "मित्रवत" },
        { text: "आपका संदेश मिल गया।", tone: "professional", label: "विनम्र" },
        { text: "ठीक है, धन्यवाद!", tone: "brief", label: "संक्षिप्त" }
      ],
      hinglish: [
        { text: "Thanks yaar! Noted.", tone: "casual", label: "Friendly" },
        { text: "Theek hai, message mil gaya.", tone: "professional", label: "Polite" },
        { text: "Ok thanks!", tone: "brief", label: "Quick" }
      ]
    };
    return fallbacks[language] || fallbacks.english;
  }
}

module.exports = new GeminiService();
