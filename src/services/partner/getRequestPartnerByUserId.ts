import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

type Props = {
  userId: string;
  status?: Prisma.PartnerRequestCreateInput['status'];
};

export async function getRequestedPartnerShipByUserId({ userId, status = 'PENDING' }: Props) {
  return await prisma.partnerRequest.count({ where: { userId, status: status } });
}
