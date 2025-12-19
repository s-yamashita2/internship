import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Events } from "@/generated/prisma";
import { BaseController } from "@/server/controllers/base.controller";
import { validateRequestBody } from "@/server/utils/validation";
import { CreateEventParamsSchema } from "@/shared/requests/schemas/event.schema";
import type { CreateEventRequest } from "@/shared/requests/types/event.type";
import type {
  CreateEventResponse,
  Event,
  SearchEventsResponse,
} from "@/shared/response/types/event.type";
import { parseIso, toIso } from "@/utils/date";

import { EventService } from "../services/event.service";

export class EventController extends BaseController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    super();
    this.eventService = eventService;
  }

  /**
   * イベントを取得
   * @param request NextRequest
   * @returns NextResponse
   */
  async getEvents(
    request: NextRequest
  ): Promise<NextResponse<SearchEventsResponse>> {
    // イベントを取得
    const events = await this.eventService.getEvents();

    // PrismaのEvents型をEvent型に変換
    const data: Event[] = events.map(this.convertToEvent);

    // 取得結果を返す
    return NextResponse.json<SearchEventsResponse>({ data });
  }

  /**
   * イベントを作成
   * @param request NextRequest
   * @returns NextResponse
   */
  async createEvent(
    request: NextRequest
  ): Promise<NextResponse<CreateEventResponse>> {
    // リクエストを処理して結果を返す
    return this.handleRequest<Event>(request, async () => {
      // リクエストボディを検証
      const {
        name,
        description,
        eventStartDatetime,
        eventEndDatetime,
        capacity,
      } = await validateRequestBody<CreateEventRequest>(
        request,
        CreateEventParamsSchema
      );

      // イベントを作成
      const event = await this.eventService.createEvent({
        name,
        description: description ?? null,
        eventStartDatetime: parseIso(eventStartDatetime),
        eventEndDatetime: parseIso(eventEndDatetime),
        capacity,
      });

      // PrismaのEvents型をEvent型に変換
      const data: Event = this.convertToEvent(event);

      // 作成結果を返す
      return { data, status: 201 };
    });
  }

  private convertToEvent(event: Events): Event {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      eventStartDatetime: toIso(event.eventStartDatetime),
      eventEndDatetime: toIso(event.eventEndDatetime),
      capacity: event.capacity,
      createdAt: toIso(event.createdAt),
      updatedAt: toIso(event.updatedAt),
    };
  }
}
