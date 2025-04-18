import { Prisma } from '../../../prisma/generated/client';

export type AuthContextT = {
  user: null | Prisma.UserCreateInput;
  isAuthLoading: boolean;
};
