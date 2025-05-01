import { prisma } from '@/lib/db';

export async function getUserById({ id }: { id: string }) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      omit: { deletedAt: true, updatedAt: true, createdAt: true },
      include: {
        auth: {
          include: {
            tokens: {
              where: { revoked: false },
            },
          },
        },
      },
    });
  } finally {
    await prisma.$disconnect(); // Disconnect from Prism
  }
}
