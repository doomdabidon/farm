import { z } from "zod";

export const authorNameValidator = z.object({
    authorName: z.string()
        .min(3, "The author name cannot be less 3 symbols")
        .max(60, "The author name cannot be more then 60 symbols")
});

export const authorBodyValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(200000000, "Wrong Id, max is 2000")
        .optional(),
    name: z.string()
        .min(3, "The name cannot be less 3 symbols")
        .max(60, "The name cannot be more then 60 symbols")
})