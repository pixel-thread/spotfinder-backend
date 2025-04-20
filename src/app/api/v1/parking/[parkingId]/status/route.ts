import { ErrorResponse } from '@/lib/errorResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { updateParkingStatus } from '@/services/parking/updateParkingStatus';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { partnerMiddleware } from '@/utils/middleware/partnerMiddleware';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ parkingId: string }> },
) {
  try {
    const { parkingId } = await params;

    if (!parkingId) {
      return ErrorResponse({
        message: 'Parking lot not found',
        status: 404,
      });
    }

    const isNotValidToken = await partnerMiddleware(request);

    if (isNotValidToken) {
      return isNotValidToken;
    }

    const parkingExist = await getParkingLotById({ id: parkingId });

    if (!parkingExist) {
      return ErrorResponse({
        message: 'Parking lot not found',
        status: 404,
      });
    }

    const updatedParking = await updateParkingStatus({
      id: parkingId,
      status: parkingExist.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });

    return Response.json({
      data: updatedParking,
      message: 'Successfully updated parking lot status',
    });
  } catch (error) {
    handleApiErrors(error);
  }
}
