const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There is no direct listModels in the browser SDK, but we can try to hit the endpoint or just try a few common names.
    console.log("Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hi");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
    try {
      console.log("Testing gemini-pro...");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hi");
      console.log("Success with gemini-pro");
    } catch (e2) {
      console.error("Failed with gemini-pro:", e2.message);
    }
  }
}

listModels();
