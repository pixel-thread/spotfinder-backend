import { prisma } from "@/lib/db";

export async function getAllUsers() {
  return await prisma.user.findMany({
    where: { auth: { isNot: null } },
  });
}
