import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { prisma } from '@/lib/db';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';

export async function POST(req: Request) {
  try {
    const isAdmin = await superAdminMiddleware(req);
    if (!isAdmin || isAdmin.status === 401) {
      return isAdmin;
    }
    const body = await req.json();
    const { planId } = body;
    if (!planId) {
      return ErrorResponse({
        message: 'planId is required',
        status: 400,
      });
    }
    const plan = await prisma.plan.findUnique({
      where: { id: planId, status: 'ACTIVE' },
    });
    if (!plan) {
      return ErrorResponse({
        message: 'Plan not found',
        status: 404,
      });
    }
    // Mock transaction creation
    const mockTransaction = await prisma.transaction.create({
      data: {
        amount: plan.price,
        status: 'SUCCESS',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Add more fields as needed for your schema
      },
    });
    // Mock subscription confirmation
    const mockSubscription = {
      subscriptionId: `mock_sub_${plan.id}`,
      planId: plan.id,
      price: plan.price,
      duration: plan.duration,
      status: 'ACTIVE',
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
    };
    return SuccessResponse({
      message: 'Mock subscription checkout successful',
      data: {
        transaction: mockTransaction,
        subscription: mockSubscription,
      },
    });
  } catch (error) {
    return ErrorResponse({
      message: 'Internal server error',
      status: 500,
      error,
    });
  }
}
