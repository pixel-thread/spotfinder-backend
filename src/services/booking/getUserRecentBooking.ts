import { prisma } from '@/lib/db';

export async function getUserRecentBooking({ id }: { id: string }) {
  return await prisma.booking.findMany({
    where: { userId: id, bookingStatus: { not: 'CANCELLED' } },
    orderBy: { createdAt: 'desc' },
    include: { parkingLot: true },
    take: 5,
  });
}
