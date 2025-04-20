import { verifyToken } from '../token/verifyToken';
import { getUserById } from '@/services/user/getUserById';
import { prisma } from '@lib/db';
import { ErrorResponse } from '@/lib/errorResponse';

export async function partnerMiddleware(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return ErrorResponse({
      message: 'Unauthorized',
      status: 401,
    });
  }

  const decoded = await verifyToken(token);

  if (!decoded?.id) {
    return ErrorResponse({
      message: 'Unauthorized',
      status: 401,
    });
  }

  const user = await getUserById({ id: decoded.id });

  if (!user) {
    return ErrorResponse({
      message: 'Unauthorized',
      status: 401,
    });
  }

  const tokenRecord = await prisma.token.findFirst({
    where: {
      authId: user?.auth?.id,
      token: token,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!tokenRecord) {
    return ErrorResponse({
      message: 'Unauthorized',
      status: 401,
    });
  }

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'PARTNER') {
    return ErrorResponse({
      message: 'Unauthorized',
      status: 401,
    });
  }
}
