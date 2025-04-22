import { prisma } from '@/lib/db';
import { addDays } from '@/utils/token/addDays';
type Props = {
  token: string;
};
export async function getActiveToken({ token }: Props) {
  return await prisma.token.findFirst({
    where: {
      token: token,
      revoked: false,
      expiresAt: { gt: addDays(new Date(), 0) },
      revokedAt: null,
      revokedBy: null,
    },
  });
}
