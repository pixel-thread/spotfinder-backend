import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  data: Prisma.ParkingLotCreateInput;
  userId: string;
};

export async function addParking({ data, userId }: Props) {
  // Step 1: Create the new parking lot
  const parking = await prisma.parkingLot.create({
    data: {
      name: data.name,
      address: data.address,
      price: data.price,
      rating: data.rating || [],
      distance: data.distance,
      available: data.available,
      openHours: data.openHours || '24/7',
      description: data.description,
      image: data.image,
      status: 'INACTIVE',
      features: data.features || [],
      gallery: data.gallery || [],
      owner: {
        connect: { id: userId },
      },
    },
  });
  // Step 2: Reassign unassigned user's slots (if needed)
  await prisma.parkingSlot.updateMany({
    where: {
      parkingLotId: { not: parking.id }, // optional: only if not already linked
    },
    data: { parkingLotId: parking.id },
  });

  return parking;
}
