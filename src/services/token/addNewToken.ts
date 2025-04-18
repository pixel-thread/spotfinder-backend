import { prisma } from '@/lib/db';
import { addDays } from '@/utils/token/addDays';

type Props = {
  authId: string;
  token: string;
  agent: string;
};
export async function addNewToken({ authId, token, agent }: Props) {
  return await prisma.token.create({
    data: {
      authId: authId || '',
      token: token,
      agent: agent,
      expiresAt: addDays(new Date(), 7),
      lastUsedAt: new Date(),
    },
  });
}
