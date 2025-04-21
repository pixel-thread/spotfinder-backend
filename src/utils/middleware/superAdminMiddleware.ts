import { verifyToken } from '../token/verifyToken';
import { getUserById } from '@/services/user/getUserById';
import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';

export async function superAdminMiddleware(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return ErrorResponse({
      status: 401,
      message: 'Unauthorized',
    });
  }

  const decoded = await verifyToken(token);

  if (!decoded?.id) {
    return ErrorResponse({
      status: 401,
      message: 'Unauthorized',
    });
  }

  const user = await getUserById({ id: decoded.id });

  if (!user) {
    return ErrorResponse({
      status: 401,
      message: 'Unauthorized',
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
      status: 401,
      message: 'Unauthorized',
    });
  }

  if (user.role !== 'SUPER_ADMIN') {
    return ErrorResponse({
      status: 401,
      message: 'Unauthorized',
    });
  }
}
