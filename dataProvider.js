const fs = require('fs');
const log4js = require('./loggerConfig/loggerConfigurator');
const logger = log4js.getLogger('default');

const filePath = 'usersList.txt';
let accounts = [];

class DataProvider {
    constructor() {
        logger.debug(`Trying to get all accounts from file ${filePath}.`);
        let plainText = fs.readFileSync(filePath, 'utf8');
        for (let account of plainText.split(';')) {
            account = account.replace('\n', '').replace('\r', '');
            accounts.push({
                login: account.split('/')[0],
                password: account.split('/')[1],
            });
        }

        logger.debug(`All account/password pairs: `);
        for (let account of accounts) {
            logger.debug(`|${account.login}|${account.password}|`);
        }
    }

    getAllAccounts() {
        return accounts;
    }

    getNextLoginDetails(prevDetails = null) {
        logger.debug(`getNextLoginDetails: getting account ${prevDetails ? `with previous details: ${prevDetails}` : `for the first time`}.`);
        if (!prevDetails) {
            return accounts[0];
        }
        else {
            accounts[accounts.indexOf(prevDetails) + 1];
        }
    }
};

module.exports = new DataProvider();