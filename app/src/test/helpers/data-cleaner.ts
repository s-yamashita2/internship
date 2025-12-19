import { Prisma, PrismaClient } from "@/generated/prisma";

export class DataCleaner {
  constructor(private readonly prisma: PrismaClient) {}

  async clean(tables: Prisma.ModelName[] = Object.values(Prisma.ModelName)) {
    // 外部キー制約のチェックを無効化
    await this.prisma.$queryRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);

    try {
      for (const table of tables) {
        // TRUNCATE TABLE を使用してテーブルをリセット
        await this.prisma.$queryRawUnsafe(`TRUNCATE TABLE \`${table}\``);

        // コネクションプールの負荷を下げるため短い待機
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    } finally {
      // 外部キー制約のチェックを再度有効化
      await this.prisma.$queryRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);
    }
  }
}
