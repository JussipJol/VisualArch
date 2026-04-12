import { Response } from "express";

export type SSEEventType =
  | "planning_start"
  | "planning_done"
  | "coding_start"
  | "coding_node"
  | "node_done"
  | "complete"
  | "error";

export interface SSEEvent {
  event: SSEEventType;
  data: Record<string, unknown>;
}

/**
 * Configure Express response for Server-Sent Events.
 * Returns a `send` helper and a `close` method.
 */
export function createSSEStream(res: Response) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  // Keep-alive ping every 15 s
  const ping = setInterval(() => {
    res.write(": ping\n\n");
  }, 15_000);

  function send(event: SSEEventType, data: Record<string, unknown>) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    res.write(payload);
    // Flush if available (compression middleware may buffer)
    if (typeof (res as unknown as { flush?: () => void }).flush === "function") {
      (res as unknown as { flush: () => void }).flush();
    }
  }

  function close() {
    clearInterval(ping);
    res.end();
  }

  return { send, close };
}
