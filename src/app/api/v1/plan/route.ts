import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getPlans } from '@/services/plan/getPlans';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';

export async function GET() {
  try {
    const plans = await getPlans();
    if (!plans) {
      return ErrorResponse({
        status: 404,
        message: 'Plans not found',
      });
    }
    return SuccessResponse({
      status: 200,
      message: 'Plans fetched successfully',
      data: plans,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
