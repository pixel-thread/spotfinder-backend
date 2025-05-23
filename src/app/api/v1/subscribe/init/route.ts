import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { UnauthorizedError } from '@/utils/errors/unAuthError';
import { generatePaymentId, generateTransactionId } from '@/utils/generateTransactionId';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { verifyToken } from '@/utils/token/verifyToken';
import { PaymentMethod } from '@schema/index';
import { z } from 'zod';

const subscribeSchema = z.object({
  slot: z.string(),
  parkingLotId: z.string().uuid(),
  planId: z.string().uuid(),
  type: z.enum([PaymentMethod.CASH, PaymentMethod.UPI]),
});

export async function POST(req: Request) {
  try {
    await tokenMiddleware(req);
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Unauthorized');
    }

    const decoded = await verifyToken(token);

    if (!decoded.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const user = await getUserById({ id: decoded.id });

    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }
    const body = subscribeSchema.parse(await req.json());
    const plan = await prisma.plan.findUnique({
      where: {
        id: body.planId,
      },
    });
    if (!plan) {
      return ErrorResponse({
        message: 'Plan not found',
        status: 404,
      });
    }

    const amount = plan.price * Number(body.slot);

    const transactionInit = await prisma.transaction.create({
      data: {
        transactionId: generateTransactionId(),
        userId: user.id,
        slotNumber: Number(body.slot),
        planId: body.planId,
        amount: amount,
        provider: 'cash',
        paymentId: generatePaymentId(),
        method: body.type || 'CASH',
      },
    });

    return SuccessResponse({
      data: transactionInit,
      message: 'Successfully fetched user',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
