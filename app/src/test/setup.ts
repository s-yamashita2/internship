import { prisma } from "@/lib/prisma";
import { registerDependencies } from "@/server/dependencies";

import { DataCleaner } from "./helpers/data-cleaner";

beforeAll(async () => {
  // データをクリア
  await new DataCleaner(prisma).clean();

  // 依存関係を登録
  registerDependencies();
});

afterAll(async () => {
  // データをクリア
  await new DataCleaner(prisma).clean();
});
