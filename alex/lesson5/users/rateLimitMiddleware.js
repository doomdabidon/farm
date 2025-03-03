const defaultTokenRateLimit = {
    windowMs: 15 * 60 * 1000,
    max: 3,
};

const tokenRateLimit = {
    ...defaultTokenRateLimit,
    keyGenerator: (req, res) => {
        return req.user.username;
    }
};

module.exports = tokenRateLimit