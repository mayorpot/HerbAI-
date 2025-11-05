// backend/test-api.js
require('dotenv').config();

const OpenAI = require('openai');

async function testOpenAI() {
  console.log('🧪 Testing OpenAI API Connection...');
  console.log('API Key present:', !!process.env.OPENAI_API_KEY);
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ No API key found in .env file');
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('📤 Sending test request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test. Please respond with 'AI is working!'"
        }
      ],
      max_tokens: 50,
    });

    console.log('✅ OpenAI Response:', completion.choices[0].message.content);
    console.log('🎉 OpenAI API is working correctly!');
    
  } catch (error) {
    console.log('❌ OpenAI Test Failed:');
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testOpenAI();