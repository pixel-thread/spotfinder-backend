import { prisma } from '@/lib/db';

export async function getAuthByEmail({ email }: { email: string }) {
  return await prisma.auth.findUnique({
    where: { email },
    include: { user: true },
  });
}
