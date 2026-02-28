import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Dummy authentication check (replace with real auth in production)
function isAuthenticated(request: Request) {
  // Example: check for a header or cookie
  // return Boolean(request.headers.get('authorization'));
  return true;
}

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const blogs = await prisma.post.findMany({
    include: { author: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(blogs);
}
