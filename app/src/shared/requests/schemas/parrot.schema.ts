import z from "zod";

export const GetParrotParamsSchema = z.object({
  message: z.string().min(1).max(20),
});
