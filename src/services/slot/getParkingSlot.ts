// src/services/parkingService.ts

import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';
import { getPagination, PaginationParams } from '@/utils/pagination';

type GetAllParkingSlotProps = PaginationParams & {
  where?: Prisma.ParkingSlotWhereInput;
};

export const getAllParkingSlot = async ({ page, where }: GetAllParkingSlotProps) => {
  const { skip, take } = getPagination({ page });
  return await prisma.$transaction([
    prisma.parkingSlot.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.parkingSlot.count({
      where,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
};
