import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { sendEmailOTP } from '@/lib/mailer';
import { SuccessResponse } from '@/lib/successResponse';
import { renderOtpEmail } from '@/lib/templates/otpEmailTemplate';
import { getAuthByEmail } from '@/services/auth/getAuthByEmail';
import { createUser } from '@/services/user/createUser';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { generateSixDigitNumber } from '@/utils/generateFiveDigitNumber';
import { logger } from '@/utils/logger';
import { registerSchema } from '@/utils/validation/auth/register';

export async function POST(req: Request) {
  try {
    const body = registerSchema.pick({ email: true }).parse(await req.json());

    const isUserExist = await getAuthByEmail({ email: body.email });

    if (!isUserExist) {
      logger.info({ message: 'Creating new user' });
      await createUser({ data: { email: body.email, name: body.email.split('@')[0] } });
      logger.info({ message: 'User Created' });
    }

    const auth = await getAuthByEmail({ email: body.email });

    if (!auth) {
      logger.error({ message: 'User Not Found' });
      return ErrorResponse({
        status: 400,
        message: 'User not found',
      });
    }

    logger.info({ message: 'Generating OTP' });

    const otpCode = generateSixDigitNumber();

    logger.info({ message: 'OTP Generated' });

    await prisma.auth.update({
      where: { id: auth.id },
      data: { otp: otpCode, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });

    logger.info({ message: 'Sending OTP TO' });

    await sendEmailOTP({
      to: body.email,
      subject: 'Spot Finder OTP',
      text: `Your OTP is ${otpCode}`,
      html: renderOtpEmail({
        userName: auth.user.name,
        otpCode: String(otpCode),
        appName: 'Spot Finder',
      }),
    });

    logger.info({ message: 'OTP Sent Successfully' });

    return SuccessResponse({
      status: 201,
      message: 'OTP Sent Successfully to your email',
    });
  } catch (error) {
    logger.error({ message: 'Auth Init Error=>', error });
    return handleApiErrors(error);
  }
}
