import Groq from 'groq-sdk';

const MOCK_DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

  async generateJson<T>(prompt: string, schema?: object, signal?: AbortSignal, retries = 3): Promise<T> {
    if (!this.client) throw new Error('Groq client not initialized');

    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        const completion = await this.client.chat.completions.create({
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
        }, { signal });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('AI returned empty response');

        return JSON.parse(content) as T;
      } catch (error: any) {
        lastError = error;
        // Don't retry if aborted or specific client errors
        if (error.name === 'AbortError' || error.status === 401 || error.status === 400) {
          throw error;
        }
        
        console.warn(`[Groq] Attempt ${i + 1} failed: ${error.message}. Retrying...`);
        // Exponential backoff
        await MOCK_DELAY(Math.pow(2, i) * 1000);
      }
    }

    throw lastError;
  }

  async generateText(prompt: string, signal?: AbortSignal, retries = 3): Promise<string> {
    if (!this.client) throw new Error('Groq client not initialized');

    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        const completion = await this.client.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are an expert DevOps engineer and architect.' },
            { role: 'user', content: prompt },
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.2,
        }, { signal });

        return completion.choices[0]?.message?.content || '';
      } catch (error: any) {
        lastError = error;
        if (error.name === 'AbortError' || error.status === 401 || error.status === 400) {
          throw error;
        }
        await MOCK_DELAY(Math.pow(2, i) * 1000);
      }
    }
    throw lastError;
  }

  async generateChat(messages: { role: 'user' | 'system' | 'assistant'; content: string }[], model = 'llama-3.1-8b-instant') {
    if (!this.client) throw new Error('Groq client not initialized');

    return this.client.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
    });
  }
}

export const groqAdapter = new GroqAdapter();
