import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding plans...');

  // Clear existing records
  await prisma.parkingLotPlan.deleteMany();

  // Define plans - only Free and Premium
  const plans = [
    {
      name: 'Free',
      description: 'Basic plan with limited features for small parking lots',
      price: 0,
      noOfParkingSlot: 1,
      duration: 30,
    },
    {
      name: 'Premium',
      description: 'Comprehensive plan for parking lots with all features',
      price: 99.99,
      noOfParkingSlot: 10, // Updated to include 10 slots
      duration: 30,
    },
  ];

  // Bulk insert
  await prisma.parkingLotPlan.createMany({
    data: plans,
  });

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
