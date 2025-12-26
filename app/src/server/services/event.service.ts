import type { Events } from "@/generated/prisma";
import { TransactionManager } from "@/lib/prisma";
import { Prefecture } from "@/shared/common/enums/prefecture.enum";

import { EventRepository } from "../repositories/event.repository";

export type SearchEventsParams = {
  name?: string;
  from?: string;
  to?: string;
};

export type CreateEventParams = {
  name: string;
  description: string | null;
  eventStartDatetime: Date;
  eventEndDatetime: Date;
  capacity: number;
  prefecture: Prefecture;
};

export class EventService {
  private transactionManager: TransactionManager;
  private eventRepository: EventRepository;

  constructor(
    transactionManager: TransactionManager,
    eventRepository: EventRepository
  ) {
    this.transactionManager = transactionManager;
    this.eventRepository = eventRepository;
  }

  /**
   * イベントを取得
   * @returns 取得結果
   */
  async getEvents(
    prefecture: number | undefined,
    keyword: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
    newarrival: boolean | undefined,
    order: string | undefined
  ): Promise<Events[]> {
    // イベントを取得
    const events = await this.eventRepository.findMany(
      prefecture,
      keyword,
      from,
      to,
      newarrival,
      order
    );

    // 取得結果を返す
    return events;
  }

  /**
   * イベントを作成
   * @param params 作成パラメータ
   * @returns 作成結果
   */
  async createEvent(params: CreateEventParams): Promise<Events> {
    // 作成パラメータを分解
    const {
      name,
      description,
      eventStartDatetime,
      eventEndDatetime,
      capacity,
      prefecture,
    } = params;

    // トランザクションを開始
    return await this.transactionManager.execute(async (tx) => {
      // イベントを作成
      const event = await this.eventRepository.create(
        {
          name,
          description,
          eventStartDatetime,
          eventEndDatetime,
          capacity,
          prefecture,
        },
        tx
      );

      // 作成結果を返す
      return event;
    });
  }
}
