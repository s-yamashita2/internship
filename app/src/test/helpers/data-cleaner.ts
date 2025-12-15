import { Prisma, PrismaClient } from "@/generated/prisma";

export class DataCleaner {
  constructor(private readonly prisma: PrismaClient) {}

  async clean(tables: Prisma.ModelName[] = Object.values(Prisma.ModelName)) {
    for (const table of tables) {
      // TRUNCATE TABLE を使用してテーブルをリセット
      await this.prisma.$queryRawUnsafe(`TRUNCATE TABLE \`${table}\``);

      // コネクションプールの負荷を下げるため短い待機
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}
