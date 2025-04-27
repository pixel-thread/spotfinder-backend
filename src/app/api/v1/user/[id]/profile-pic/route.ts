import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { verifyToken } from '@/utils/token/verifyToken';
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { updateUserProfilePic } from '@/services/user/updateUserProfilePic';

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

    // Create a unique filename
    const timestamp = new Date().getTime();
    const filename = `${userId}_${timestamp}_${file.name.replace(/\s+/g, '_')}`;

    // Define the upload directory and ensure it exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pics');

    try {
      // Convert the file to a buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write the file to the filesystem
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      // Save the file path to the user's profile in the database
      const imageUrl = `/uploads/profile-pics/${filename}`;

      // Update user profile with the new image URL
      const updatedUser = await updateUserProfilePic({
        userId: userId,
        profilePicUrl: imageUrl,
      });

      return SuccessResponse({
        status: 200,
        message: 'Profile picture updated successfully',
        data: {
          user: updatedUser,
          imageUrl: imageUrl,
        },
      });
    } catch (error) {
      console.error('Error saving file:', error);
      return ErrorResponse({
        status: 500,
        message: 'Failed to save image',
      });
    }
  } catch (error) {
    return handleApiErrors(error);
  }
}
