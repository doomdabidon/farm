const { z } = require("zod");

const userIdValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(2000, "Wrong Id, max is 2000")
});

const userBodyValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(2000, "Wrong Id, max is 2000"),
   username: z.string()
        .min(3, "The name cannot be less 3 symbols")
        .max(60, "The name cannot be more then 60 symbols"),
    password: z.string()
        .min(3, "The name cannot be less 3 symbols")
        .max(60, "The name cannot be more then 60 symbols")
})

module.exports = { userIdValidator, userBodyValidator }