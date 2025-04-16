import { prisma } from '@/lib/db';

type Props = {
  userId: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
};

export async function getRequestedPartnerShipByUserId({ userId, status = 'PENDING' }: Props) {
  return await prisma.partnerRequest.count({ where: { userId, status: status } });
}
