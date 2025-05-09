import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { verifyToken } from '@/utils/token/verifyToken';
import { NextRequest } from 'next/server';
import { updateUserProfilePic } from '@/services/user/updateUserProfilePic';
import { appWriteStorage, ID } from '@/lib/config/appwrite';
import { env } from '@/env';

export async function PUT(req: NextRequest) {
  try {
    const isTokenNotValid = await tokenMiddleware(req);

    if (isTokenNotValid) {
      return isTokenNotValid;
    }
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return ErrorResponse({
        status: 401,
        message: 'Unauthorized',
      });
    }
    const decoded = await verifyToken(token);
    if (!decoded.id) {
      return ErrorResponse({
        status: 401,
        message: 'Unauthorized',
      });
    }

    const userId = decoded.id;

    if (!userId) {
      return ErrorResponse({ message: 'Unauthorized' });
    }

    const userExist = await getUserById({ id: userId });

    if (!userExist) {
      return ErrorResponse({
        status: 404,
        message: 'User not found',
      });
    }
    const contextType = req.headers.get('content-type') || '';

    if (!contextType.includes('multipart/form-data')) {
      return ErrorResponse({
        status: 400,
        message: 'Invalid content type',
      });
    }

    const formData = await req.formData();

    const file = formData.get('image') as File;

    if (!file) {
      return ErrorResponse({
        status: 400,
        message: 'Image is required',
      });
    }

    let imageUrl = '';

    if (userId) {
      const uploaded = await appWriteStorage.createFile(env.APPWRITE_BUCKET_ID, ID.unique(), file, [
        `read("any")`,
      ]);

      imageUrl = `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${env.APPWRITE_PROJECT_ID}`;
    }

    const updatedProfile = updateUserProfilePic({
      userId,
      url: imageUrl,
    });

    return SuccessResponse({
      message: 'Profile picture updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
