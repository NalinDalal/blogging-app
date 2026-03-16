import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export type SessionUser = {
  userId: string;
  email: string;
  name: string | null;
};

const SESSION_COOKIE_NAME = "session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const JWT_SECRET = process.env.JWT_SECRET || "development-insecure-secret-change-me";

export function createSessionToken(user: SessionUser) {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: SESSION_TTL_SECONDS,
  });
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (
      payload &&
      typeof payload === "object" &&
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      (typeof payload.name === "string" || payload.name === null || payload.name === undefined)
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        name: payload.name ?? null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getSessionUserFromRequest(request: NextRequest): SessionUser | null {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
