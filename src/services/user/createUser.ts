import { prisma } from '@/lib/db';
import { hashPassword } from '@/utils/hash/hashPassword';

type DataType = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type Props = {
  data: DataType;
};

export async function createUser({ data }: Props) {
  return await prisma.auth.create({
    omit: { password: true },
    data: {
      phone: data.phone,
      email: data.email,
      password: await hashPassword(data.password),
      user: {
        create: {
          name: data.name,
        },
      },
    },
  });
}
