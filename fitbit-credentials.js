const ClientOAuth2 = require('client-oauth2');
const request = require('request');

module.exports = function (RED) {
    function saveNewToken(credentialsID, credentials, tokenData) {
        credentials.username = tokenData.user_id;
        credentials.tokenData = tokenData;
        RED.nodes.addCredentials(credentialsID, credentials);
    }

    function getFitbitOauth(credentials) {
        return new ClientOAuth2({
            clientId: credentials.clientID,
            clientSecret: credentials.clientSecret,
            accessTokenUri: 'https://api.fitbit.com/oauth2/token',
            authorizationUri: 'https://www.fitbit.com/oauth2/authorize',
            scopes: ['activity', 'heartrate', 'location', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight']
        });
    }

    function _makeRequest(method, url, token) {
        return new Promise((resolve, reject) => {
            request(token.sign({
                method: method,
                url: url
            }), (_err, _response, body) => {
                resolve(body);
            });
        });
    }

    function makeRequest(method, url, credentials) {
        const oauth = getFitbitOauth(credentials.clientID, credentials.clientSecret);
        const token = oauth.createToken(credentials.tokenData);

        if (token.expired) {
            return token.refresh().then(newToken => {
                saveNewToken(credentials, newToken);
                return newToken;
            }).then(newToken => {
                return _makeRequest(method, url, newToken);
            })
        } else {
            return _makeRequest(method, url, token);
        }
    }

    function FitbitNode(n) {
        RED.nodes.createNode(this, n);
        this.username = n.username;
    }

    RED.nodes.registerType("fitbit-credentials", FitbitNode, {
        credentials: {
            username: { type: "text" },
            clientID: { type: "password" },
            clientSecret: { type: "password" },
            tokenData: { type: "password" }
        }
    });

    RED.httpAdmin.get('/fitbit-credentials/:id/auth', function (req, res) {
        if (!req.query.client_id || !req.query.client_secret) {
            res.status(422).send(RED._("fitbit.auth-flow.creds-missing"));
            return;
        }

        const credentials = {
            clientID: req.query.client_id,
            clientSecret: req.query.client_secret
        };
        RED.nodes.addCredentials(req.params.id, credentials);

        const authUri = getFitbitOauth(credentials).code.getUri({
            state: req.params.id,
            redirectUri: req.protocol + '://' + req.get('host') + '/fitbit-credentials/auth/callback',
        });

        res.redirect(authUri);
    });

    RED.httpAdmin.get('/fitbit-credentials/auth/callback', function (req, res) {
        const credentialsID = req.query.state;
        const credentials = RED.nodes.getCredentials(credentialsID);

        if (!credentials || !credentials.clientID || !credentials.clientSecret) {
            res.status(422).send(RED._("fitbit.auth-flow.creds-missing"));
            return;
        }

        getFitbitOauth(credentials).code.getToken(req.originalUrl, {
            state: req.params.id,
            redirectUri: req.protocol + '://' + req.get('host') + '/fitbit-credentials/auth/callback',
        }).then((token) => {
            saveNewToken(credentialsID, credentials, token.data);
            res.send(RED._("fitbit.auth-flow.authorized"));
        });
    });
}