// import { prisma } from '@/lib/db';
// import { hashPassword } from '@/utils/hash/hashPassword';

type Props = {
  id: string;
  data: { password: string };
};
export async function updateAuthPassword({ id, data }: Props) {
  // return await prisma.auth.update({
  //   where: { userId: id },
  //   data: {
  //     // password: await hashPassword(data.password),
  //   },
  // });
  return { id, data };
}
