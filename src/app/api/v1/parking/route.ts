import { SuccessResponse } from '@/lib/successResponse';
import { addParking } from '@/services/parking/addParking';
import { getAllParking } from '@/services/parking/getAllParking';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { partnerMiddleware } from '@/utils/middleware/partnerMiddleware';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { parkingSchema } from '@/utils/validation/parking';
import { Prisma } from '@schema/index';
import { NextRequest } from 'next/server';

type Status = Prisma.ParkingLotCreateInput['status'];
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'ACTIVE';
    // const page = parseInt(searchParams.get('page') || '1');
    // const limit = parseInt(searchParams.get('limit') || '10');
    // const search = searchParams.get('search') || '';

    const parking = await getAllParking({
      status: status as Status,
      // page,
      // limit,
      // search
    });

    return SuccessResponse({
      data: parking,
      // meta: parking.meta,
      message: 'Successfully fetched parking lots',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: Request) {
  try {
    await partnerMiddleware(req);
    await tokenMiddleware(req);
    const data = parkingSchema.parse(await req.json());
    const parking = await addParking({ data });
    return SuccessResponse({ data: parking, message: 'Successfully created parking' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
