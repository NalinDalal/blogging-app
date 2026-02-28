import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function isAuthenticated(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // Optionally check payload for user info/roles
    return (payload as any).userId;
  } catch {
    return null;
  }
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
