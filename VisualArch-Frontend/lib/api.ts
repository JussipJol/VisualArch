/**
 * Centralized API client for VisualArch frontend.
 * Handles auth headers, error parsing, and typed responses.
 */

// ─── Base ──────────────────────────────────────────────────────
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error ?? body?.message ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Types ─────────────────────────────────────────────────────
export interface Workspace {
  workspace_id: string;
  name: string;
  context_theme: string;
  settings: { primary_color: string; framework: string };
  architecture_data?: ArchitectureData;
}

export interface ArchitectureData {
  nodes: ArchNode[];
  edges: ArchEdge[];
  iteration: number;
  full_context_summary: string;
  tech_stack?: string[];
  file_tree?: string[];
  last_prompt?: string;
  generated_at?: string;
}

export interface ArchNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    layer: string;
    files?: { path: string; content: string }[];
    explain?: string;
  };
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
}

export interface UserProfile {
  user_id: string;
  email: string;
  username: string;
  type: string;
  has_workspace: boolean;
}

export interface GenerationHistoryItem {
  snapshot_id: string;
  workspace_id: string;
  prompt: string;
  iteration: number;
  node_count: number;
  tech_stack: string[];
  created_at: string;
}

// ─── Auth ──────────────────────────────────────────────────────
export const authApi = {
  me: () => apiFetch<{ user: UserProfile }>("/api/auth/me"),

  login: (email: string, password: string) =>
    apiFetch<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (username: string, email: string, password: string) =>
    apiFetch<{ token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  logout: () =>
    apiFetch<void>("/api/auth/logout", { method: "POST" }),
};

// ─── Workspaces ────────────────────────────────────────────────
export const workspaceApi = {
  list: () =>
    apiFetch<{ workspaces: Workspace[] }>("/api/workspaces"),

  get: (id: string) =>
    apiFetch<{ workspace: Workspace }>(`/api/workspaces/${id}`),

  create: (payload: {
    name: string;
    context_theme?: string;
    settings?: { primary_color?: string; framework?: string };
  }) =>
    apiFetch<{ workspace: Workspace }>("/api/workspaces", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/api/workspaces/${id}`, { method: "DELETE" }),
};

// ─── AI Generation ─────────────────────────────────────────────
export const generateApi = {
  /** Classic (batch) generation — returns full result */
  generate: (workspaceId: string, prompt: string, signal?: AbortSignal) =>
    apiFetch<{ architecture_data: ArchitectureData }>(
      `/api/workspaces/${workspaceId}/generate`,
      {
        method: "POST",
        body: JSON.stringify({ user_prompt: prompt }),
        signal,
      }
    ),

  /**
   * Streaming generation — returns a ReadableStream of SSE events.
   * Caller is responsible for parsing `data: {...}\n\n` lines.
   */
  stream: async (
    workspaceId: string,
    prompt: string,
    signal?: AbortSignal
  ): Promise<ReadableStream<Uint8Array>> => {
    const res = await fetch(`/api/workspaces/${workspaceId}/generate/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_prompt: prompt }),
      signal,
    });

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        message = body?.error ?? message;
      } catch {
        // ignore
      }
      throw new ApiError(message, res.status);
    }

    if (!res.body) throw new ApiError("No response body", 500);
    return res.body;
  },
};

// ─── History ───────────────────────────────────────────────────
export const historyApi = {
  list: (workspaceId: string) =>
    apiFetch<{ history: GenerationHistoryItem[] }>(
      `/api/workspaces/${workspaceId}/history`
    ),
};
