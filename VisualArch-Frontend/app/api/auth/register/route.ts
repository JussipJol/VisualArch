import { NextRequest, NextResponse } from "next/server";
import { backendFetch, createTokenCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await backendFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Set httpOnly cookie with JWT
    const response = NextResponse.json({
      user: data.user,
    });

    response.headers.set("Set-Cookie", createTokenCookie(data.token));
    return response;
  } catch (err) {
    console.error("Register proxy error:", err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
