import "@/server/dependencies";

import type { NextRequest } from "next/server";

import { container } from "@/server/container";
import { EventController } from "@/server/controllers/event.controller";

// GET /api/events
export async function GET(request: NextRequest) {
  // イベントコントローラーを解決
  const eventController = container.resolve(EventController);
  // イベントを取得
  return await eventController.getEvents(request);
}

// POST /api/events
export async function POST(request: NextRequest) {
  // イベントコントローラーを解決
  const eventController = container.resolve(EventController);
  // イベントを作成
  return await eventController.createEvent(request);
}
