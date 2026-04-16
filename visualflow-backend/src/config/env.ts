import dotenv from 'dotenv';
dotenv.config();

// ─── Обязательные переменные ─────────────────────────────────────────────────

const required = [
  // Core
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',

  // AI providers
  'GROQ_API_KEY',
  'GEMINI_API_KEY',
  'CEREBRAS_API_KEY',
  'OPENROUTER_API_KEY',

  // URLs
  'BACKEND_URL',    
  'CLIENT_URL',    

  // OAuth
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// ─── Config object ────────────────────────────────────────────────────────────

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  mongoUri: process.env.MONGODB_URI!,

  // JWT
  jwtSecret:              process.env.JWT_SECRET!,
  jwtRefreshSecret:       process.env.JWT_REFRESH_SECRET!,
  jwtExpiresIn:           '15m',
  jwtRefreshExpiresIn:    '7d',

  // URLs
  backendUrl: process.env.BACKEND_URL!,   // <-- вот чего не хватало
  clientUrl:  process.env.CLIENT_URL!,

  // AI providers
  groqApiKey:        process.env.GROQ_API_KEY!,
  geminiApiKey:      process.env.GEMINI_API_KEY!,
  cerebrasApiKey:    process.env.CEREBRAS_API_KEY!,
  openRouterApiKey:  process.env.OPENROUTER_API_KEY!,

  // OAuth — GitHub
  githubClientId:     process.env.GITHUB_CLIENT_ID!,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET!,

  // OAuth — Google
  googleClientId:     process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,

  // OAuth — Discord
  discordClientId:     process.env.DISCORD_CLIENT_ID!,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET!,
} as const;