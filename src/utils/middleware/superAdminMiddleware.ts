import { verifyToken } from '../token/verifyToken';
import { getUserById } from '@/services/user/getUserById';
import { prisma } from '@/lib/db';
import { UnauthorizedError } from '../errors/unAuthError';

export async function superAdminMiddleware(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Unauthorized');
  }

  const decoded = await verifyToken(token);

  if (!decoded?.id) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await getUserById({ id: decoded.id });

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
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
    throw new UnauthorizedError('Unauthorized');
  }

  if (user.role !== 'SUPER_ADMIN') {
    throw new UnauthorizedError('Permission Denied');
  }
}
