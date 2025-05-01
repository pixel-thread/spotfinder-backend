import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getAuthByPhone } from '@/services/auth/getAuthByPhone';
import { updateAuthPassword } from '@/services/auth/updatePassword';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
// import { hashPassword } from '@/utils/hash/hashPassword';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { registerSchema } from '@/utils/validation/auth/register';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await tokenMiddleware(req);
    const { id } = await params;

    if (!id) {
      return ErrorResponse({ message: 'User ID is required' });
    }

    const isUserExist = await getUserById({ id });
    if (!isUserExist) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }
    if (!isUserExist.auth?.phone) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }
    const authUser = await getAuthByPhone({ phone: isUserExist.auth?.phone });
    if (!authUser) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }
    const data = registerSchema.pick({ password: true }).parse(await req.json());
    // const hashPass = await hashPassword(data.password);
    // if (authUser?.password === hashPass) {
    //   return ErrorResponse({ message: 'Please enter a different password', status: 400 });
    // }

    const user = await updateAuthPassword({ data, id });
    return SuccessResponse({ data: user, message: 'Successfully updated password' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
