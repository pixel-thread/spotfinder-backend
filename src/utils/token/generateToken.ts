import { env } from '@/env';
import { SignJWT } from 'jose';

type Props<T> = {
  id: T;
};

export const generateToken = async <T>({ id }: Props<T>): Promise<T> => {
  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return (await new SignJWT({ id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret))) as T;
};
