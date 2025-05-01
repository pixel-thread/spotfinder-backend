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
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Ensures a directory exists. Creates it if it doesn't.
 */
async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error('Failed to ensure directory exists:', error);
    throw new Error('Failed to prepare upload directory.');
  }
}

/**
 * Saves a file buffer to the given directory.
 */
async function saveFile(uploadDir: string, filename: string, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);
}

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
    await tokenMiddleware(req);

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return ErrorResponse({ status: 400, message: 'Content-Type must be multipart/form-data' });
    }

    const formData = await req.formData();

    // Extract file
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';

    if (imageFile) {
      const timestamp = Date.now();
      const safeFilename = `parking_${timestamp}_${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploaded', 'image');

      await ensureDirectoryExists(uploadDir);
      await saveFile(uploadDir, safeFilename, imageFile);

      imageUrl = `/uploaded/image/${safeFilename}`;
    }

    // Extract fields
    const userId = formData.get('userId')?.toString();
    const name = formData.get('name')?.toString();
    const address = formData.get('address')?.toString();
    const price = formData.get('price')?.toString();
    const description = formData.get('description')?.toString();
    const openHours = formData.get('openHours')?.toString() || '24/7';
    const features = formData.getAll('features').map((item) => item.toString());
    const gallery = formData.getAll('gallery').map((item) => item.toString());

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
