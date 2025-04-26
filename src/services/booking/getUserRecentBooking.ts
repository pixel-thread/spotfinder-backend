import { prisma } from '@/lib/db';

export async function getUserRecentBooking({ id }: { id: string }) {
  return await prisma.booking.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}
