import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding parking lots...');

  // Clear existing records (optional - be careful in production)
  await prisma.parkingLot.deleteMany();

  // Bulk insert
  for (let i = 0; i < 100; i++) {
    const lot = {
      name: Math.random().toString(),
      address: Math.random().toString(),
      price: Math.random(),
      available: Math.random(),
      totalSpots: Math.random(),
      image: 'https://random-image-pepebigotes.vercel.app/api/random-image',
      description: Math.random().toString(),
      userId: 'ac04131d-f37e-4d3b-998d-06019834793d', // Provided userId
      galary: [
        `https://loremflickr.com/200/200?random=${Math.random()}`,
        `https://loremflickr.com/200/200?random=${Math.random()}`,
        `https://loremflickr.com/200/200?random=${Math.random()}`,
        `https://loremflickr.com/200/200?random=${Math.random()}`,
        `https://loremflickr.com/200/200?random=${Math.random()}`,
      ],
    };

    await prisma.parkingLot.create({
      data: {
        name: lot.name,
        image: lot.image,
        address: lot.address,
        price: lot.price,
        available: lot.available,
        totalSpots: lot.totalSpots,
        description: lot.description,
        userId: lot.userId,
        gallery: lot.galary,
      },
    });
  }

  console.log('✅ Parking lots seeded successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding parking lots:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
