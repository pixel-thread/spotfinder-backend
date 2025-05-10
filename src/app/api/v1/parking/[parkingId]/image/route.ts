import { env } from '@/env';
import { appWriteStorage } from '@/lib/config/appwrite';
import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { ID, Permission, Role } from 'node-appwrite';

export async function GET(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    const isTokenInvalid = await tokenMiddleware(req);

    if (isTokenInvalid) {
      return isTokenInvalid;
    }
    const isParkingExists = await getParkingLotById({ id: parkingId });
    if (!isParkingExists) {
      return ErrorResponse({ status: 404, message: 'Parking not found' });
    }
    return SuccessResponse({
      data: { url: isParkingExists.image },
      message: 'Parking images fetch successfully',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    const isTokenInvalid = await tokenMiddleware(req);

    if (isTokenInvalid) {
      return isTokenInvalid;
    }

    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return ErrorResponse({ status: 400, message: 'Content-Type must be multipart/form-data' });
    }
    const isParkingExists = await getParkingLotById({ id: parkingId });
    if (!isParkingExists) {
      return ErrorResponse({ status: 404, message: 'Parking not found' });
    }

    const formData = await req.formData();

    const galaryImage = formData.get('image') as File;

    if (!galaryImage) {
      return ErrorResponse({ status: 400, message: 'Gallery image is required' });
    }

    let url = '';
    if (galaryImage) {
      const uploaded = await appWriteStorage.createFile(
        env.APPWRITE_BUCKET_ID,
        ID.unique(),
        galaryImage,
        [
          Permission.read(Role.any()), // Anyone can view this document
        ],
      );
      url = `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${env.APPWRITE_PROJECT_ID}`;
    }

    const parking = await prisma.parkingLot.update({
      where: { id: parkingId },
      data: { image: url },
    });
    return SuccessResponse({ data: parking, message: 'image updated successfully' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
