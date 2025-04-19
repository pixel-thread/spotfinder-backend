import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding users...');

  // Clear existing records (optional - be careful in production)
  await prisma.token.deleteMany();
  await prisma.auth.deleteMany();
  await prisma.user.deleteMany();

  // Define users
  type User = {
    name: string;
    role: 'SUPER_ADMIN' | 'USER' | 'PARTNER';
    isVerified: boolean;
    email: string;
    password: string;
    phone: string;
  };

  const users: User[] = [
    {
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isVerified: true,
      email: 'jyrwaboys@gmail.com',
      password: '123Clashofclan@',
      phone: '8787572702',
    },
    {
      name: 'Test Partner',
      role: 'PARTNER',
      isVerified: true,
      email: 'partner@example.com',
      password: '123Clashofclan@',
      phone: '8787572701',
    },
    {
      name: 'Test User',
      role: 'USER',
      isVerified: true,
      email: 'user@example.com',
      password: '123Clashofclan@',
      phone: '8787572703',
    },
  ];

  // Create users
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        auth: {
          create: {
            email: user.email,
            phone: user.phone,
            password: hashedPassword,
          },
        },
      },
    });
  }

  console.log('✅ Users seeded successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
