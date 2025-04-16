// src/services/parkingService.ts

import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';
import { getPagination, PaginationParams } from '@/utils/pagination';

type GetAllParkingProps = PaginationParams & {
  status: Prisma.ParkingLotCreateInput['status'];
};

export const getAllParking = async ({ status, page }: GetAllParkingProps) => {
  const { skip, take } = getPagination({ page });
  return await prisma.$transaction([
    prisma.parkingLot.findMany({
      where: { status },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.parkingLot.count({
      where: { status },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
};
