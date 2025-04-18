import { prisma } from '@/lib/db';

export async function getPlans() {
  return await prisma.plan.findMany({
    where: {
      status: 'ACTIVE',
    },
  });
}
