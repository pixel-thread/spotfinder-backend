import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';

type AddBookingProps = {
  data: Prisma.BookingCreateInput;
};
export async function addBooking({ data }: AddBookingProps) {
  return await prisma.booking.create({ data });
}
