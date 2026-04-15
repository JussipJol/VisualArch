import OpenAI from 'openai';
import { IAIProvider, AIRole, StreamCallbacks } from '../ai.types';

export class OpenAICompatibleProvider implements IAIProvider {
  private client: OpenAI;
  public name: string;
  private defaultModel: string;

  constructor(name: string, apiKey: string, baseURL: string, defaultModel: string) {
    this.name = name;
    this.client = new OpenAI({ apiKey, baseURL });
    this.defaultModel = defaultModel;
  }

  async complete(role: AIRole, options?: { jsonMode?: boolean; model?: string }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options?.model || this.defaultModel,
      messages: [
        { role: 'system', content: role.system },
        { role: 'user', content: role.user },
      ],
      response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
      temperature: options?.jsonMode ? 0.2 : 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  async stream(role: AIRole, callbacks: StreamCallbacks, options?: { jsonMode?: boolean; model?: string }): Promise<void> {
    const stream = await this.client.chat.completions.create({
      model: options?.model || this.defaultModel,
      messages: [
        { role: 'system', content: role.system },
        { role: 'user', content: role.user },
      ],
      response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
      stream: true,
      temperature: options?.jsonMode ? 0.2 : 0.7,
    });

    let fullText = '';
    try {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          fullText += text;
          callbacks.onChunk(text);
        }
      }
      callbacks.onComplete?.(fullText);
    } catch (error) {
      callbacks.onError?.(error);
      throw error;
    }
  }
}
