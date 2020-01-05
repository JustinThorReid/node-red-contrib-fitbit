const request = require('request');

module.exports = function (RED) {
    const oauth = require('./oauth-helper')(RED);

    function FitbitCredentials(config) {
        RED.nodes.createNode(this, config);
    }

    RED.nodes.registerType("fitbit-credentials", FitbitCredentials, {
        credentials: {
            access_token: { type: "password" },
            expires: { type: "password" },
            refresh_token: { type: "password" },
            user_id: { type: "text" },
            clientID: { type: "password" },
            clientSecret: { type: "password" }
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

        const authUri = oauth.getFitbitOauth(credentials).code.getUri({
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

        oauth.getFitbitOauth(credentials).code.getToken(req.originalUrl, {
            state: req.params.id,
            redirectUri: req.protocol + '://' + req.get('host') + '/fitbit-credentials/auth/callback',
        }).then((token) => {
            oauth.saveNewToken(credentialsID, credentials, token);
            res.send(RED._("fitbit.auth-flow.authorized"));
        });
    });
}