import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { getMeta } from '@/utils/pagination/getMeta';
import { Prisma } from '@schema/index';
import { getAllParking } from '@/services/parking/getAllParking';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
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

    const [items, total] = await getAllParking({ where });

    const meta = getMeta({ total, currentPage: page });

    return Response.json({
      success: true,
      message: 'Successfully fetched parking lots',
      data: items,
      meta,
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
