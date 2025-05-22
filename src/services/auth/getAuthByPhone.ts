import { prisma } from '@/lib/db';

export async function getAuthByPhone({ phone }: { phone: string }) {
  return await prisma.auth.findUnique({
    where: { phone },
    omit: { deletedAt: true, updatedAt: true, createdAt: true },
    include: {
      user: { omit: { deletedAt: true, updatedAt: true, createdAt: true } },
    },
  });
}
