import { Prisma } from '../../../prisma/generated/client';

export type AuthContextT = {
  user: null | Prisma.UserCreateInput;
  isSuperAdmin: boolean;
  isAuthLoading: boolean;
  refresh: () => void;
};
