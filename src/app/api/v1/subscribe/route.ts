import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { updateParkingStatus } from '@/services/parking/updateParkingStatus';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { logger } from '@/utils/logger';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { addDays } from '@/utils/token/addDays';
import { verifyToken } from '@/utils/token/verifyToken';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const subScribeSchema = z.object({
  parkingLotId: z.string().uuid(),
  transactionId: z.string(),
});

async function generateBcryptCode(): Promise<string> {
  const salt = await bcrypt.genSalt(5);
  const hash = await bcrypt.hash(Date.now().toString(), salt);
  return hash
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase()
    .substring(0, 6);
}

export async function POST(req: Request) {
  try {
    await tokenMiddleware(req);

    const header = req.headers.get('authorization');
    const token = header?.split(' ')[1];
    if (!token) {
      return ErrorResponse({ status: 401, message: 'Unauthorized' });
    }

    const decoded = await verifyToken(token);
    if (!decoded?.id) {
      return ErrorResponse({ status: 401, message: 'Unauthorized' });
    }

    const user = await getUserById({ id: decoded.id });
    if (!user) {
      return ErrorResponse({ status: 404, message: 'User not found' });
    }

    const body = subScribeSchema.parse(await req.json());

    const transaction = await prisma.transaction.findUnique({
      where: { transactionId: body.transactionId },
    });

    if (!transaction) {
      return ErrorResponse({ status: 404, message: 'Transaction not found' });
    }

    if (transaction.paymentStatus === 'FAILED') {
      return ErrorResponse({ status: 400, message: 'Transaction failed' });
    }

    const parkingLot = await getParkingLotById({ id: body.parkingLotId });
    if (!parkingLot) {
      return ErrorResponse({ status: 404, message: 'Parking lot not found' });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: transaction.planId ?? '' },
    });

    if (!plan) {
      return ErrorResponse({ status: 404, message: 'Plan not found' });
    }

    const slotCount = Math.floor(Number(transaction.amount) / Number(plan.price));

    if (slotCount <= 0) {
      return ErrorResponse({ status: 400, message: 'Invalid number of slots calculated.' });
    }

    const existingSlots = await prisma.parkingSlot.findMany({
      where: { transactionId: body.transactionId },
    });

    const isAlreadyUsed = existingSlots.length > 0;
    logger.info({ message: 'isAlreadyUsed', isAlreadyUsed });
    if (isAlreadyUsed) {
      return ErrorResponse({ status: 400, message: 'User already has slots' });
    }

    logger.info({ message: 'Creating slots', slot: existingSlots });
    const createdSlots = await prisma.$transaction(async (tx) => {
      const slots = await Promise.all(
        Array.from({ length: slotCount }).map(async () =>
          tx.parkingSlot.create({
            data: {
              userId: user.id,
              parkingLotId: parkingLot.id,
              slotNumber: await generateBcryptCode(),
              expiresAt: addDays(new Date(), plan.duration || 30),
              transactionId: transaction.transactionId,
              transaction: { connect: { transactionId: transaction.transactionId } },
            },
          }),
        ),
      );

      await updateParkingStatus({
        id: parkingLot.id,
        status: 'ACTIVE',
        transactionId: transaction.transactionId,
      });

      return slots;
    });

    return SuccessResponse({
      status: 200,
      message: 'Slots created successfully',
      data: createdSlots,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
