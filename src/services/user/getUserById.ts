import { prisma } from '@/lib/db';

export async function getUserById({ id }: { id: string }) {
  return await prisma.user.findUnique({
    where: { id },
    omit: { deletedAt: true, updatedAt: true, createdAt: true },
    include: {
      auth: {
        omit: {
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        include: { tokens: false },
      },
    },
  });
}
