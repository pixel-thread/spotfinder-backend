import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../token/verifyToken";
import { getUserById } from "@/services/user/getUserById";
import { prisma } from "@lib/db";

export async function adminMiddleware(req: NextRequest | Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new Error("Unauthorized", {
      cause: { status: 401 },
    });
  }

  const decoded = await verifyToken(token);

  if (!decoded?.id) {
    throw new Error("Unauthorized", {
      cause: { status: 401 },
    });
  }

  const user = await getUserById({ id: decoded.id });

  if (!user) {
    throw new Error("User not found");
  }

  const tokenRecord = await prisma.token.findFirst({
    where: {
      authId: user?.auth?.id,
      token: token,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!tokenRecord) {
    throw new Error("Unauthorized", {
      cause: { status: 401 },
    });
  }

  if (user.role !== "SUPERADMIN" && user.role !== "ADMIN") {
    throw new Error("Unauthorized: User is not a SUPERADMIN | ADMIN");
  }

  // Pass through if everything checks out
  return NextResponse.next();
}
