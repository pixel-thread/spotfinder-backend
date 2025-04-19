import { prisma } from '@/lib/db';

/**
 * Removes a user ID from the rating array of a parking lot, if it exists.
 */
export async function removeRating({ userId, parkingId }: { userId: string; parkingId: string }) {
  // Step 1: Fetch current ratings
  const parkingLot = await prisma.parkingLot.findUnique({
    where: { id: parkingId },
    select: { rating: true },
  });

  if (!parkingLot) throw new Error('Parking lot not found');

  const updatedRatings = (parkingLot.rating || []).filter((id) => id !== userId);

  // Step 2: Update with the filtered array
  return prisma.parkingLot.update({
    where: { id: parkingId },
    data: {
      rating: {
        set: updatedRatings,
      },
    },
  });
}
