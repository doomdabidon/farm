import { z } from "zod";

export const idValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(200000000, "Wrong Id, max is 2000")
});