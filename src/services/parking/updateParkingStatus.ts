import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type Props = {
  id: string;
  status: Prisma.ParkingLotCreateInput['status'];
  transactionId?: string;
};
export async function updateParkingStatus({ id, status }: Props) {
  return await prisma.parkingLot.update({
    where: { id },
    data: { status },
    include: { slots: true },
  });
}
