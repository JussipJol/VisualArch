import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await backendFetch(`/api/workspaces/${id}`, {
      method: "GET",
      cookieHeader,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Workspace GET proxy error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie");
    const body = await req.json();

    const res = await backendFetch(`/api/workspaces/${id}`, {
      method: "PATCH",
      cookieHeader,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Workspace PATCH proxy error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie");

    const res = await backendFetch(`/api/workspaces/${id}`, {
      method: "DELETE",
      cookieHeader,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Workspace DELETE proxy error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
