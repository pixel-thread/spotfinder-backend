import { prisma } from '@/lib/db';

export async function createPlan({ price }: { price: number }) {
  return await prisma.plan.create({ data: { price } });
}
