// import { Prisma, PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Seeding users...');

//   // Clear existing records (optional - be careful in production)
//   await prisma.token.deleteMany();
//   await prisma.auth.deleteMany();
//   await prisma.user.deleteMany();

//   // Define users

//   const users: Prisma.UserCreateInput[] = [
//     {
//       name: 'Super Admin',
//       role: 'SUPER_ADMIN',
//       isVerified: true,

//     },
//     {
//       name: 'Test Partner',
//       role: 'PARTNER',
//       isVerified: true,
//       phone: '8837011018',
//     },
//     {
//       name: 'Test User',
//       role: 'USER',
//       isVerified: true,
//       phone: '9378174248',
//     },
//   ];

//   // Create users
//   for (const user of users) {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     await prisma.user.create({
//       data: {
//         role: user.role,
//         isVerified: user.isVerified,
//         auth: {
//           create: {
//             phone: user.phone,
//             password: hashedPassword,
//           },
//         },
//       },
//     });
//   }

//   console.log('✅ Users seeded successfully!');
// }

// main()
//   .catch((error) => {
//     console.error('❌ Error seeding users:', error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
