import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { addParking } from '@/services/parking/addParking';
import { getAllParking } from '@/services/parking/getAllParking';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { partnerMiddleware } from '@/utils/middleware/partnerMiddleware';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { getMeta } from '@/utils/pagination/getMeta';
import { parkingSchema } from '@/utils/validation/parking';
import { Prisma } from '@schema/index';
import { NextRequest } from 'next/server';

type Status = Prisma.ParkingLotCreateInput['status'];

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'ACTIVE';
    const page = searchParams.get('page') || '1';
    const q = searchParams.get('q') || '';

    const where: Prisma.ParkingLotWhereInput = {
      deletedAt: null,
      status: status as Status,
      AND: [
        {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { features: { has: q } },
          ],
        },
      ],
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

export async function POST(req: Request) {
  try {
    await partnerMiddleware(req);
    await tokenMiddleware(req);

    const data = parkingSchema.parse(await req.json());

    const user = await getUserById({ id: data.userId });
    if (!user) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }

    const parking = await addParking({ data });

    return SuccessResponse({ data: parking, message: 'Successfully created parking' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
