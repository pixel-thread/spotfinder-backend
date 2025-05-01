import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getAuthByPhone } from '@/services/auth/getAuthByPhone';
import { createUser } from '@/services/user/createUser';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { generateFiveDigitNumber } from '@/utils/generateFiveDigitNumber';
import { logger } from '@/utils/logger';
import { registerSchema } from '@/utils/validation/auth/register';

export async function POST(req: Request) {
  try {
    const body = registerSchema.pick({ phone: true }).parse(await req.json());

    const isUserExist = await getAuthByPhone({ phone: body.phone });

    if (!isUserExist) {
      logger.info({ message: 'Creating new user' });
      await createUser({ data: { phone: body.phone, name: body.phone } });
      logger.info({ message: 'User Created' });
    }

    const auth = await getAuthByPhone({ phone: body.phone });

    if (!auth) {
      return ErrorResponse({
        status: 400,
        message: 'User not found',
      });
    }

    logger.info({ message: 'Generating OTP' });
    const otpCode = generateFiveDigitNumber();
    logger.info({ message: 'OTP Generated' });
    await prisma.auth.update({
      where: { id: auth.id },
      data: { otp: otpCode, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });

    logger.info({ message: 'Sending OTP TO' + auth.phone });
    // TODO: Send SMS/Email OTP to user
    logger.log({ code: otpCode });
    return SuccessResponse({
      status: 201,
      message: `Your OTP is ${otpCode}`,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
