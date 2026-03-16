import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { createSessionToken, getSessionCookieName, getSessionCookieOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 200 });
    response.cookies.set(getSessionCookieName(), sessionToken, getSessionCookieOptions());

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
