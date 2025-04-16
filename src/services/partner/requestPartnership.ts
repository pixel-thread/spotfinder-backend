import { prisma } from '@/lib/db';

type Props = {
  description: string;
  userId: string;
};

export async function requestPartnership({ description, userId }: Props) {
  return await prisma.partnerRequest.create({
    data: {
      userId: userId,
      description: description,
    },
  });
}
