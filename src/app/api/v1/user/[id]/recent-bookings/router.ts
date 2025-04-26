import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserRecentBooking } from '@/services/booking/getUserRecentBooking';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const isTokenNotValid = await tokenMiddleware(req);

    if (isTokenNotValid) {
      return isTokenNotValid;
    }

    const { userId } = await params;

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
