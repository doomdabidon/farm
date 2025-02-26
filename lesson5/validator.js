const { z } = require("zod");

export const getUserQuerySchema = z.object({
    id: z.string().min(1, "Id min length is 1"),
});

export const postUserBodySchema = z.object({
    user: z.object({
         name: z.string().min(1, "name min length is 1").max(10),
         password: z.string().min(1).max(10),
         profession: z.string().min(1).max(10).optional(),
    })
});
