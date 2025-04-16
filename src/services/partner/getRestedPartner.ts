import { prisma } from '@/lib/db';

export async function getRequestedPartnerShip() {
  return await prisma.partnerRequest.findMany();
}
