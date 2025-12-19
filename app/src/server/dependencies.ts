import { prisma, TransactionManager } from "@/lib/prisma";
import { container } from "@/server/container";
import { EventController } from "@/server/controllers/event.controller";
import { EventRepository } from "@/server/repositories/event.repository";
import { EventService } from "@/server/services/event.service";

import { ParrotController } from "./controllers/parrot.controller";

/**
 * 依存関係を登録
 */
export function registerDependencies(): void {
  // Transaction Manager
  container.register(TransactionManager, () => {
    return new TransactionManager();
  });

  // Repository
  container.register(EventRepository, () => {
    return new EventRepository(prisma);
  });

  // Service
  container.register(EventService, () => {
    const transactionManager = container.resolve(TransactionManager);
    const eventRepository = container.resolve(EventRepository);
    return new EventService(transactionManager, eventRepository);
  });

  // Controller
  container.register(EventController, () => {
    const eventService = container.resolve(EventService);
    return new EventController(eventService);
  });
  container.register(ParrotController, () => {
    return new ParrotController();
  });
}

/**
 * 依存関係を初期化
 */
registerDependencies();
