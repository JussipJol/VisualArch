const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('va_token', token);
      else localStorage.removeItem('va_token');
    }
  }

  getToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('va_token');
    }
    return null;
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });

    if (res.status === 401) {
      // Never attempt auto-refresh for auth endpoints themselves — it creates cascading 401s
      const isAuthEndpoint = path.startsWith('/api/auth/');
      if (!isAuthEndpoint) {
        try {
          const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST', credentials: 'include',
          });
          if (refreshRes.ok) {
            const { accessToken } = await refreshRes.json();
            this.setToken(accessToken);
            headers['Authorization'] = `Bearer ${accessToken}`;
            const retryRes = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
            if (!retryRes.ok) {
              const body = await retryRes.json().catch(() => ({ error: 'Request failed' }));
              throw new Error(body.error ?? 'Request failed');
            }
            return retryRes.json();
          }
        } catch (refreshErr) {
          // If the error is from the retry, re-throw it
          if (refreshErr instanceof Error && refreshErr.message !== 'Request failed') throw refreshErr;
        }
      }
      this.setToken(null);
      const body = await res.json().catch(() => ({ error: 'Unauthorized' }));
      throw new Error(body.error ?? 'Unauthorized');
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(body.error ?? 'Request failed');
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(path: string) { return this.fetch<T>(path); }
  post<T>(path: string, body?: unknown) { return this.fetch<T>(path, { method: 'POST', body: JSON.stringify(body) }); }
  patch<T>(path: string, body: unknown) { return this.fetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); }
  put<T>(path: string, body: unknown) { return this.fetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }); }
  delete<T>(path: string) { return this.fetch<T>(path, { method: 'DELETE' }); }

  // SSE stream for generation
  async *stream(path: string, body: unknown): AsyncGenerator<{ event: string; data: Record<string, unknown> }> {
    const token = this.getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok || !res.body) {
      const body = await res.json().catch(() => ({ error: 'Stream failed' }));
      throw new Error(body.error ?? 'Stream failed');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let currentEvent = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            yield { event: currentEvent, data };
            currentEvent = '';
          } catch { /* skip malformed */ }
        }
      }
    }
  }
}

export const api = new ApiClient();
