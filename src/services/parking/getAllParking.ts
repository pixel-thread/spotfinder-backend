import { prisma } from '@/lib/db';

export const getAllParking = async () => {
  return await prisma.parkingLot.findMany();
};
