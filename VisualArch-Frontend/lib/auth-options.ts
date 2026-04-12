import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import type { AuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";

const BACKEND = process.env.BACKEND_URL || "http://localhost:4000";
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || "";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // Use JWT strategy so we can embed backendToken in the session cookie
  session: { strategy: "jwt" },
  callbacks: {
    // ── Runs on every sign-in and token refresh ──────────────
    async jwt({ token, account }) {
      // account is only present on first sign-in (OAuth flow)
      if (account && token.email) {
        try {
          const res = await fetch(`${BACKEND}/api/auth/oauth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Internal-Secret": INTERNAL_SECRET,
            },
            body: JSON.stringify({
              email: token.email,
              name: token.name ?? token.email,
              provider: account.provider,
              provider_id: account.providerAccountId,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            token.backendToken = data.token as string;
            token.hasWorkspace = data.user?.has_workspace ?? false;
          }
        } catch (err) {
          console.error("[NextAuth] OAuth backend sync error:", err);
        }
      }
      return token;
    },

    // ── Expose backendToken on the client-side session ───────
    async session({ session, token }) {
      if (token.backendToken) {
        (session as { backendToken?: string }).backendToken = token.backendToken as string;
      }
      if (token.hasWorkspace !== undefined) {
        (session as { hasWorkspace?: boolean }).hasWorkspace = token.hasWorkspace as boolean;
      }
      if (session.user) {
        (session.user as { id?: string }).id = token.sub ?? "";
      }
      return session;
    },
  },
};
