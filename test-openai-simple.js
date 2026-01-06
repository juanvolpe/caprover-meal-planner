const OpenAI = require('openai');
const fs = require('fs');

// Simple .env parser
function loadEnv() {
  try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const lines = envFile.split('\n');
    lines.forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').replace(/"/g, '');
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (error) {
    console.log('No .env file found or error reading it');
  }
}

async function testOpenAI() {
  try {
    console.log('🔑 Testing OpenAI API connection...');
    
    loadEnv();
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      return;
    }
    
    console.log('✅ API Key found:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('🚀 Making simple test request to OpenAI...');
    
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'Hello! OpenAI is working!' in exactly 5 words."
        }
      ],
      max_tokens: 20,
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('✅ OpenAI Response:');
    console.log(completion.choices[0].message.content);
    console.log(`⏱️  Response time: ${duration} seconds`);
    console.log('🎉 OpenAI connection is working!');
    
  } catch (error) {
    console.error('❌ Error testing OpenAI:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.status) {
      console.error('HTTP status:', error.status);
    }
    
    if (error.type) {
      console.error('Error type:', error.type);
    }
  }
}

testOpenAI();
