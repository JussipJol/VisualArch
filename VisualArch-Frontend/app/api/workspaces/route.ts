import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const res = await backendFetch("/api/workspaces", {
      method: "GET",
      cookieHeader,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Workspaces GET proxy error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const res = await backendFetch("/api/workspaces", {
      method: "POST",
      cookieHeader,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Workspaces POST proxy error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
