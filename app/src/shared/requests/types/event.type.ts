import { z } from "zod";

import { CreateEventParamsSchema } from "../schemas/event.schema";

/**
 * イベント作成リクエストの型
 */
export type CreateEventRequest = z.infer<typeof CreateEventParamsSchema>;
