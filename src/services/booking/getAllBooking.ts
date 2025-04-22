// src/services/parkingService.ts

import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';
import { getPagination, PaginationParams } from '@/utils/pagination';

type GetAllBookingProps = PaginationParams & {
  where?: Prisma.BookingWhereInput;
};

export const getAllBooking = async ({ page, where }: GetAllBookingProps) => {
  const { skip, take } = getPagination({ page });
  return await prisma.$transaction([
    prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({
      where,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
};
