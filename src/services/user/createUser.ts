import { prisma } from "@/lib/db";
import { hashPassword } from "@/utils/hash/hashPassword";

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
  return await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      auth: {
        create: {
          email: data.email,
          password: await hashPassword(data.password),
        },
      },
    },
  });
}
