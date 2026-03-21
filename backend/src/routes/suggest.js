const express = require('express');
const rateLimit = require('express-rate-limit');
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
 * POST /api/suggest
 * Generate AI response suggestions
 */
router.post('/', suggestLimiter, async (req, res) => {
  try {
    const { 
      message, 
      contextMessages = [],
      userId = 'anonymous',
      userTier = 'free'
    } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        error: 'Message too long (max 1000 characters)' 
      });
    }

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
