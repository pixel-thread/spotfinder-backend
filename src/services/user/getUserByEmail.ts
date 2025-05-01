// import { prisma } from '@/lib/db';

export async function getUserByEmail({ email }: { email: string }) {
  // return await prisma.auth.findUnique({
  //   // where: { email },
  //   omit: { deletedAt: true, updatedAt: true, createdAt: true },
  //   include: { user: true },
  // });
  return email;
}
