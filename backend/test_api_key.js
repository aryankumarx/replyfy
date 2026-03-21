/**
 * Quick test script to verify your Gemini API key works.
 * Run:  node test_api_key.js
 */
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in .env file!');
  process.exit(1);
}

console.log(`🔑 Testing API key: ${API_KEY.substring(0, 12)}...`);
console.log('⏳ Sending test request to Gemini...\n');

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: 'Say "hello" in one word.' }] }]
  })
})
.then(res => res.json())
.then(data => {
  if (data.error) {
    console.error('❌ API ERROR:');
    console.error(`   Code: ${data.error.code}`);
    console.error(`   Status: ${data.error.status}`);
    console.error(`   Message: ${data.error.message}`);
    
    if (data.error.code === 429) {
      console.error('\n💡 FIX: Your API key has zero quota. Try these steps:');
      console.error('   1. Go to https://aistudio.google.com/apikey');
      console.error('   2. DELETE the current key');
      console.error('   3. Click "Create API key in new project"');
      console.error('   4. Make sure you are NOT on a Google Workspace account');
      console.error('   5. Use a regular @gmail.com account');
    } else if (data.error.code === 400) {
      console.error('\n💡 FIX: API key may be invalid. Generate a new one.');
    } else if (data.error.code === 403) {
      console.error('\n💡 FIX: API is not enabled for this project.');
      console.error('   Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      console.error('   and click "Enable".');
    }
  } else {
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('✅ SUCCESS! Gemini replied:', reply?.trim());
    console.log('\n🎉 Your API key is working perfectly!');
    console.log('   You can now run: npm run dev');
  }
})
.catch(err => {
  console.error('❌ Network error:', err.message);
});
