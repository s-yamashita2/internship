import z from "zod";

import { Prefecture } from "@/shared/common/enums/prefecture.enum";

import { CommonSchema } from "./common.schema";

export const CreateEventParamsSchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(500).optional(),
    eventStartDatetime: CommonSchema.isoDatetimeString,
    eventEndDatetime: CommonSchema.isoDatetimeString,
    capacity: z.number().min(1),
    prefecture: z
      .enum(Prefecture, { error: "prefecture must be a valid enum value" })
      .refine((val) => val !== undefined, {
        error: "prefecture is required",
      }),
  })
  .superRefine(({ eventStartDatetime, eventEndDatetime }, ctx) => {
    if (
      eventStartDatetime &&
      eventEndDatetime &&
      eventStartDatetime >= eventEndDatetime
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["eventEndDatetime"],
        message: "eventEndDatetime must be after than eventStartDatetime",
      });
    }
  });
