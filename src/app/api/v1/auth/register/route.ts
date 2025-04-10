import { prisma } from "@/lib/db";
import { getAuthByEmail } from "@/services/auth/getAuthByEmail";
import { createUser } from "@/services/user/createUser";
import { getUserById } from "@/services/user/getUserById";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { generateToken } from "@/utils/token/generateToken";
import { registerSchema } from "@/utils/validation/auth/register";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = registerSchema.parse(await req.json());
    const user = await getAuthByEmail({ email: body.email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const createdUser = await createUser({ data: body });
    const token = await generateToken<string>({ id: createdUser.id });
    const auth = await getUserById({ id: createdUser.id });
    await prisma.token.create({
      data: {
        authId: auth?.auth?.id || "",
        token: token,
        agent: req.headers.get("user-agent") || "N/A",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    return NextResponse.json({
      success: true,
      data: createdUser,
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
