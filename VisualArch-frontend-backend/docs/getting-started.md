# 🚀 Getting Started - Flactuation quantumv1.0

This guide will walk you through setting up your local environment for the **Flactuation** project.

---

## 🛑 Prerequisites

- **Node.js**: v20 or higher.
- **Package Manager**: `npm` (v10+).
- **Database**: MongoDB (Local or Atlas Atlas URI).
- **AI Keys**: (At least one)
    - [OpenRouter](https://openrouter.ai/) (Recommended - covers Anthropic, OpenAI, etc.)
    - [Groq](https://groq.com/) (Ultra-fast - covers Llama 3)
    - [Google AI Studio](https://aistudio.google.com/) (Gemini-1.5-Pro)
    - [Cerebras](https://cerebras.ai/) (Llama-3.1-8B)

---

## 📥 1. Installation

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/flactuation.git
cd flactuation
```

### 2. Configure Backend ENV
Navigate to `visualflow-backend` and create a `.env` file:
```bash
cd visualflow-backend
cp .env.example .env
```

**Key Environment Variables:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/flactuation
JWT_SECRET=your_secret_here

# AI Provider Keys
OPENROUTER_API_KEY=sk-or-...
GROQ_API_KEY=gsk-...
GEMINI_API_KEY=...
CEREBRAS_API_KEY=...
```

### 3. Install Dependencies
Install both backend and frontend dependencies:
```bash
# Backend
cd visualflow-backend && npm install

# Frontend 
cd ../Flactuation-frontend && npm install
```

---

## ⚡ 2. Running the Application

### Launch Backend
```bash
cd visualflow-backend
npm run dev
```
Wait to see `[SERVER] Running on http://localhost:3001` and `[DB] MongoDB connected`.

### Launch Frontend
```bash
cd Flactuation-frontend
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🐞 3. Troubleshooting

- **CORS Errors**: Ensure your frontend port (usually 5173) is listed in `allowedOrigins` in `server.ts`.
- **AI Quotas**: If you see `429 Too Many Requests` in the backend logs, the "Quantum Orchestrator" will automatically attempt fallbacks, but verify your API credits.
- **Port Conflicts**: If port 3001 is busy, use `npx kill-port 3001` and restart.

---
*Back to [Documentation Suite](./architecture.md)*
