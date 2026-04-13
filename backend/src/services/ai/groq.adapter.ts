import Groq from 'groq-sdk';

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

  async generateJson<T>(prompt: string, schema?: object, signal?: AbortSignal): Promise<T> {
    if (!this.client) throw new Error('Groq client not initialized');

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
