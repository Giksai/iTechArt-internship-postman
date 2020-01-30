const { google } = require('googleapis');
const log4js = require('../loggerConfig/loggerConfigurator');
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
        const sheets = google.sheets({ version: 'v4', auth });
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
};

module.exports = new SpreadsheetsAPI();