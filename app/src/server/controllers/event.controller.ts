import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Events } from "@/generated/prisma";
import { BaseController } from "@/server/controllers/base.controller";
import { validateRequestBody } from "@/server/utils/validation";
import { CreateEventParamsSchema } from "@/shared/requests/schemas/event.schema";
import type { CreateEventRequest } from "@/shared/requests/types/event.type";
import { ErrorType } from "@/shared/response/enums/error-type.enum";
import type {
  CreateEventResponse,
  Event,
  SearchEventsResponse,
} from "@/shared/response/types/event.type";
import { isValidIso, parseIso, toIso } from "@/utils/date";

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
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const prefecture = searchParams.get("prefecture");
    const newarrival = searchParams.get("new");
    const order = searchParams.get("order");
    const invalidParams: Record<string, string> = {};

    if (keyword !== null) {
      if (keyword.length > 40) {
        invalidParams.keyword = "please enter within 40 characters";
      }
    }

    if (from !== null) {
      if (!isValidIso(from)) {
        invalidParams.from = "please enter a valid ISO 8601 datetime";
      }
    }

    if (to !== null) {
      if (!isValidIso(to)) {
        invalidParams.to = "please enter a valid ISO 8601 datetime";
      }
    }

    if (from !== null && to !== null && isValidIso(from) && isValidIso(to)) {
      const fromDate = parseIso(from);
      const toDate = parseIso(to);
      if (fromDate > toDate) {
        invalidParams.to = "please enter a date after  from";
      }
    }

    const prefectureNumber =
      prefecture !== null ? Number(prefecture) : undefined;
    if (prefecture !== null && prefectureNumber !== undefined) {
      if (
        isNaN(prefectureNumber) ||
        prefectureNumber < 1 ||
        prefectureNumber > 47
      ) {
        invalidParams.prefecture = "please enter a number between 1 and 47";
      }
    }

    if (newarrival !== null) {
      if (newarrival !== "true" && newarrival !== "false") {
        invalidParams.new = "please enter true or false";
      }
    }

    if (order !== null) {
      if (order !== "asc" && order !== "desc")
        invalidParams.order = "please enter asc or desc";
    }

    if (Object.keys(invalidParams).length > 0) {
      return NextResponse.json<SearchEventsResponse>(
        {
          error: {
            message: "Invalid query parameters",
            type: ErrorType.INVALID_PARAMETER,
            fields: invalidParams,
          },
        },
        { status: 400 }
      );
    }

    // イベントを取得
    const events = await this.eventService.getEvents(
      prefectureNumber,
      keyword !== null ? keyword : undefined,
      from !== null ? parseIso(from) : undefined,
      to !== null ? parseIso(to) : undefined,
      newarrival !== "",
      order !== null ? order : undefined
    );

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
        prefecture,
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
        prefecture,
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
      prefecture: event.prefecture,
      createdAt: toIso(event.createdAt),
      updatedAt: toIso(event.updatedAt),
    };
  }
}
