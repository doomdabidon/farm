import { z } from "zod";

export const bookBodyValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(2000, "Wrong Id, max is 2000")
        .optional(),
    title: z.string()
        .min(3, "The title cannot be less 3 symbols")
        .max(60, "The title cannot be more then 60 symbols"),
    author: z.object({
        id: z.string()
            .min(1, "Wrong Id, min is 1")
            .max(2000, "Wrong Id, max is 2000")
    })
})
