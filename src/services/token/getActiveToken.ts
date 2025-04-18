import { prisma } from '@/lib/db';
type Props = {
  token: string;
};
export async function getActiveToken({ token }: Props) {
  return await prisma.token.findFirst({
    where: {
      token: token,
      revoked: false,
      expiresAt: { gt: new Date() },
      revokedAt: null,
      revokedBy: null,
    },
  });
}
