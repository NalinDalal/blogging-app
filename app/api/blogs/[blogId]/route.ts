import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, context: { params: Promise<{ blogId: string }> }) {
  try {
    const { blogId } = await context.params;
    const id = Number(blogId);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
    }

    const blog = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, email: true, name: true } } },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
