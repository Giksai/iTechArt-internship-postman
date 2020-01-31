const fs = require('fs');
const { google } = require('googleapis');

class BaseAPI {
    tokenPath = './google/token.json'

    authenticate() {
        const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const authentication = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        const token = fs.readFileSync(this.tokenPath, 'utf8');

        if (!token) throw new Error("Token file has not been found");
        authentication.setCredentials(JSON.parse(token));

        return authentication;
    }
};

module.exports = BaseAPI;