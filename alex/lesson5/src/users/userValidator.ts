import { z } from "zod";

export const userBodyValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(2000, "Wrong Id, max is 2000")
        .optional(),
    username: z.string()
        .min(3, "The username cannot be less 3 symbols")
        .max(60, "The username cannot be more then 60 symbols"),
    password: z.string()
        .min(3, "The password cannot be less 3 symbols")
        .max(60, "The password cannot be more then 60 symbols")
})
export const userLoginValidator = z.object({
    username: z.string()
        .min(3, "The name cannot be less 3 symbols")
        .max(60, "The name cannot be more then 60 symbols"),
    password: z.string()
        .min(3, "The password cannot be less 3 symbols")
        .max(60, "The password cannot be more then 60 symbols")
})
