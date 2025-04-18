import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';

export async function POST(req: Request) {
  try {
    const headers = req.headers;
    const bearerToken = headers.get('authorization')?.split(' ')[1];
    if (!bearerToken) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }
    const getToken = await prisma.token.findFirst({
      where: { token: bearerToken },
    });
    if (!getToken) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }
    const updateToken = await prisma.token.update({
      where: { id: getToken.id, token: getToken.token },
      data: {
        revoked: true,
        revokedAt: new Date(),
        agent: headers.get('user-agent') || 'N/A',
        revokedBy: getToken.authId,
      },
    });
    if (updateToken) {
      return SuccessResponse({ message: 'Logout successfully' });
    }
    return ErrorResponse({ message: 'Token not found', status: 404 });
  } catch (error) {
    return handleApiErrors(error);
  }
}
