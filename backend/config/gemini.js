// ============================================================
// QuizVerse AI — Google Gemini API Configuration
// ============================================================
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let genAI = null;

const getGeminiClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const getGeminiModel = (modelName = 'gemini-3.5-flash') => {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
};

module.exports = { getGeminiClient, getGeminiModel };
