import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { createPlan } from '@/services/plan/createPlan';
import { getPlans } from '@/services/plan/getPlans';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';
import { planSchama } from '@/utils/validation/plan';

export async function POST(req: Request) {
  try {
    const isAdmin = await superAdminMiddleware(req);
    if (!isAdmin) {
      return isAdmin;
    }
    const body = planSchama.parse(await req.json());
    const plans = await getPlans();
    if (plans.length === 0) {
      const plan = await createPlan({ price: body.price });
      return SuccessResponse({
        message: 'Plan created successfully',
        data: plan,
      });
    }
    return ErrorResponse({
      message: 'Plan already exists',
      status: 400,
      error: plans,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
