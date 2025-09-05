import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

// Only initialize auth if database is available
// This prevents errors during build time when env vars are not available
export const auth = db ? betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 1 week
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  },
  cookies: {
    secure: process.env.NODE_ENV === "production",
  },
}) : null;