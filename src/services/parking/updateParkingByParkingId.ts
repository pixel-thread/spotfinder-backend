import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  data: Prisma.ParkingLotCreateInput;
  id: string;
};
export async function updateParkingByParkingId({ data, id }: Props) {
  return await prisma.parkingLot.update({
    where: { id },
    data,
  });
}
