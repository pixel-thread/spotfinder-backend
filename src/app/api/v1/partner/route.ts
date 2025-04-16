import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getRequestedPartnerShipByUserId } from '@/services/partner/getRequestPartnerByUserId';
import { getRequestedPartnerShip } from '@/services/partner/getRestedPartner';
import { requestPartnership } from '@/services/partner/requestPartnership';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { partnerMiddleware } from '@/utils/middleware/partnerMiddleware';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { verifyToken } from '@/utils/token/verifyToken';
import { partnerRequestSchema } from '@/utils/validation/partner/partnerRequest';

export async function GET(req: Request) {
  try {
    await superAdminMiddleware(req);
    await tokenMiddleware(req);
    const pendingPartner = await getRequestedPartnerShip();
    if (pendingPartner.length === 0) {
      return ErrorResponse({ message: 'No pending partner requests', status: 404 });
    }
    return SuccessResponse({ data: pendingPartner, message: 'Pending partner requests' });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: Request) {
  try {
    const authorizationHeader = req.headers.get('authorization');
    if (!authorizationHeader) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }

    await partnerMiddleware(req);
    await tokenMiddleware(req);

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.id) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }

    const body = partnerRequestSchema.parse(await req.json());

    const pendingUserRequest = await getRequestedPartnerShipByUserId({
      userId: decoded.id,
      status: 'PENDING',
    });

    if (pendingUserRequest >= 3) {
      return ErrorResponse({
        message: 'You have reached the maximum number of pending Partnership requests',
        error: { count: pendingUserRequest },
        status: 400,
      });
    }

    const rejectedUserRequest = await getRequestedPartnerShipByUserId({
      userId: decoded.id,
      status: 'REJECTED',
    });

    if (rejectedUserRequest >= 3) {
      return ErrorResponse({
        message: 'You have reached the maximum number of rejected Partnership requests',
        status: 400,
      });
    }
    if (pendingUserRequest + rejectedUserRequest >= 3) {
      return ErrorResponse({
        message: 'You have reached the maximum number of pending Partnership requests',
        status: 400,
        error: {
          pending: pendingUserRequest,
          rejected: rejectedUserRequest,
        },
      });
    }
    const makeRequest = await requestPartnership({
      userId: decoded.id,
      description: body.description,
    });

    return SuccessResponse({ data: makeRequest, message: 'Request sent  successfully' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
