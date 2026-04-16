import { useCallback, useRef } from 'react';

interface SSEOptions {
  onChunk?: (content: string) => void;
  onStatus?: (message: string) => void;
  onProgress?: (stage: string, file?: string) => void;
  onDone?: (data: Record<string, unknown>) => void;
  onError?: (message: string) => void;
}

export const useSSE = () => {
  const abortRef = useRef<(() => void) | null>(null);

  const stream = useCallback(
    async (url: string, body: Record<string, unknown>, opts: SSEOptions) => {
      const token = localStorage.getItem('accessToken');
      const controller = new AbortController();
      abortRef.current = () => controller.abort();

      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${baseUrl}${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6)) as Record<string, unknown>;
              if (data.type === 'chunk') opts.onChunk?.(data.content as string);
              else if (data.type === 'status') opts.onStatus?.(data.message as string);
              else if (data.type === 'progress') opts.onProgress?.(data.stage as string, data.file as string | undefined);
              else if (data.type === 'done') opts.onDone?.(data);
              else if (data.type === 'error') opts.onError?.(data.message as string);
            } catch { /* skip malformed */ }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          opts.onError?.(err.message);
        }
      }
    },
    []
  );

  const abort = useCallback(() => abortRef.current?.(), []);

  return { stream, abort };
};
