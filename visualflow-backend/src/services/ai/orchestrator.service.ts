import { AIModule, AIRole, IAIProvider, StreamCallbacks } from './ai.types';
import { GeminiProvider } from './providers/gemini.provider';
import { OpenAICompatibleProvider } from './providers/openai-compatible.provider';
import { config } from '../../config/env';

export class OrchestratorService {
  private providers: Record<string, IAIProvider> = {};
  
  // Define preferences for each module
  private modulePreferences: Record<AIModule, string[]> = {
    [AIModule.PLANNER]: ['Gemini', 'OpenRouter', 'LastResort'],
    [AIModule.BLUEPRINT]: ['Gemini', 'OpenRouter', 'LastResort'],
    [AIModule.DESIGNER]: ['OpenRouter', 'Gemini', 'LastResort'],
    [AIModule.FRONTEND]: ['Groq', 'Cerebras', 'OpenRouter', 'LastResort'],
    [AIModule.BACKEND]: ['Cerebras', 'Groq', 'OpenRouter', 'LastResort'],
    [AIModule.WRITER]: ['OpenRouter', 'Gemini', 'Groq', 'LastResort'],
    [AIModule.GENERAL]: ['Groq', 'Cerebras', 'OpenRouter', 'Gemini', 'LastResort'],
  };

  constructor() {
    this.providers['Gemini'] = new GeminiProvider();
    
    this.providers['Groq'] = new OpenAICompatibleProvider(
      'Groq',
      config.groqApiKey,
      'https://api.groq.com/openai/v1',
      'llama-3.3-70b-versatile'
    );

    this.providers['Cerebras'] = new OpenAICompatibleProvider(
      'Cerebras',
      config.cerebrasApiKey,
      'https://api.cerebras.ai/v1',
      'llama3.1-8b' // Using 8b for reliability, will fallback to Groq 70b if needed
    );

    this.providers['OpenRouter'] = new OpenAICompatibleProvider(
      'OpenRouter',
      config.openRouterApiKey,
      'https://openrouter.ai/api/v1',
      'anthropic/claude-3-5-sonnet' // Standard ID with hyphens
    );

    this.providers['LastResort'] = new OpenAICompatibleProvider(
      'OpenRouter',
      config.openRouterApiKey,
      'https://openrouter.ai/api/v1',
      'openai/gpt-4o-mini' // Ultra-reliable, low-cost final fallback
    );
  }

  // Helper to get specific models for high-quality tasks
  private getPremiumOpenRouter(model: string) {
    return new OpenAICompatibleProvider(
      'OpenRouter',
      config.openRouterApiKey,
      'https://openrouter.ai/api/v1',
      model
    );
  }

  async executeTask(
    module: AIModule,
    role: AIRole,
    options?: { jsonMode?: boolean }
  ): Promise<string> {
    const preferredProviders = this.modulePreferences[module];
    let lastError: any;

    for (const providerName of preferredProviders) {
      const provider = this.providers[providerName];
      if (!provider) continue;

      try {
        console.log(`[AI Orchestrator] Executing ${module} task using ${providerName}...`);
        return await provider.complete(role, options);
      } catch (error: any) {
        console.warn(`[AI Orchestrator] ${providerName} failed for ${module}: ${error.message}`);
        lastError = error;
        // Continue to next provider on rate limit (429) or other errors
      }
    }

    throw new Error(`All providers failed for ${module}. Last error: ${lastError?.message}`);
  }

  async executeStream(
    module: AIModule,
    role: AIRole,
    callbacks: StreamCallbacks,
    options?: { jsonMode?: boolean }
  ): Promise<void> {
    const preferredProviders = this.modulePreferences[module];
    let lastError: any;

    for (const providerName of preferredProviders) {
      const provider = this.providers[providerName];
      if (!provider) continue;

      try {
        console.log(`[AI Orchestrator] Streaming ${module} task using ${providerName}...`);
        await provider.stream(role, callbacks, options);
        return; // Success
      } catch (error: any) {
        console.warn(`[AI Orchestrator] ${providerName} streaming failed for ${module}: ${error.message}`);
        lastError = error;
      }
    }

    throw new Error(`All providers failed for streaming ${module}. Last error: ${lastError?.message}`);
  }
}

export const aiOrchestrator = new OrchestratorService();
