import { prisma } from '@/lib/db';
import { PaginationParams } from '@/utils/pagination';
import { ParkingLot } from '@schema/index';

type GetRandomParkingProps = PaginationParams & {
  limit?: number;
};

// Define the expected return type
type GetRandomParkingResult = [ParkingLot[], number];

export async function getRandomParking({
  limit = 5,
}: GetRandomParkingProps): Promise<GetRandomParkingResult> {
  // 1. Count active and not deleted parking lots consistently
  const totalActiveCount = await prisma.parkingLot.count({
    where: { status: 'ACTIVE', deletedAt: null },
  });

  // 2. Handle the case where there are no active lots
  if (totalActiveCount === 0) {
    return [[], 0]; // Return empty array and count 0
  }

  // 3. Calculate a valid random offset
  // Ensure the offset allows fetching 'limit' items if possible
  const effectiveLimit = Math.min(limit, totalActiveCount); // Cannot take more than available
  const maxOffset = totalActiveCount - effectiveLimit; // Max offset to get at least 'effectiveLimit' items
  const randomOffset = Math.floor(Math.random() * (maxOffset + 1)); // Offset between 0 and maxOffset inclusive

  // 4. Fetch the random parking lots using the calculated offset and consistent where clause
  // No need for a transaction if we already have the count
  const parkingLots = await prisma.parkingLot.findMany({
    where: { status: 'ACTIVE', deletedAt: null },
    skip: randomOffset,
    take: effectiveLimit, // Use the calculated effective limit
    include: { slots: true },
    // Optional: Add orderBy for deterministic skip, though less critical for random sampling
    // orderBy: { createdAt: 'asc' },
  });

  // 5. Return the fetched lots and the total count
  return [parkingLots, totalActiveCount];
}
