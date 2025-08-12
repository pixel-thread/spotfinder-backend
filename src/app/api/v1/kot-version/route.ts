import { prisma } from '@/lib/db';
import { SuccessResponse } from '@/lib/successResponse';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { logger } from '@/utils/logger';
import { z } from 'zod';

const schema = z.object({
  version: z.string(),
  title: z.string(),
  description: z.array(z.string()),
  mandatory: z.boolean(),
  platforms: z.array(z.string()),
  release_notes_url: z.string(),
  min_supported_version: z.string(),
  release_date: z.string(),
  author: z.string(),
  additional_info: z.object({
    estimated_downtime: z.string(),
    rollback_available: z.boolean(),
  }),
});

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const deviceId = searchParams.get('id');
    const version = await prisma.kotAppVersion.findMany({
      orderBy: { created_at: 'desc' },
      take: 1,
    });

    if (deviceId) {
      const isDeviceExist = await prisma.kotAppUser.findUnique({ where: { deviceId } });
      if (!isDeviceExist) {
        await prisma.kotAppUser.create({ data: { lastUsedAt: new Date(), deviceId } });
      }
      await prisma.kotAppUser.update({
        where: { deviceId: deviceId },
        data: { lastUsedAt: new Date() },
      });
    }
    return SuccessResponse({ message: 'latest update', data: version[0] });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const isVersionExists = await prisma.kotAppVersion.findFirst({
      where: {
        version: body.version,
      },
    });

    if (isVersionExists) {
      return SuccessResponse({ message: 'version already exists' });
    }

    const version = await prisma.kotAppVersion.create({
      data: {
        version: body.version,
        title: body.title,
        description: body.description,
        mandatory: body.mandatory,
        platforms: body.platforms,
        release_notes_url: body.release_notes_url,
        min_supported_version: body.min_supported_version,
        release_date: new Date(),
        author: body.author,
        additional_info: body.additional_info,
      },
    });
    return SuccessResponse({ message: 'version created', data: version });
  } catch (error) {
    return handleApiErrors(error);
  }
}

export async function PUT(request: Request) {
  try {
    logger.info(request.url);
    const kot = await prisma.kotAppUser.findMany({
      select: { lastUsedAt: true },
    });
    return SuccessResponse({
      message: 'Kot Users',
      data: {
        total: kot.length,
        data: kot,
      },
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
