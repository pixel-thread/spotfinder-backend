import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { getAllParkingSlot } from '@/services/slot/getParkingSlot';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { getMeta } from '@/utils/pagination/getMeta';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> },
) {
  try {
    const page = request.nextUrl.searchParams.get('page') || '1';
    const { parkingId } = await params;

    if (!parkingId) {
      return ErrorResponse({
        message: 'Please provide a valid parkingId',
        status: 400,
      });
    }

    const isParkingExist = await getParkingLotById({ id: parkingId });

    if (!isParkingExist) {
      return ErrorResponse({
        message: 'Parking lot not found',
        status: 404,
      });
    }

    const [parkingSlot, total] = await getAllParkingSlot({ where: { parkingLotId: parkingId } });

    return SuccessResponse({
      message: 'Parking lot found',
      status: 200,
      data: parkingSlot,
      meta: getMeta({ total: total, currentPage: page }),
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
