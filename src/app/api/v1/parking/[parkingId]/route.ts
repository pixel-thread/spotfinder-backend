import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { deleteParkingById } from '@/services/parking/deleteParkingById';
import { getAllParking } from '@/services/parking/getAllParking';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { updateParkingByParkingId } from '@/services/parking/updateParkingByParkingId';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { parkingSchema } from '@/utils/validation/parking';

export async function GET(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    const isParkingExist = await getParkingLotById({ id: parkingId });
    if (!isParkingExist) {
      return ErrorResponse({ message: 'Parking Lot not found', status: 404 });
    }
    return SuccessResponse({ data: isParkingExist, message: 'Parking fetch successfully' });
  } catch (error) {
    return handleApiErrors(error);
  }
}

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

export async function PUT(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    await tokenMiddleware(req);
    const { parkingId } = await params;
    const data = parkingSchema.parse(await req.json());
    if (!parkingId) {
      return ErrorResponse({
        status: 404,
        message: 'Parking not found',
      });
    }
    const isParkingExist = await getAllParking({ where: { id: parkingId } });

    if (!isParkingExist) {
      return ErrorResponse({
        status: 404,
        message: 'Parking not found',
      });
    }

    const parking = await updateParkingByParkingId({
      data: { ...data, price: Number(data.price) },
      id: parkingId,
    });
    return SuccessResponse({ data: parking, message: 'Successfully created parking' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
