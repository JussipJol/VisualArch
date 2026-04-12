import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * SSE proxy: streams the backend /generate/stream response
 * directly to the browser as Server-Sent Events.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieHeader = req.headers.get("cookie");
  const body = await req.text();

  let backendRes: Response;
  try {
    backendRes = await backendFetch(`/api/workspaces/${id}/generate/stream`, {
      method: "POST",
      cookieHeader,
      body,
    });
  } catch {
    return new Response(
      `data: ${JSON.stringify({ event: "error", data: { message: "Не удалось подключиться к серверу" } })}\n\n`,
      { status: 502, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  if (!backendRes.ok || !backendRes.body) {
    let msg = `Backend error ${backendRes.status}`;
    try {
      const t = await backendRes.text();
      const j = JSON.parse(t);
      msg = j?.error ?? msg;
    } catch {
      // ignore
    }
    return new Response(
      `event: error\ndata: ${JSON.stringify({ message: msg })}\n\n`,
      {
        status: backendRes.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      }
    );
  }

  // Pipe the backend SSE stream directly to the browser
  return new Response(backendRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
