import { prisma } from '@/lib/db';

export async function getUserById({ id }: { id: string }) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      omit: { deletedAt: true, updatedAt: true, createdAt: true },
      include: {
        auth: {
          omit: { password: true },
          include: {
            tokens: {
              where: { revoked: false },
            },
          },
        },
        parkingLots: true,
      },
    });
  } finally {
    await prisma.$disconnect(); // Disconnect from Prism
  }
}
