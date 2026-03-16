import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await prisma.post.findMany({
      include: { author: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
