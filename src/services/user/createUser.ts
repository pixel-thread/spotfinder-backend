import { prisma } from '@/lib/db';

type DataType = {
  name: string;
  phone: string;
};

type Props = {
  data: DataType;
};

export async function createUser({ data }: Props) {
  return await prisma.auth.create({
    data: {
      phone: data.phone,
      otp: 0,
      otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      user: {
        create: {
          name: data.name,
        },
      },
    },
  });
}
