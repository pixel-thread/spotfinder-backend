import { prisma } from '@/lib/db';

type Props = {
  id: string;
};

export async function deleteParkingById({ id }: Props) {
  return await prisma.parkingLot.update({
    where: { id },
    data: { status: 'DELETED', deletedAt: new Date() },
  });
}
