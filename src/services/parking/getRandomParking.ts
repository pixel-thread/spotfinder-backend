import { prisma } from '@/lib/db';

export async function getRandomParking() {
  const activeCount = await prisma.parkingLot.count({
    where: { status: 'ACTIVE' },
  });

  if (activeCount === 0) return null;

  const randomOffset = Math.floor(Math.random() * activeCount);

  return prisma.parkingLot.findMany({
    where: { status: 'ACTIVE' },
    skip: randomOffset,
    include: { slots: true },
    take: 5,
  });
}
