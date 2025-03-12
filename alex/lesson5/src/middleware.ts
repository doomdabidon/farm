import { UserNotFoundError } from "./users/userNotFoundError";
import { ValidationError } from "./validationError";

export const validatorHandler = ({ querySchema, paramSchema, bodySchema }: any) => {
    return (req: { query: any; params: any; body: any; }, res: any, next: () => void) => {
        if (querySchema) {
            const validationResult = querySchema.safeParse(req.query)
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error);
            }
        }

        if (paramSchema) {
            const validationResult = paramSchema.safeParse(req.params)
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error);
            }
        }

        if (bodySchema) {
            const validationResult = bodySchema.safeParse(req.body)
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error);
            }
        }

        next();
    };
}

export const errorHandler = (err: Error, req: any, res: any, next: any) => {
    if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message });
    }
    if (err instanceof UserNotFoundError) {
        res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal Server Error", err });
};

