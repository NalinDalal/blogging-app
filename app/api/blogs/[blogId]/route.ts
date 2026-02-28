import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

function isAuthenticated(request: Request) {
  // Example: check for a header or cookie
  // return Boolean(request.headers.get('authorization'));
  return true;
}

export async function GET(request: Request, context: { params: Promise<{ blogId: string }> }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { blogId } = await context.params;
  const blog = await prisma.post.findUnique({
    where: { id: Number(blogId) },
    include: { author: { select: { id: true, email: true, name: true } } },
  });
  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }
  return NextResponse.json(blog);
}