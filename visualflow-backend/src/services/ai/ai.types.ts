export enum AIModule {
  PLANNER = 'PLANNER',
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  WRITER = 'WRITER',
  DESIGNER = 'DESIGNER',
  BLUEPRINT = 'BLUEPRINT',
  GENERAL = 'GENERAL',
}

export interface AIRole {
  system: string;
  user: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: any) => void;
}

export interface IAIProvider {
  name: string;
  complete(role: AIRole, options?: { jsonMode?: boolean; model?: string }): Promise<string>;
  stream(role: AIRole, callbacks: StreamCallbacks, options?: { jsonMode?: boolean; model?: string }): Promise<void>;
}
