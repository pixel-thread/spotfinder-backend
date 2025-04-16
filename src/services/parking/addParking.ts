import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  data: Prisma.ParkingLotCreateInput;
};

export async function addParking({ data }: Props) {
  return await prisma.parkingLot.create({ data });
}
