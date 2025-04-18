import { prisma } from '@/lib/db';

type Props = {
  token: string;
};

export async function tokenStillValid({ token }: Props) {
  return await prisma.token.findFirst({
    where: { token: token, revoked: false },
  });
}
