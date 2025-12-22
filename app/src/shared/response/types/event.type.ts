import { Prefecture } from "@/shared/common/enums/prefecture.enum";

import { ResponseData } from "./response.type";

export type Event = {
  id: number;
  name: string;
  description: string | null;
  eventStartDatetime: string;
  eventEndDatetime: string;
  capacity: number;
  prefecture: Prefecture;
  createdAt: string;
  updatedAt: string;
};

/**
 * イベント検索APIのレスポンス型
 */
export type SearchEventsResponse = ResponseData<Event[]>;

/**
 * イベント作成APIのレスポンス型
 */
export type CreateEventResponse = ResponseData<Event>;
