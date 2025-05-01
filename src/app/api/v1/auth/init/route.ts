import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getAuthByPhone } from '@/services/auth/getAuthByPhone';
import { createUser } from '@/services/user/createUser';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { registerSchema } from '@/utils/validation/auth/register';

const generateFiveDigitNumber = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export async function POST(req: Request) {
  try {
    const body = registerSchema.pick({ phone: true }).parse(await req.json());

    const isUserExist = await getAuthByPhone({ phone: body.phone });

    if (!isUserExist) {
      await createUser({ data: { phone: body.phone, name: body.phone } });
    }

    const auth = await getAuthByPhone({ phone: body.phone });

    if (!auth) {
      return ErrorResponse({
        status: 400,
        message: 'User not found',
      });
    }

    const otpCode = generateFiveDigitNumber();

    await prisma.auth.update({
      where: { id: auth.id },
      data: { otp: otpCode, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });

    // TODO: Send SMS/Email OTP to user
    return SuccessResponse({
      status: 200,
      message: `Your OTP is ${otpCode}`,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
