import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  status: Prisma.ParkingLotCreateInput['status'];
};
export const getAllParking = async ({ status }: Props = { status: 'ACTIVE' }) => {
  return await prisma.parkingLot.findMany({ where: { status: status } });
};
