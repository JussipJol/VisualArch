import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const res = await backendFetch("/api/auth/me", {
      method: "GET",
      cookieHeader,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Me proxy error:", err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
