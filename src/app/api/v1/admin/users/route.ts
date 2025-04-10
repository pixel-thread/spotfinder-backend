import { ErrorResponse } from "@/lib/errorResponse";
import { SuccessResponse } from "@/lib/successResponse";
import { getAllUsers } from "@/services/user/getAllUsers";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { superAdminMiddleware } from "@/utils/middleware/superAdminMiddleware";

export async function GET(req: Request) {
  try {
    await superAdminMiddleware(req);
    const users = await getAllUsers();
    if (!users) {
      return ErrorResponse({ message: "User not found", status: 404 });
    }
    return SuccessResponse({ data: users, status: 200 });
  } catch (error) {
    return handleApiErrors(error);
  }
}
