import { prisma } from '@/lib/db';

type Props = {
  id: string;
};

export async function getParkingLotById({ id }: Props) {
  return await prisma.parkingLot.findUnique({
    where: { id },
    include: {
      slots: true,
      owner: true,
    },
  });
}
