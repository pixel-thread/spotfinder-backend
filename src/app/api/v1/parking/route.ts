import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { addParking } from '@/services/parking/addParking';
import { getAllParking } from '@/services/parking/getAllParking';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { getMeta } from '@/utils/pagination/getMeta';
import { Prisma } from '@schema/index';
import { NextRequest } from 'next/server';
import { parkingSchema } from '@/utils/validation/parking';

// GET function remains unchanged
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const q = searchParams.get('q') || '';

    const where: Prisma.ParkingLotWhereInput = {
      deletedAt: null,
      status: 'ACTIVE',
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
    const body = parkingSchema.parse(await req.json());

    const isTokenInvalid = await tokenMiddleware(req);

    if (isTokenInvalid) {
      return isTokenInvalid;
    }

    const user = await getUserById({ id: body.userId });

    if (!user) {
      return ErrorResponse({ status: 404, message: 'User not found' });
    }

    const parkingData: Prisma.ParkingLotCreateInput = {
      address: body.address,
      description: body.description,
      distance: body.distance,
      features: body.features,
      gallery: body.gallery,
      image: body.image,
      name: body.name,
      price: Number(body.price),
      openHours: body.openHours,
    };

    const parking = await addParking({ data: parkingData, userId: user.id });

    return SuccessResponse({
      data: parking,
      message: 'Successfully created parking',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
