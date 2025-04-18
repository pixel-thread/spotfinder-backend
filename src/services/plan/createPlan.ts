import { prisma } from '@/lib/db';
import { Prisma } from '@schema/index';
type CreatePlanProps = {
  data: Prisma.PlanCreateInput;
};
export async function createPlan({ data }: CreatePlanProps) {
  return await prisma.plan.create({ data: data });
}
