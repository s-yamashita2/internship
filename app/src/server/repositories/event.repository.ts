import type { Events, Prisma, PrismaClient } from "@/generated/prisma";
import { Prefecture } from "@/shared/common/enums/prefecture.enum";

import { BaseRepository } from "./base.repository";

export type CreateParams = {
  name: string;
  description: string | null;
  eventStartDatetime: Date;
  eventEndDatetime: Date;
  capacity: number;
  prefecture: Prefecture;
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
        prefecture: params.prefecture,
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
    prefecture: number | undefined,
    keyword: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
    newarrival: boolean | undefined,
    order: string | undefined,
    tx: Prisma.TransactionClient = this.prisma
  ): Promise<Events[]> {
    const events = await tx.events.findMany({
      where: {
        prefecture: prefecture,
        OR: [
          { name: { contains: keyword ?? "" } },
          { description: { contains: keyword ?? "" } },
        ],
        eventStartDatetime: {
          gt: from,
        },
        eventEndDatetime: {
          lt: to,
        },
      },
    });

    return events;
  }
}
