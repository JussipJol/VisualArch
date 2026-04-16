const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Placeholder
    // Actually the SDK doesn't have a direct listModels, we need to use the REST API or Vertex
    // But we can try a few names
    console.log("Testing models...");
  } catch (e) {
    console.error(e);
  }
}

listModels();
