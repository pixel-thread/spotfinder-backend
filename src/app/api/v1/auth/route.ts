import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { NextRequest } from 'next/server';
import { generateToken } from '@/utils/token/generateToken';
import { verifyToken } from '@/utils/token/verifyToken';
import { getUserById } from '@/services/user/getUserById';
import { prisma } from '@/lib/db';
import { SuccessResponse } from '@/lib/successResponse';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { ErrorResponse } from '@/lib/errorResponse';
import { getAuthByPhone } from '@/services/auth/getAuthByPhone';
import { addNewToken } from '@/services/token/addNewToken';
import { registerSchema } from '@/utils/validation/auth/register';
import { env } from '@/env';
import { logger } from '@/utils/logger';

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
    const tokenResponse = await tokenMiddleware(req);

    if (tokenResponse) {
      return tokenResponse;
    }

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
    console.log(error);
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

export async function POST(req: Request) {
  try {
    const body = registerSchema.pick({ phone: true, otp: true }).parse(await req.json());

    const auth = await getAuthByPhone({ phone: body.phone });

    if (!auth) {
      return ErrorResponse({
        message: 'User not found',
        status: 404,
      });
    }

    const INTERNAL_CODE = env.INTERNAL_CODE;

    if (auth.isInternal) {
      // For internal users, check if OTP matches either internal code or user's OTP
      if (auth.otpExpiresAt < new Date()) {
        return ErrorResponse({
          message: 'OTP expired',
          status: 401,
        });
      }

      if (Number(body.otp) !== Number(INTERNAL_CODE) && Number(body.otp) !== auth.otp) {
        return ErrorResponse({
          message: 'Invalid OTP Internal',
          status: 401,
          error: { code: Number(INTERNAL_CODE), error: body.otp },
        });
      }
    } else {
      // For non-internal users, check only against user's OTP
      if (Number(body.otp) !== auth.otp) {
        return ErrorResponse({
          message: 'Invalid OTP',
          status: 401,
        });
      }
    }

    // Generate token after successful OTP validation
    // Check for existing valid token before generating a new one
    const now = new Date();

    const existingToken = await prisma.token.findFirst({
      where: {
        authId: auth.id,
        revoked: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    let tokenValue;

    if (existingToken && existingToken.expiresAt > now) {
      // Use existing valid token
      tokenValue = existingToken.token;
    } else {
      // Revoke expired token if it exists
      if (existingToken) {
        await prisma.token.update({
          where: { id: existingToken.id },
          data: { revoked: true, revokedAt: now, revokedBy: auth.userId },
        });
      }

      // Generate new token
      tokenValue = await generateToken({ id: auth.userId });

      // Store the new token
      await addNewToken({
        token: tokenValue,
        authId: auth.id,
        agent: req.headers.get('user-agent') || 'N/A',
      });
    }

    // Return success response with token
    const response = SuccessResponse({
      token: tokenValue,
      message: 'Login successful',
    });

    // Set cookie with the token
    response.cookies.set('AUTH_TOKEN', tokenValue, {
      path: '/',
    });

    return response;
  } catch (error) {
    logger.error(error);
    return handleApiErrors(error);
  }
}
