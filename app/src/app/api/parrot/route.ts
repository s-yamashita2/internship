import "@/server/dependencies";

import { NextRequest } from "next/server";

import { container } from "@/server/container";
import { ParrotController } from "@/server/controllers/parrot.controller";

export async function GET(request: NextRequest) {
  // ここに処理を記述する
  const parrotController = container.resolve(ParrotController);
  return await parrotController.getParrots(request);
}
