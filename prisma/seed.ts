import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const password = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'nalin@gmail.com' },
    update: {},
    create: {
      email: 'nalin@gmail.com',
      password,
      name: 'Nalin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'demo@blog.com' },
    update: {},
    create: {
      email: 'demo@blog.com',
      password,
      name: 'Demo User',
    },
  });

  // Create blog posts
  await prisma.post.createMany({
    data: [
      {
        title: 'Welcome to Blogging App',
        content: 'This is your first blog post! Enjoy writing.',
        authorId: user1.id,
        published: true,
      },
      {
        title: 'Demo Post',
        content: 'This is a demo post for testing.',
        authorId: user2.id,
        published: true,
      },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
