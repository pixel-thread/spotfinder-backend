import { prisma } from '@/lib/db';

type Props = {
  data: { email: string; name: string };
  id: string;
};

export async function updateUser({ id, data }: Props) {
  return await prisma.auth.update({
    where: { userId: id },
    data: {
      email: data.email,
      user: {
        update: {
          where: { id },
          data: {
            name: data.name,
          },
        },
      },
    },
  });
}
