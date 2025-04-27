import { prisma } from '@/lib/db';

interface UpdateUserProfilePicParams {
  userId: string;
  profilePicUrl: string;
}

export async function updateUserProfilePic({ userId, profilePicUrl }: UpdateUserProfilePicParams) {
  return prisma.user.update({
    where: { id: userId },
    data: { profilePic: profilePicUrl },
    select: {
      id: true,
      name: true,
      profilePic: true,
    },
  });
}
