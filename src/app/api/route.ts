import { SuccessResponse } from "@/lib/successResponse";

export async function GET(req: Request) {
  console.log("Here");
  return SuccessResponse({ message: "Hello world" });
}
