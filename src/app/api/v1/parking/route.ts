import { SuccessResponse } from '@/lib/successResponse';
import { getAllParking } from '@/services/parking/getAllParking';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';

export async function GET(req: Request) {
  try {
    await superAdminMiddleware(req);
    const parking = await getAllParking();
    return SuccessResponse({ data: parking, message: 'Successfully fetch parking' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
