const BACKEND = process.env.BACKEND_URL || "http://localhost:4000";
const COOKIE_NAME = "va_token";

/** Build headers for backend requests, forwarding the JWT from cookie */
export function backendHeaders(cookieHeader?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (match) {
      headers["Authorization"] = `Bearer ${match[1]}`;
    }
  }

  return headers;
}

/** Fetch from backend with auth */
export async function backendFetch(
  path: string,
  options: RequestInit & { cookieHeader?: string | null } = {}
) {
  const { cookieHeader, ...fetchOptions } = options;

  const url = `${BACKEND}${path}`;
  const headers = {
    ...backendHeaders(cookieHeader),
    ...(options.headers || {}),
  };

  return fetch(url, { ...fetchOptions, headers });
}

/** Create Set-Cookie header for JWT token */
export function createTokenCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const isProduction = process.env.NODE_ENV === "production";
  const securePart = isProduction ? " Secure;" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax;${securePart} Max-Age=${maxAge}`;
}

/** Create expired cookie to remove token */
export function clearTokenCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { COOKIE_NAME };
