import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding plans...');

  // Clear existing records
  await prisma.plan.deleteMany();

  // Define plans
  const plans = [
    {
      price: 70,
    },
  ];

  // Insert plans
  for (const plan of plans) {
    await prisma.plan.create({
      data: plan,
    });
  }

  console.log('✅ Plans seeded successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding plans:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
