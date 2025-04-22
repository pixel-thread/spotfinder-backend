import { ErrorResponse } from '@/lib/errorResponse';
import { extendTokenExpireDateByDays } from '@/services/token/extendTokenExpireDateByDays';
import { getActiveToken } from '@/services/token/getActiveToken';
import { NextRequest } from 'next/server';

/**
 * Middleware to validate and manage authentication tokens
 *
 * @param req - NextRequest or Request object containing the authorization header
 * @throws {Error} When token is missing or invalid
 * @throws {Error} When token is not found or expired
 *
 * @description
 * - Extracts Bearer token from authorization header
 * - Validates token existence and activity status
 * - Automatically extends token expiration if within 3 days of expiry
 * - Token extension adds 7 days to current expiration date
 *
 * @example
 * ```typescript
 * // Usage in API route
 * await tokenMiddleware(request);
 * ```
 */
export async function tokenMiddleware(req: NextRequest | Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return ErrorResponse({
      status: 401,
      message: 'Unauthorized',
    });
  }

  const activeToken = await getActiveToken({ token });
  if (!activeToken) {
    return ErrorResponse({
      status: 401,
      message: 'Unauthorized',
    });
  }

  // Calculate time difference
  const now = Date.now();
  const expiresAt = new Date(activeToken.expiresAt).getTime();
  const threeDaysInMs = 1 * 24 * 60 * 60 * 1000;

  // Extend only if token expires within the next 3 days
  if (expiresAt - now <= threeDaysInMs) {
    await extendTokenExpireDateByDays({
      id: activeToken.id,
      token: activeToken.token,
    });
  }
}
