import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const res = await backendFetch(`/api/workspaces/${id}/generate`, {
      method: "POST",
      cookieHeader,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Generate proxy error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
