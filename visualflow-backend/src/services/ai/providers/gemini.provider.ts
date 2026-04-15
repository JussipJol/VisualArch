import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIProvider, AIRole, StreamCallbacks } from '../ai.types';
import { config } from '../../../config/env';

export class GeminiProvider implements IAIProvider {
  name = 'Gemini';
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  async complete(role: AIRole, options?: { jsonMode?: boolean; model?: string }): Promise<string> {
    const model = this.genAI.getGenerativeModel({ 
      model: options?.model || 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: options?.jsonMode ? 'application/json' : 'text/plain',
      }
    });

    const result = await model.generateContent([
      { text: `${role.system}\n\n${role.user}` }
    ]);
    const response = await result.response;
    return response.text();
  }

  async stream(role: AIRole, callbacks: StreamCallbacks, options?: { jsonMode?: boolean; model?: string }): Promise<void> {
    const model = this.genAI.getGenerativeModel({ 
      model: options?.model || 'gemini-2.0-pro',
      generationConfig: {
        responseMimeType: options?.jsonMode ? 'application/json' : 'text/plain',
      }
    });

    const result = await model.generateContentStream([
      { text: `${role.system}\n\n${role.user}` }
    ]);

    let fullText = '';
    try {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullText += text;
        callbacks.onChunk(text);
      }
      callbacks.onComplete?.(fullText);
    } catch (error) {
      callbacks.onError?.(error);
      throw error;
    }
  }
}
