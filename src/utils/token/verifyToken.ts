import { env } from "@/env";
import { JWTPayload, jwtVerify } from "jose";

interface Decoded extends JWTPayload {
  id: string;
}

export const verifyToken = async (token: string): Promise<Decoded> => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload as Decoded;
};
