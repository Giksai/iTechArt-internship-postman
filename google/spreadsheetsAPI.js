const { google } = require('googleapis');
const log4js = require('../loggerConfig/loggerConfigurator');
const BaseApi = require('./baseAPI');

const logger = log4js.getLogger('default');
const spreadsheetId = '1n0VKittiGKJg1wpggBoI_L1zetqp8asfXmWmK530oDY';

class SpreadsheetsAPI extends BaseApi {

    async appendAccount(account, confirmLink) {
        logger.debug(
            `Trying to insert account with 
            email: ${account.email}
            password: ${account.password}
            ${confirmLink ? `${confirmLink} confirm link` : `without confirmation link`}.`);

        let values = [
            account.email,
            account.password,
            confirmLink ? confirmLink : 'Пользователь уже зарегистрирован'
        ];
        await this.writeData('A2', 'C2', values, spreadsheetId);
    }

    async writeData(rangeFrom, rangeTo, values, spreadsheetId) {
        logger.debug(
            `writeData: writing data: ${values} starting from ${rangeFrom} to ${rangeTo}
            to the spreadsheet ${spreadsheetId}.`);

        const auth = this.authenticate();
        const sheets = google.sheets({ version: 'v4', auth });
        return await sheets.spreadsheets.values.append({
            "spreadsheetId": spreadsheetId,
            "range": `${rangeFrom}:${rangeTo}`,
            "includeValuesInResponse": true,
            "valueInputOption": "RAW",
            "resource": {
                "majorDimension": "ROWS",
                "range": `${rangeFrom}:${rangeTo}`,
                "values": [
                    values
                ]
            }
        });
    }
};

module.exports = new SpreadsheetsAPI();