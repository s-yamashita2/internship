import type { Events, Prisma, PrismaClient } from "@/generated/prisma";

import { BaseRepository } from "./base.repository";

export type CreateParams = {
  name: string;
  description: string | null;
  eventStartDatetime: Date;
  eventEndDatetime: Date;
  capacity: number;
};

export class EventRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * イベントを作成
   * @param params 作成パラメータ
   * @param tx トランザクションクライアント
   * @returns 作成されたイベント
   */
  async create(
    params: CreateParams,
    tx: Prisma.TransactionClient = this.prisma
  ): Promise<Events> {
    return await tx.events.create({
      data: {
        name: params.name,
        description: params.description,
        eventStartDatetime: params.eventStartDatetime,
        eventEndDatetime: params.eventEndDatetime,
        capacity: params.capacity,
      },
    });
  }

  /**
   * イベントを取得
   * @param params 検索パラメータ
   * @param tx トランザクションクライアント
   * @returns 検索結果
   */
  async findMany(
    tx: Prisma.TransactionClient = this.prisma
  ): Promise<Events[]> {
    const events = await tx.events.findMany({});

    return events;
  }
}
