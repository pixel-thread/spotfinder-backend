import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';
import { getPagination, PaginationParams } from '@/utils/pagination';

type GetAllBookingProps = PaginationParams & {
  where?: Prisma.BookingHistoryWhereInput;
};

export const getAllBookingHistory = async ({ page, where }: GetAllBookingProps) => {
  const { skip, take } = getPagination({ page });
  return await prisma.$transaction([
    prisma.bookingHistory.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.bookingHistory.count({
      where,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
};
