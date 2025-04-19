import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { updateParkingStatus } from '@/services/parking/updateParkingStatus';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { addDays } from '@/utils/token/addDays';
import { verifyToken } from '@/utils/token/verifyToken';

export async function POST(req: Request) {
  try {
    const isNotValidToken = await tokenMiddleware(req);
    if (isNotValidToken) {
      return isNotValidToken;
    }
    const header = req.headers.get('authorization');
    const token = header?.split(' ')[1];
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
    const user = await getUserById({ id: decoded.id });
    if (!user) {
      return ErrorResponse({
        status: 404,
        message: 'User not found',
      });
    }

    const body = await req.json();

    if (!body.slot || !body.parkingLotId) {
      return ErrorResponse({
        status: 400,
        message: 'Slot is required',
        error: { body },
      });
    }

    const parking = await getParkingLotById({ id: body.parkingLotId });

    if (!parking) {
      return ErrorResponse({
        status: 404,
        message: 'Parking lot not found',
      });
    }

    const slotsToCreate = Array.from({ length: parseInt(body.slot) });

    await prisma.$transaction(
      slotsToCreate.map(() =>
        prisma.parkingLot.update({
          where: { id: parking.id },
          data: {
            slots: {
              create: {
                userId: user.id,
                slotNumber: Math.floor(Math.random() * 100).toString(),
                expiresAt: addDays(new Date(), 30),
              },
            },
          },
        }),
      ),
    );

    const updateParkingStatusToActive = await updateParkingStatus({
      id: parking.id,
      status: 'ACTIVE',
    });

    return SuccessResponse({
      status: 200,
      message: 'Slots created successfully',
      data: updateParkingStatusToActive,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
