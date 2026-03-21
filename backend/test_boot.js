require('dotenv').config();
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET (' + process.env.GEMINI_API_KEY.substring(0,10) + '...)' : 'NOT SET');

try {
  const suggestRoute = require('./src/routes/suggest');
  console.log('Routes loaded OK');
} catch (err) {
  console.error('CRASH ERROR:', err.message);
  console.error('Stack:', err.stack);
}
