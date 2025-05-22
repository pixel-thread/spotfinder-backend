import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  data: Prisma.ParkingLotCreateInput;
  userId: string;
};

export async function addParking({ data, userId }: Props) {
  const parking = await prisma.parkingLot.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      price: Number(data.price) || 30,
      rating: data.rating || [],
      distance: data.distance,
      openHours: data.openHours || '24/7',
      description: data.description,
      image: data.image,
      status: 'INACTIVE',
      features: data.features || [],
      gallery: data.gallery || [],
      owner: { connect: { id: userId } },
    },
  });
  return parking;
}
