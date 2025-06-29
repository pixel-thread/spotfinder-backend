import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding plans...');

  // Clear existing records
  await prisma.plan.deleteMany();

  // Define plans

  // Insert plans
  await prisma.kotAppVersion.createMany({
    data: {
      version: '1.0.3',
      title: 'Bug Fixes and Improvements',
      description: [
        'Fixed login crash on Android and improved startup performance.',
        'Fixed login crash on Android and improved startup performance.',
      ],
      mandatory: false,
      platforms: ['android', 'ios'],
      release_notes_url: 'https://example.com/releases/1.0.3',
      min_supported_version: '1.0.0',
      release_date: new Date().toISOString(),
      author: 'Release Bot',
      additional_info: {
        estimated_downtime: 'none',
        rollback_available: true,
      },
    },
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
