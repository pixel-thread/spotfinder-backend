import { prisma } from '@/lib/db';
import { addDays } from '@/utils/token/addDays';

type Props = {
  id: string;
  token?: string;
};

export async function extendTokenExpireDateByDays({ id, token }: Props) {
  return await prisma.token.update({
    where: { token: token, id },
    data: { expiresAt: { set: addDays(new Date(), 1) } },
  });
}
