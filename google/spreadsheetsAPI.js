const fs = require('fs');
const {google} = require('googleapis');
const readline = require('readline');
const log4js = require('../loggerConfig/loggerConfigurator');
const base64url = require('base64url');
const BaseApi = require('./baseAPI');

const logger = log4js.getLogger('default');

class SpreadsheetsAPI extends BaseApi {

    async appendAccount(account, confirmLink) {
        logger.debug(
            `Trying to insert account with 
            login: ${account.login}
            password: ${account.password}
            ${confirmLink ? `${confirmLink} confirm link` : `without confirmation link`}.`);

        const auth = this.authenticate();
        const sheets = google.sheets({version: 'v4', auth});
        return await sheets.spreadsheets.values.append({
            "spreadsheetId": "1n0VKittiGKJg1wpggBoI_L1zetqp8asfXmWmK530oDY",
            "range": "A2:C2",
            "includeValuesInResponse": true,
            "valueInputOption": "RAW",
            "resource": {
              "majorDimension": "ROWS",
              "range": "A2:C2",
              "values": [
                [
                  account.login,
                  account.password,
                  confirmLink ? confirmLink : 'Пользователь уже зарегистрирован' 
                ]
              ]
            }
          });
    }

//     listMajors(auth) {
//     const sheets = google.sheets({version: 'v4', auth});
//     sheets.spreadsheets.values.get({
//       spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//       range: 'Class Data!A2:E',
//     }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const rows = res.data.values;
//       if (rows.length) {
//         console.log('Name, Major:');
//         // Print columns A and E, which correspond to indices 0 and 4.
//         rows.map((row) => {
//           console.log(`${row[0]}, ${row[4]}`);
//         });
//       } else {
//         console.log('No data found.');
//       }
//     });
//   }
};

module.exports = new SpreadsheetsAPI();