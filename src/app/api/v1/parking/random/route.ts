import { SuccessResponse } from '@/lib/successResponse';
import { getRandomParking } from '@/services/parking/getRandomParking';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { getMeta } from '@/utils/pagination/getMeta';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '10';
    const page = searchParams.get('page') || '1';

    const [parking, totalParking] = await getRandomParking({
      limit: Number(limit),
    });

    return SuccessResponse({
      data: parking,
      meta: getMeta({ total: totalParking, currentPage: page }),
      message: 'Successfully fetched parking lots',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
