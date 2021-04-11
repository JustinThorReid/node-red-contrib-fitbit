const ClientOAuth2 = require('client-oauth2');
const request = require('request');
const fs = require('fs');
const FILE_PATH = 'fitbit-oauth-tokens.json';

let refreshPromise;
let tokens = {};
function loadTokens() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, '{}');
    }

    const data = fs.readFileSync(FILE_PATH, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
    });

    tokens = JSON.parse(data) || {};
}
loadTokens();

module.exports = function (RED) {
    function saveNewToken(credentialsID, tokenData) {
        tokens[credentialsID] = {
            access_token: tokenData.data.access_token,
            expires: tokenData.expires,
            refresh_token: tokenData.data.refresh_token
        }

        fs.writeFile(FILE_PATH, JSON.stringify(tokens), function (err) {
            if (err) console.error(err);
        });
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
            }), (err, response, _body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }

    function makeRequest(method, url, credentials, credentialsID) {
        if (!tokens[credentialsID]) return Promise.resolve();

        const oauth = getFitbitOauth(credentials);
        const token = oauth.createToken({
            access_token: tokens[credentialsID].access_token,
            expires_in: (new Date(tokens[credentialsID].expires).getTime() - new Date().getTime()) / 1000,
            token_type: 'Bearer',
            refresh_token: tokens[credentialsID].refresh_token,
            user_id: credentials.user_id,
            clientID: credentials.clientID,
            clientSecret: credentials.clientSecret
        });

        let requestPromise;
        if (token.expired()) {
            // Only refresh once
            if (!refreshPromise) {
                refreshPromise = token.refresh().then(newToken => {
                    saveNewToken(credentialsID, newToken);
                    refreshPromise = undefined;
                    return newToken;
                })
            }

            requestPromise = refreshPromise.then(newToken => {
                return _makeRequest(method, url, newToken);
            })
        } else {
            requestPromise = _makeRequest(method, url, token);
        }

        return requestPromise.catch(err => {
            console.error("Error requesting from fitbit", err);
        });
    }

    return {
        saveNewToken,
        makeRequest,
        getFitbitOauth
    }
}
