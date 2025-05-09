import { prisma } from '@/lib/db';

interface UpdateUserProfilePicParams {
  userId: string;
  url: string;
}

export async function updateUserProfilePic({ userId, url }: UpdateUserProfilePicParams) {
  return prisma.user.update({
    where: { id: userId },
    data: { profilePic: url },
  });
}
