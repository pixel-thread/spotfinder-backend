import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserById } from '@/services/user/getUserById';
import { updateUserRole } from '@/services/user/updateUserRole';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';
import { z } from 'zod';

const ModelSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
    })
    .uuid({
      message: 'User ID must be a valid UUID',
    }),
  role: z
    .enum(['SUPER_ADMIN', 'USER', 'PARTNER'], {
      required_error: 'Role is required',
    })
    .default('USER'),
});

export async function PATCH(req: Request) {
  try {
    await superAdminMiddleware(req);
    const body = ModelSchema.parse(await req.json());

    const user = await getUserById({ id: body.userId });

    if (!user) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }

    if (user.role === body.role) {
      return ErrorResponse({
        message: 'User already has this role',
        status: 400,
      });
    }

    const updatedUser = await updateUserRole({ data: body });

    if (!updatedUser) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }

    return SuccessResponse({
      data: updatedUser,
      status: 200,
      message: 'User updated successfully',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
