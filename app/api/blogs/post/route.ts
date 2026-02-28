import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { marked } from 'marked';

const prisma = new PrismaClient();

// Dummy authentication: expects 'authorization' header with user id
function getAuthenticatedUserId(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  // In production, use JWT or session validation
  return authHeader || null;
}

function validateBlogData(data: any) {
  if (!data.title || typeof data.title !== 'string' || data.title.length < 3) return 'Invalid title';
  if (!data.content || typeof data.content !== 'string' || data.content.length < 10) return 'Invalid content';
  return null;
}

export async function POST(request: Request) {
  const userId = getAuthenticatedUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const validationError = validateBlogData(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }
  // Render markdown to HTML
  const htmlContent = marked(body.content);
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId,
      published: true,
      // Optionally store htmlContent in a separate field if desired
    },
  });
  return NextResponse.json({ ...post, htmlContent }, { status: 201 });
}
