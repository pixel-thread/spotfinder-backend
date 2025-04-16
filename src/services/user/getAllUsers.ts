import { prisma } from '@/lib/db';
import { getPagination } from '@/utils/pagination';

type GetAllUsersProps = {
  page?: string | number;
};
export async function getAllUsers({ page }: GetAllUsersProps = {}) {
  const { skip, take } = getPagination({ page });
  return prisma.$transaction([
    prisma.user.findMany({
      where: { auth: { isNot: null } },
      skip,
      take,
    }),
    prisma.user.count({
      where: { auth: { isNot: null } },
    }),
  ]);
}
