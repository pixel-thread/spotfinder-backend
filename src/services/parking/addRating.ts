import { prisma } from '@/lib/db';

export async function addRating({ userId, parkingId }: { userId: string; parkingId: string }) {
  return await prisma.parkingLot.update({
    where: { id: parkingId },
    data: { rating: { push: userId } },
  });
}
