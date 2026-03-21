const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
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
    const {
      tonePreference = 'auto',
      contextMessages = [],
      userId = 'anonymous'
    } = options;

    const language = this.detectLanguage(userMessage);
    
    // Build context from previous messages if provided
    let contextStr = '';
    if (contextMessages.length > 0) {
      contextStr = 'Previous conversation:\n' + 
        contextMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n') + 
        '\n\n';
    }

    const prompt = `${contextStr}User received this message: "${userMessage}"

Generate exactly 3 contextually appropriate response suggestions with different tones:
1. Casual/friendly tone
2. Professional/polite tone
3. Brief/direct tone

Important guidelines:
- Match the language style of the input (${language === 'hinglish' ? 'mix Hindi and English naturally' : language === 'hindi' ? 'respond in Hindi' : 'respond in English'})
- Keep each suggestion under 100 characters
- Make them natural and conversational
- Consider the context and sentiment

Return ONLY a JSON array with this exact format:
[
  {
    "text": "suggestion text here",
    "tone": "casual",
    "label": "Friendly & warm"
  },
  {
    "text": "suggestion text here",
    "tone": "professional",
    "label": "Polite & formal"
  },
  {
    "text": "suggestion text here",
    "tone": "brief",
    "label": "Short & direct"
  }
]`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const responseText = message.content[0].text;
      
      // Clean and parse JSON response
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const suggestions = JSON.parse(cleanedResponse);

      // Validate response structure
      if (!Array.isArray(suggestions) || suggestions.length !== 3) {
        throw new Error('Invalid response format from AI');
      }

      return {
        success: true,
        suggestions,
        metadata: {
          language,
          userId,
          timestamp: new Date().toISOString(),
          model: 'claude-sonnet-4'
        }
      };

    } catch (error) {
      console.error('Claude API Error:', error);
      
      // Return fallback suggestions if AI fails
      return {
        success: false,
        error: error.message,
        suggestions: this.getFallbackSuggestions(userMessage, language)
      };
    }
  }

  /**
   * Fallback suggestions when AI fails
   */
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

module.exports = new ClaudeService();
