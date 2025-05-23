import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { createPlan } from '@/services/plan/createPlan';
import { getPlans } from '@/services/plan/getPlans';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';
import { planSchema } from '@/utils/validation/plan';

export async function POST(req: Request) {
  try {
    await superAdminMiddleware(req);

    const body = planSchema.parse(await req.json());
    const plans = await getPlans();
    if (plans.length === 0) {
      const plan = await createPlan({ data: body });
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
