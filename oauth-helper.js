const ClientOAuth2 = require('client-oauth2');

module.exports = function (RED) {
    function saveNewToken(credentialsID, credentials, tokenData) {
        console.log("Save creds", credentialsID, credentials);

        credentials.access_token = tokenData.access_token;
        credentials.expires_in = tokenData.expires_in;
        credentials.refresh_token = tokenData.refresh_token;
        credentials.user_id = tokenData.user_id;
        RED.nodes.addCredentials(credentialsID, credentials);
        console.log("Save creds done", credentials);
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
        const token = oauth.createToken(credentials);

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

    return {
        saveNewToken,
        makeRequest,
        getFitbitOauth
    }
}