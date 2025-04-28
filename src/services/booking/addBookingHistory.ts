import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type AddBookingHistoryProps = {
  data: Prisma.BookingHistoryCreateInput;
};
export async function addBookingHistory({ data }: AddBookingHistoryProps) {
  return await prisma.bookingHistory.create({ data });
}
