const defaultTokenRateLimit = {
    windowMs: 15 * 60 * 1000,
    max: 3,
};

export const tokenRateLimit = {
    ...defaultTokenRateLimit,
    keyGenerator: (req: any, res: any) => {
        return req.user.username;
    }
};
