const { OAuth2Server } = require("oauth2-server");
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.json());

const model = {
    getClient: (clientId, clientSecret) => {
        return clients.find(client => client.id === clientId && client.secret === clientSecret);
    },

    getUser: (username, password) => {
        return users.find(user => user.username === username && user.password === password);
    },

    saveToken: (token, client, user) => {
        const accessToken = { ...token, client, user };
        tokens.push(accessToken);
        return accessToken;
    },

    getAccessToken: (accessToken) => {
        return tokens.find(token => token.accessToken === accessToken);
    },

    verifyScope: (token, scope) => {
        return true; // Allow all scopes for now
    }
};

const oauth = new OAuth2Server({
    model, // OAuth2 model (to be implemented)
    accessTokenLifetime: 3600,
    allowBearerTokensInQueryString: true
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    return oauth.authenticate(request, response)
        .then(token => {
            req.user = token.user;
            next();
        })
        .catch(err => res.status(401).json({ error: "Unauthorized", details: err }));
};

// Route to get an access token
app.post("/oauth/token", (req, res) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    return oauth.token(request, response)
        .then(token => res.json(token))
        .catch(err => res.status(400).json(err));
});

// Protected resource example
app.get("/protected", authenticate, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});

app.listen(3000, () => console.log("OAuth2 Server running on port 3000"));
