import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserById } from '@/services/user/getUserById';
import { updateUser } from '@/services/user/updateUser';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
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
    const data = registerSchema.pick({ email: true, name: true }).parse(await req.json());
    const user = await updateUser({ data, id });
    return SuccessResponse({ data: user, message: 'Successfully updated user' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
