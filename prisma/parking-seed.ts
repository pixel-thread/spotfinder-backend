// import { PrismaClient, Status, VehicleType } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌱 Seeding parking lots and slots...');

//   // Clear existing records
//   await prisma.booking.deleteMany();
//   await prisma.parkingSlot.deleteMany();
//   await prisma.parkingLot.deleteMany();

//   // Get a partner user to associate with parking lots
//   const partner = await prisma.user.findFirst({
//     where: { role: 'PARTNER' },
//   });

//   if (!partner) {
//     console.error('❌ No partner user found. Please run user-seed.ts first.');
//     return;
//   }

//   // Define parking lot name prefixes and suffixes to generate more combinations
//   const namePrefix = [
//     'Central',
//     'Downtown',
//     'City',
//     'Metro',
//     'Urban',
//     'Secure',
//     'Premium',
//     'Budget',
//     'Express',
//     'Quick',
//     'Easy',
//     '24Hr',
//     'Luxury',
//     'Convenient',
//     'Safe',
//     'Modern',
//     'Smart',
//     'Elite',
//     'Prime',
//     'Royal',
//   ];

//   const nameSuffix = [
//     'Parking',
//     'Park & Go',
//     'Garage',
//     'Lot',
//     'Spaces',
//     'Zone',
//     'Spot',
//     'Area',
//     'Bay',
//     'Station',
//     'Hub',
//     'Center',
//     'Plaza',
//     'Square',
//     'Point',
//   ];

//   // Define location types and street names for more address combinations
//   const locationTypes = [
//     'Downtown',
//     'Airport',
//     'Shopping District',
//     'Medical District',
//     'Sports Complex',
//     'Waterfront',
//     'Campus Area',
//     'Tourist District',
//     'Business District',
//     'Residential Area',
//     'Entertainment Zone',
//     'Financial District',
//     'Tech Park',
//     'Industrial Area',
//     'Historic District',
//   ];

//   const streetNames = [
//     'Main St',
//     'Park Ave',
//     'Broadway',
//     'Market St',
//     'Oak Rd',
//     'Maple Dr',
//     'Pine Ln',
//     'Cedar Blvd',
//     'Elm St',
//     'Washington Ave',
//     'Lincoln Rd',
//     'Jefferson Blvd',
//     'Highland Dr',
//     'Sunset Blvd',
//     'Ocean Dr',
//     'River Rd',
//     'Lake St',
//     'Mountain View',
//     'Valley Rd',
//     'Forest Ave',
//   ];

//   // Generate 200 parking lots with random combinations
//   const parkingLots = [];

//   for (let i = 0; i < 200; i++) {
//     const prefixIndex = Math.floor(Math.random() * namePrefix.length);
//     const suffixIndex = Math.floor(Math.random() * nameSuffix.length);
//     const name = `${namePrefix[prefixIndex]} ${nameSuffix[suffixIndex]}`;

//     const streetNumber = Math.floor(Math.random() * 9000) + 1000;
//     const streetIndex = Math.floor(Math.random() * streetNames.length);
//     const locationIndex = Math.floor(Math.random() * locationTypes.length);
//     const address = `${streetNumber} ${streetNames[streetIndex]}, ${locationTypes[locationIndex]}`;

//     parkingLots.push({
//       name,
//       address,
//       price: Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
//       rating: Array(Math.floor(Math.random() * 5) + 1)
//         .fill(0)
//         .map(() => (Math.random() * 2 + 3).toFixed(1)), // Random ratings between 3.0 and 5.0
//       distance: `${(Math.random() * 10).toFixed(1)} km`,
//       available: Math.floor(Math.random() * 50) + 10, // Random available spots between 10 and 60
//       openHours:
//         Math.random() > 0.3
//           ? '24/7'
//           : `${Math.floor(Math.random() * 6) + 6}:00 AM - ${Math.floor(Math.random() * 4) + 8}:00 PM`,
//       description: `Convenient and secure parking at ${name} located in the ${locationTypes[locationIndex]}. Ideal for ${Math.random() > 0.5 ? 'short-term' : 'long-term'} parking.`,
//       image: `https://picsum.photos/seed/seed${i}/300/200`,
//       status: Math.random() > 0.1 ? Status.ACTIVE : Status.INACTIVE, // 90% active, 10% inactive
//       features: [
//         'CCTV',
//         'Security Guard',
//         'Covered',
//         'Valet',
//         'EV Charging',
//         'Car Wash',
//         'Handicap Access',
//         'Motorcycle Parking',
//         'Well Lit',
//         'Restrooms',
//       ]
//         .sort(() => 0.5 - Math.random())
//         .slice(0, Math.floor(Math.random() * 5) + 1),
//       gallery: Array(Math.floor(Math.random() * 3) + 1)
//         .fill(0)
//         .map((_, j) => `https://picsum.photos/seed/seed${i + j}/300/200`),
//       userId: partner.id,
//     });
//   }

//   // Create parking lots and slots in batches to avoid overwhelming the database
//   const batchSize = 20;
//   for (let i = 0; i < parkingLots.length; i += batchSize) {
//     const batch = parkingLots.slice(i, i + batchSize);

//     for (const lotData of batch) {
//       const parkingLot = await prisma.parkingLot.create({
//         data: lotData,
//       });

//       // Create slots for each parking lot
//       const slotTypes = Object.values(VehicleType);
//       const numSlots = Math.floor(Math.random() * 15) + 5; // Random number of slots between 5 and 20

//       const slots = Array(numSlots)
//         .fill(0)
//         .map((_, i) => ({
//           slotNumber: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`, // A1, A2, ..., B1, B2, etc.
//           isOccupied: Math.random() > 0.7, // 30% chance of being occupied
//           type: slotTypes[Math.floor(Math.random() * slotTypes.length)],
//           parkingLotId: parkingLot.id,
//         }));

//       await prisma.parkingSlot.createMany({
//         data: slots,
//       });
//     }

//     console.log(
//       `Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(parkingLots.length / batchSize)} (${batch.length} parking lots)`,
//     );
//   }

//   console.log('✅ Parking lots and slots seeded successfully!');
// }

// main()
//   .catch((error) => {
//     console.error('❌ Error seeding parking lots:', error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
