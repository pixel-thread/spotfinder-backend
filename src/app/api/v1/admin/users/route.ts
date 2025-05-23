import { ErrorResponse } from '@/lib/errorResponse';
import { SuccessResponse } from '@/lib/successResponse';
import { getAllUsers } from '@/services/user/getAllUsers';
import { handleApiErrors } from '@/utils/errors/handleApiErrors';
import { superAdminMiddleware } from '@/utils/middleware/superAdminMiddleware';
import { getMeta } from '@/utils/pagination/getMeta';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const currentPage = searchParams.get('page') || '1';

    await superAdminMiddleware(req);

    const [users, total] = await getAllUsers({ page: currentPage });
    if (!users) {
      return ErrorResponse({ message: 'User not found', status: 404 });
    }
    return SuccessResponse({ data: users, meta: getMeta({ total, currentPage }), status: 200 });
  } catch (error) {
    return handleApiErrors(error);
  }
}
