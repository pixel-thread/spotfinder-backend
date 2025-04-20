import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { addRating } from '@/services/parking/addRating';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { removeRating } from '@/services/parking/removeRating';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { verifyToken } from '@/utils/token/verifyToken';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> },
) {
  try {
    await tokenMiddleware(req);
    const header = req.headers.get('authorization');
    const token = header?.split(' ')[1];
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    const isParkingExist = await getParkingLotById({ id: parkingId });
    if (!isParkingExist) {
      return ErrorResponse({ message: 'Parking Lot not found', status: 404 });
    }
    if (!token) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return ErrorResponse({ message: 'Invalid token', status: 401 });
    }
    const user = await getUserById({ id: decodedToken.id });
    if (!user) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }
    return SuccessResponse({ data: isParkingExist.rating, message: 'Successfully fetched rating' });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> },
) {
  try {
    await tokenMiddleware(req);
    const header = req.headers.get('authorization');
    const token = header?.split(' ')[1];
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    const isParkingExist = await getParkingLotById({ id: parkingId });
    if (!isParkingExist) {
      return ErrorResponse({ message: 'Parking Lot not found', status: 404 });
    }
    if (!token) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return ErrorResponse({ message: 'Invalid token', status: 401 });
    }
    const user = await getUserById({ id: decodedToken.id });
    if (!user) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }
    if (isParkingExist.rating.includes(user.id)) {
      const data = await removeRating({ userId: user.id, parkingId: isParkingExist.id });
      return SuccessResponse({ data, message: 'Successfully removed rating' });
    }
    const data = await addRating({ userId: user.id, parkingId: isParkingExist.id });
    return SuccessResponse({ data, message: 'Successfully added rating' });
  } catch (error) {
    console.log(error);
    return handleApiErrors(error);
  }
}
