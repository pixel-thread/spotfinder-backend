import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { deleteParkingById } from '@/services/parking/deleteParkingById';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';

export async function DELETE(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    await superAdminMiddleware(req);
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    const isParkingExist = await getParkingLotById({ id: parkingId });
    if (!isParkingExist) {
      return ErrorResponse({ message: 'Parking Lot not found', status: 404 });
    }
    const deleteParking = await deleteParkingById({ id: isParkingExist.id });
    return SuccessResponse({ data: deleteParking, message: 'Parking delete successfully' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
