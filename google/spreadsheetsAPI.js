const fs = require('fs'),
    {google} = require('googleapis'),
    readline = require('readline'),
    log4js = require('./loggerConfig/loggerConfigurator'),
    base64url = require('base64url');

const logger = log4js.getLogger('default');
const tokenPath = 'token.json'

class SpreadsheetsAPI {

    authenticate() {
    const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const authentication = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    const token = fs.readFileSync(tokenPath, 'utf8');
      
    if(!token) throw new Error("Token file has not been found");
    authentication.setCredentials(JSON.parse(token));
  
    return authentication;
}

    listMajors(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log('Name, Major:');
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
          console.log(`${row[0]}, ${row[4]}`);
        });
      } else {
        console.log('No data found.');
      }
    });
  }

};

module.exports = new SpreadsheetsAPI();