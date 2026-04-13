import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function isRetryableError(error: unknown): boolean {
  if (error instanceof Groq.APIError) {
    return error.status === 429 || error.status === 503;
  }
  return false;
}

async function withRetry<T>(fn: () => Promise<T>, signal?: AbortSignal): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (signal?.aborted) throw error;
      if (!isRetryableError(error)) throw error;

      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      const status = error instanceof Groq.APIError ? error.status : 'unknown';
      console.warn(`[GroqAdapter] Attempt ${attempt + 1} failed (${status}), retrying in ${delay}ms...`);
    }
  }

  throw lastError;
}

export class GroqAdapter {
  private client: Groq | null = null;

  constructor() {
    if (GROQ_API_KEY) {
      this.client = new Groq({ apiKey: GROQ_API_KEY });
    }
  }

  get isEnabled(): boolean {
    return !!this.client;
  }

  async generateJson<T>(prompt: string, schema?: object, signal?: AbortSignal): Promise<T> {
    if (!this.client) throw new Error('Groq client not initialized');

    const result = await withRetry(() =>
      this.client!.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert software architect. You always respond in valid JSON format.' +
                     (schema ? ` Your response must match this schema: ${JSON.stringify(schema)}` : ''),
          },
          { role: 'user', content: prompt },
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }, { signal })
    , signal);

    const content = result.choices[0]?.message?.content;
    if (!content) throw new Error('AI returned empty response');

    return JSON.parse(content) as T;
  }

  async generateChat(messages: { role: 'user' | 'system' | 'assistant'; content: string }[], model = 'llama-3.1-8b-instant') {
    if (!this.client) throw new Error('Groq client not initialized');

    return withRetry(() =>
      this.client!.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
      })
    );
  }
}

export const groqAdapter = new GroqAdapter();