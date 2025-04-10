import { prisma } from "@/lib/db";
import { SuccessResponse } from "@/lib/successResponse";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { superAdminMiddleware } from "@/utils/middleware/superAdminMiddleware";
import { tokenMiddleware } from "@/utils/middleware/tokenMiddleware";

export async function GET(req: Request) {
  try {
    await superAdminMiddleware(req);
    await tokenMiddleware(req);

    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 7);

    const [totalUsers, activeUsers, deviceStatsByDay, latestUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.token.count({
          where: {
            lastUsedAt: { gt: sevenDaysAgo },
          },
        }),
        prisma.token.groupBy({
          by: ["createdAt", "agent"],
          _count: true,
          where: {
            revoked: false,
            createdAt: {
              gte: sevenDaysAgo,
              lte: currentDate,
            },
          },
        }),
        prisma.user.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            createdAt: true,
            role: true,
            isVerified: true,
          },
        }),
      ]);

    // Group devices by date
    const deviceData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStats = deviceStatsByDay.filter(stat => 
        new Date(stat.createdAt).toISOString().split('T')[0] === dateStr
      );

      return {
        date: dateStr,
        desktop: dayStats.reduce((acc, { agent, _count }) => {
          const lowerAgent = agent?.toLowerCase() || "";
          return acc + (/windows|macintosh|linux/.test(lowerAgent) ? _count : 0);
        }, 0),
        mobile: dayStats.reduce((acc, { agent, _count }) => {
          const lowerAgent = agent?.toLowerCase() || "";
          return acc + (/mobile|android|ios/.test(lowerAgent) ? _count : 0);
        }, 0),
        other: dayStats.reduce((acc, { agent, _count }) => {
          const lowerAgent = agent?.toLowerCase() || "";
          return acc + (!(/windows|macintosh|linux|mobile|android|ios/.test(lowerAgent)) ? _count : 0);
        }, 0),
      };
    }).reverse(); // Most recent date first

    return SuccessResponse({
      message: "Dashboard data fetched successfully",
      data: {
        totalUsers,
        activeUsers,
        users: latestUsers,
        devices: deviceData,
      },
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
