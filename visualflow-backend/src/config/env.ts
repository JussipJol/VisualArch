import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGODB_URI', 'GROQ_API_KEY', 'GEMINI_API_KEY', 'CEREBRAS_API_KEY', 'OPENROUTER_API_KEY', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  mongoUri: process.env.MONGODB_URI!,
  groqApiKey: process.env.GROQ_API_KEY!,
  geminiApiKey: process.env.GEMINI_API_KEY!,
  cerebrasApiKey: process.env.CEREBRAS_API_KEY!,
  openRouterApiKey: process.env.OPENROUTER_API_KEY!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtExpiresIn: '15m',
  jwtRefreshExpiresIn: '7d',
<<<<<<< HEAD
=======
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
>>>>>>> 48106fb (update project)
};
