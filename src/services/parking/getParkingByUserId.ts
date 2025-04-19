import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

import { getPagination, PaginationParams } from '@/utils/pagination';

type GetAllParkingProps = PaginationParams & {
  where?: Prisma.ParkingLotWhereInput;
};

export async function getParkingByUserId({ where, page }: GetAllParkingProps) {
  const { skip, take } = getPagination({ page });
  return await prisma.$transaction([
    prisma.parkingLot.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { slots: true },
    }),
    prisma.parkingLot.count({
      where,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
}
