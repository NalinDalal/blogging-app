import { NextRequest, NextResponse } from "next/server";

import { getSessionUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function validateBlogData(data: unknown) {
  if (!data || typeof data !== "object") {
    return "Invalid request body";
  }

  const { title, content } = data as { title?: unknown; content?: unknown };

  if (typeof title !== "string" || title.trim().length < 3) {
    return "Title must be at least 3 characters";
  }

  if (typeof content !== "string" || content.trim().length < 10) {
    return "Content must be at least 10 characters";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const user = getSessionUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationError = validateBlogData(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const title = body.title.trim();
    const content = body.content.trim();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.userId,
        published: true,
      },
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
