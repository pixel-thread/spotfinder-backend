import { SuccessResponse } from '@/lib/successResponse';
import { getRandomParking } from '@/services/parking/getRandomParking';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';

export async function GET() {
  try {
    const parking = await getRandomParking();
    return SuccessResponse({
      data: parking,
      message: 'Successfully fetched parking lots',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
