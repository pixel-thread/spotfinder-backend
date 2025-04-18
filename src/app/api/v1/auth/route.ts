import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { authSchema } from '@/utils/validation/auth';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/token/generateToken';
import { verifyToken } from '@/utils/token/verifyToken';
import { getUserById } from '@/services/user/getUserById';
import { prisma } from '@/lib/db';
import { SuccessResponse } from '@/lib/successResponse';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { ErrorResponse } from '@/lib/errorResponse';
import { getAuthByPhone } from '@/services/auth/getAuthByPhone';
import { addNewToken } from '@/services/token/addNewToken';

/**
 * GET /api/v1/auth
 * Retrieves the authenticated user's profile information
 *
 * @requires Authorization Bearer token in header
 *
 * @returns {Object} Success Response
 *   - 200: User profile data
 *   - 401: Unauthorized - Invalid or missing token
 *   - 404: User not found
 */
export async function GET(req: NextRequest) {
  try {
    const authorizationHeader = req.headers.get('authorization');
    if (!authorizationHeader) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }
    await tokenMiddleware(req);

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }
    const user = await getUserById({ id: decoded.id });
    if (!user) {
      return ErrorResponse({ message: 'Unauthorized', status: 401 });
    }

    return SuccessResponse({
      data: user,
      message: 'User verified successfully',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

/**
 * POST /api/v1/auth
 * Authenticates a user and manages token issuance
 *
 * @requires Request Body
 *   - email: string
 *   - password: string
 *
 * @returns {Object} Response
 *   - 200: {
 *       success: boolean,
 *       token: string,
 *       message: string
 *     }
 *   - 401: Invalid credentials
 *   - 404: User not found
 *
 * @description
 * - Validates user credentials
 * - Checks for existing valid tokens
 * - Issues new token if needed
 * - Sets AUTH_TOKEN cookie
 * - Token expires in 24 hours
 */
export async function POST(req: NextRequest) {
  try {
    const body = authSchema.parse(await req.json());

    const auth = await getAuthByPhone({ phone: body.phone });
    if (!auth) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }

    const isValid = await bcrypt.compare(body.password, auth.password);
    if (!isValid) {
      return ErrorResponse({ message: 'Invalid credentials', status: 401 });
    }

    const now = new Date();
    const existingToken = await prisma.token.findFirst({
      where: {
        authId: auth.id,
        revoked: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingToken) {
      if (existingToken.expiresAt > now) {
        // Token is still valid
        return SuccessResponse({
          token: existingToken.token,
          message: 'Welcome back',
        });
      } else {
        // Token expired, revoke it
        await prisma.token.update({
          where: { id: existingToken.id },
          data: { revoked: true, revokedAt: now, revokedBy: auth.userId },
        });
      }
    }

    // Generate and store new token
    const tokenValue = await generateToken({ id: auth.userId });

    await addNewToken({
      token: tokenValue,
      authId: auth.id,
      agent: req.headers.get('user-agent') || 'N/A',
    });

    const response = SuccessResponse({
      token: tokenValue,
      message: 'Login successfully',
    });

    response.cookies.set('AUTH_TOKEN', tokenValue, {
      path: '/',
    });
    return response;
  } catch (error) {
    return handleApiErrors(error);
  }
}
