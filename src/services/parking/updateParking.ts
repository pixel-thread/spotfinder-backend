import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  id: string;
  data: Prisma.ParkingLotCreateInput;
};
export async function updateParking({ id, data }: Props) {
  return await prisma.parkingLot.update({
    where: { id },
    data: data,
  });
}
