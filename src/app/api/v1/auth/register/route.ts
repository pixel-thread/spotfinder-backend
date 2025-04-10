import { prisma } from "@/lib/db";
import { createUser } from "@/services/user/createUser";
import { getUserById } from "@/services/user/getUserById";
import { getAuthByPhone } from "@/services/auth/getAuthByPhone";
import { handleApiErrors } from "@/utils/errors/handleApiErrors";
import { addDays } from "@/utils/token/addDays";
import { generateToken } from "@/utils/token/generateToken";
import { registerSchema } from "@/utils/validation/auth/register";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/services/user/getUserByEmail";
import { addNewToken } from "@/services/token/addNewToken";

export async function POST(req: NextRequest) {
  try {
    const body = registerSchema.parse(await req.json());
    const existingUser = await getAuthByPhone({ phone: body.phone });
    const existingEmail = await getUserByEmail({ email: body.email });

    if (existingUser || existingEmail) {
      return NextResponse.json(
        { message: "User already exists by this phone no or email" },
        { status: 400 },
      );
    }

    const createdUser = await createUser({ data: body });
    const token = await generateToken<string>({ id: createdUser.userId });
    const user = await getUserById({ id: createdUser.userId });
    if (!user) {
      return NextResponse.json(
        { message: "Please try again" },
        { status: 404 },
      );
    }

    await addNewToken({
      authId: user?.auth?.id || "",
      token: token,
      agent: req.headers.get("user-agent") || "N/A",
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
