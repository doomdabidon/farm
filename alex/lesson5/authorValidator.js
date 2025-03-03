const { z } = require("zod");

const authorNameValidator = z.object({
    authorName: z.string()
        .min(3, "The author name cannot be less 3 symbols")
        .max(60, "The author name cannot be more then 60 symbols")
});

const authorBodyValidator = z.object({
    id: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(2000, "Wrong Id, max is 2000"),
    name: z.string()
        .min(3, "The author name cannot be less 3 symbols")
        .max(60, "The author name cannot be more then 60 symbols"),
    authorId: z.string()
        .min(1, "Wrong Id, min is 1")
        .max(2000, "Wrong Id, max is 2000")
})

module.exports = { authorBodyValidator, authorNameValidator }