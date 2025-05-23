import { env } from '@/env';
import { appWriteStorage } from '@/lib/config/appwrite';
import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { logger } from '@/utils/logger';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { ID, Permission, Role } from 'node-appwrite';
import { z } from 'zod';

export async function GET(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    await tokenMiddleware(req);

    const isParkingExists = await getParkingLotById({ id: parkingId });

    if (!isParkingExists) {
      return ErrorResponse({ status: 404, message: 'Parking not found' });
    }
    return SuccessResponse({
      data: isParkingExists.gallery,
      message: 'Gallery images fetch successfully',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    const { parkingId } = await params;

    // Check if the parking ID is provided
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }

    // Validate token
    await tokenMiddleware(req);

    // Check if the content type is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    logger.log({
      name: 'Content-Type',
      contentType,
    });

    if (!contentType.includes('multipart/form-data')) {
      return ErrorResponse({ status: 400, message: 'Content-Type must be multipart/form-data' });
    }

    // Fetch the parking lot by ID
    const isParkingExists = await getParkingLotById({ id: parkingId });
    if (!isParkingExists) {
      return ErrorResponse({ status: 404, message: 'Parking not found' });
    }

    // Parse the form data
    const formData = await req.formData();

    // Retrieve the gallery image from the form data
    const galleryImage = formData.get('gallery');

    if (!galleryImage) {
      return ErrorResponse({ status: 400, message: 'Gallery image is required' });
    }

    // Validate that the uploaded file is an image
    if (!(galleryImage instanceof File)) {
      return ErrorResponse({ status: 400, message: 'Uploaded file is not valid' });
    }

    const galleryUrl: string[] = [];

    // Upload the image to Appwrite storage
    const uploaded = await appWriteStorage.createFile(
      env.APPWRITE_BUCKET_ID,
      ID.unique(),
      galleryImage,
      [Permission.read(Role.any())],
    );

    galleryUrl.push(
      `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${env.APPWRITE_PROJECT_ID}`,
    );

    // Update the parking lot's gallery with the new image URL
    const updatedParking = await prisma.parkingLot.update({
      where: { id: parkingId },
      data: { gallery: [...isParkingExists.gallery, ...galleryUrl] },
    });

    return SuccessResponse({
      data: updatedParking,
      message: 'Gallery updated successfully',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ parkingId: string }> }) {
  try {
    const { parkingId } = await params;
    if (!parkingId) {
      return ErrorResponse({ message: 'Parking ID is required' });
    }
    await tokenMiddleware(req);

    const isParkingExists = await getParkingLotById({ id: parkingId });

    if (!isParkingExists) {
      return ErrorResponse({ status: 404, message: 'Parking not found' });
    }

    const body = z
      .object({
        url: z.string().url(),
      })
      .parse(await req.json());

    const isImageExist = isParkingExists.gallery.find((item: string) => item === body.url);

    if (!isImageExist || isImageExist.length === 0) {
      return ErrorResponse({ status: 404, message: 'Gallery image not found' });
    }

    const gallery = isParkingExists.gallery.filter((item: string) => item !== body.url);

    if (!gallery || gallery.length === 0) {
      return ErrorResponse({ status: 404, message: 'Gallery image not found' });
    }
    const parking = await prisma.parkingLot.update({
      where: { id: parkingId },
      data: { gallery },
    });
    return SuccessResponse({ data: parking, message: 'Parking updated successfully' });
  } catch (error) {
    return handleApiErrors(error);
  }
}
