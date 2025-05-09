import { env } from '@/env';
import { appWriteStorage } from '@/lib/config/appwrite';
import { prisma } from '@/lib/db';
import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getParkingLotById } from '@/services/parking/getParkingLotById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { logger } from '@/utils/logger';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { ID } from 'node-appwrite';
import { z } from 'zod';

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

    const galaryImage = formData.get('gallery') as File;

    if (!galaryImage) {
      return ErrorResponse({ status: 400, message: 'Gallery image is required' });
    }
    const galleryUrl: string[] = [];

    if (galaryImage) {
      const uploaded = await appWriteStorage.createFile(
        env.APPWRITE_BUCKET_ID,
        ID.unique(),
        galaryImage,
      );
      logger.log({
        message: 'File uploaded successfully',
        uploaded,
      });
      galleryUrl.push(
        `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${env.APPWRITE_PROJECT_ID}`,
      );
    }

    const gallery = galleryUrl;
    logger.log(gallery);
    const parking = await prisma.parkingLot.update({
      where: { id: parkingId },
      data: { gallery: [...isParkingExists.gallery, ...gallery] },
    });
    return SuccessResponse({ data: parking, message: 'Parking updated successfully' });
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
    const isTokenInvalid = await tokenMiddleware(req);

    if (isTokenInvalid) {
      return isTokenInvalid;
    }

    const isParkingExists = await getParkingLotById({ id: parkingId });

    if (!isParkingExists) {
      return ErrorResponse({ status: 404, message: 'Parking not found' });
    }

    const body = z
      .object({
        url: z.string().url(),
      })
      .parse(await req.json());

    const isImageExist = isParkingExists.gallery.find((item) => item === body.url);

    if (!isImageExist || isImageExist.length === 0) {
      return ErrorResponse({ status: 404, message: 'Gallery image not found' });
    }

    const gallery = isParkingExists.gallery.filter((item) => item !== body.url);

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
