import z from "zod";

import { isValidIso } from "@/utils/date";

export const CommonSchema = {
  isoDatetimeString: z.string().superRefine((val, ctx) => {
    if (!isValidIso(val)) {
      ctx.addIssue({
        code: "invalid_format",
        format: "iso_datetime",
      });
    }
  }),
};
