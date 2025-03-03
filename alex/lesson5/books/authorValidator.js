const { z } = require("zod");

const authorNameValidator = z.object({
    authorName: z.string()
        .min(3, "The author name cannot be less 3 symbols")
        .max(60, "The author name cannot be more then 60 symbols")
});

module.exports = authorNameValidator