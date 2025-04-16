import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type GetAllParkingProps = {
  status: Prisma.ParkingLotCreateInput['status'];
};

export const countParking = async ({ status }: GetAllParkingProps) => {
  return await prisma.parkingLot.count({
    where: { status },
    orderBy: { createdAt: 'desc' },
  });
};
