import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserRecentBooking } from '@/services/booking/getUserRecentBooking';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { verifyToken } from '@/utils/token/verifyToken';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const isTokenNotValid = await tokenMiddleware(req);

    if (isTokenNotValid) {
      return isTokenNotValid;
    }
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return ErrorResponse({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const decoded = await verifyToken(token);
    if (!decoded.id) {
      return ErrorResponse({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const userId = decoded.id;
    if (!userId) {
      return ErrorResponse({ message: 'User ID is required' });
    }

    const user = await getUserById({ id: userId });

    if (!user) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }

    const recentBooking = await getUserRecentBooking({ id: user.id });

    return SuccessResponse({ data: recentBooking, message: 'Successfully fetched recent booking' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
