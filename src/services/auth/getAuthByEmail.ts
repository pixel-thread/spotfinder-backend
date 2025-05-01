export async function getAuthByEmail({ email }: { email: string }) {
  // return await prisma.auth
  //   .findUnique({
  //     // where: { email },
  //   })
  //   .finally(() => prisma.$disconnect());
  return email;
}
