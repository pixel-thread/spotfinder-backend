import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { addParking } from '@/services/parking/addParking';
import { getAllParking } from '@/services/parking/getAllParking';
import { getUserById } from '@/services/user/getUserById';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { tokenMiddleware } from '@/utils/middleware/tokenMiddleware';
import { getMeta } from '@/utils/pagination/getMeta';
import { Prisma } from '@schema/index';
import { NextRequest } from 'next/server';
import { ID, appWriteStorage } from '@/lib/config/appwrite';
import { env } from '@/env';

// GET function remains unchanged
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const q = searchParams.get('q') || '';

    const where: Prisma.ParkingLotWhereInput = {
      deletedAt: null,
      status: 'ACTIVE',
      AND: [
        {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { address: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { features: { has: q } },
          ],
        },
      ],
    };

    const [parking, totalParking] = await getAllParking({
      page: page,
      where,
    });

    return SuccessResponse({
      data: parking,
      meta: getMeta({ total: totalParking, currentPage: page }),
      message: 'Successfully fetched parking lots',
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(req: Request) {
  try {
    // Middleware Authentication
    const isTokenInvalid = await tokenMiddleware(req);
    if (isTokenInvalid) {
      return isTokenInvalid;
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return ErrorResponse({ status: 400, message: 'Content-Type must be multipart/form-data' });
    }

    const formData = await req.formData();
    const userId = formData.get('userId')?.toString();
    // Extract file
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';
    const galaryImage = formData.getAll('gallery') as File[];
    const galleryUrl: string[] = [];

    if (imageFile) {
      if (userId) {
        const uploaded = await appWriteStorage.createFile(
          env.APPWRITE_BUCKET_ID,
          ID.unique(),
          imageFile,
          [`read("any")`],
        );
        imageUrl = `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${env.APPWRITE_PROJECT_ID}`;
      }
    }
    if (galaryImage.length > 0) {
      for (const file of galaryImage) {
        const uploaded = await appWriteStorage.createFile(
          env.APPWRITE_BUCKET_ID,
          ID.unique(),
          file,
        );
        galleryUrl.push(
          `${env.APPWRITE_ENDPOINT}/storage/buckets/${env.APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${env.APPWRITE_PROJECT_ID}`,
        );
      }
    }
    // Extract fields
    const name = formData.get('name')?.toString();
    const address = formData.get('address')?.toString();
    const price = formData.get('price')?.toString();
    const description = formData.get('description')?.toString();
    const openHours = formData.get('openHours')?.toString() || '24/7';
    const features = formData.getAll('features').map((item) => item.toString());
    const gallery = galleryUrl;

    // Validate required fields
    if (!userId || !name || !address || !price || !description) {
      return ErrorResponse({ status: 400, message: 'Missing required fields' });
    }

    const user = await getUserById({ id: userId });
    if (!user) {
      return ErrorResponse({ status: 404, message: 'User not found' });
    }

    const parkingData = {
      userId,
      name,
      address,
      price: Number(price),
      description,
      openHours,
      features,
      gallery,
      image: imageUrl,
    };

    const parking = await addParking({ data: parkingData, userId: user.id });

    return SuccessResponse({
      data: parking,
      message: 'Successfully created parking lot with image',
    });
  } catch (error) {
    console.error(error);
    return handleApiErrors(error);
  }
}
