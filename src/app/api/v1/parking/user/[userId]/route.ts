import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getAllParking } from '@/services/parking/getAllParking';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { getMeta } from '@/utils/pagination/getMeta';
import { Prisma } from '@schema/index';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const { userId } = await params;
    const isNotValidToken = await tokenMiddleware(req);
    if (isNotValidToken) {
      return isNotValidToken;
    }
    if (!userId) {
      return ErrorResponse({
        message: 'User id is required',
        status: 400,
      });
    }
    const user = await getUserById({ id: userId });
    if (!user) {
      return ErrorResponse({
        message: 'User not found',
        status: 404,
      });
    }
    const where: Prisma.ParkingLotWhereInput = {
      userId: userId,
      status: { not: 'DELETED' },
    };
    const [parking, totalParking] = await getAllParking({
      page: page,
      where,
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
