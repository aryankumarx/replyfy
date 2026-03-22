const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const geminiService = require('../services/gemini.service');

const router = express.Router();

// In-memory storage for user usage (replace with Redis/DB in production)
const userUsage = new Map();

// Rate limiter specific to suggest endpoint
const suggestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: 'Too many AI requests, please slow down'
});

/**
 * Check daily usage limit
 */
function checkDailyLimit(userId, tier = 'free') {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}-${today}`;
  
  const limit = tier === 'free' 
    ? parseInt(process.env.FREE_TIER_DAILY_LIMIT || 20)
    : parseInt(process.env.PRO_TIER_DAILY_LIMIT || 1000);
  
  const usage = userUsage.get(key) || 0;
  
  return {
    allowed: usage < limit,
    used: usage,
    limit,
    remaining: Math.max(0, limit - usage)
  };
}

/**
 * Increment usage counter
 */
function incrementUsage(userId) {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}-${today}`;
  const current = userUsage.get(key) || 0;
  userUsage.set(key, current + 1);
}

/**
 * Middleware: Verify API Key
 * Ensures only our authorized apps (React Native, Web Demo) can use the backend
 */
function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.APP_API_KEY;

  if (!expectedKey) {
    // If no key is set in .env, just allow it (development mode fallback)
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing x-api-key header' });
  }

  next();
}

/**
 * POST /api/suggest
 * Generate AI response suggestions
 */
const suggestValidation = [
  body('message')
    .exists().withMessage('Message is required')
    .isString().withMessage('Message must be a string')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 1000 }).withMessage('Message too long (max 1000 characters)')
    .escape(), // Sanitizes HTML tags to prevent XSS
  body('userId').optional().isString().trim(),
  body('userTier').optional().isString().trim(),
  body('contextMessages').optional().isArray()
];

router.post('/', verifyApiKey, suggestLimiter, suggestValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }

  try {
    const { 
      message, 
      contextMessages = [],
      userId = 'anonymous',
      userTier = 'free'
    } = req.body;

    // Check daily limit
    const usageCheck = checkDailyLimit(userId, userTier);
    
    if (!usageCheck.allowed) {
      return res.status(429).json({
        error: 'Daily limit reached',
        usage: {
          used: usageCheck.used,
          limit: usageCheck.limit,
          remaining: 0
        },
        upgradeMessage: userTier === 'free' 
          ? 'Upgrade to Pro for unlimited suggestions!'
          : null
      });
    }

    // Generate suggestions using Gemini
    const result = await geminiService.generateSuggestions(message, {
      contextMessages,
      userId
    });

    // Increment usage counter only on success
    if (result.success) {
      incrementUsage(userId);
    }

    // Get updated usage after increment
    const updatedUsage = checkDailyLimit(userId, userTier);

    // Return suggestions with usage info
    res.json({
      success: result.success,
      suggestions: result.suggestions,
      usage: {
        used: updatedUsage.used,
        limit: updatedUsage.limit,
        remaining: updatedUsage.remaining
      },
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Suggest endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/suggest/usage/:userId
 * Check user's current usage
 */
router.get('/usage/:userId', (req, res) => {
  const { userId } = req.params;
  const { tier = 'free' } = req.query;
  
  const usageCheck = checkDailyLimit(userId, tier);
  
  res.json({
    userId,
    tier,
    usage: {
      used: usageCheck.used,
      limit: usageCheck.limit,
      remaining: usageCheck.remaining,
      resetTime: new Date().setHours(24, 0, 0, 0) // Midnight
    }
  });
});

/**
 * POST /api/suggest/test
 * Test endpoint (no rate limiting, no usage counting)
 */
router.post('/test', async (req, res) => {
  try {
    const { message = "Hey! How are you?" } = req.body;
    
    const result = await geminiService.generateSuggestions(message, {
      userId: 'test-user'
    });

    res.json({
      testMode: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
});

module.exports = router;
