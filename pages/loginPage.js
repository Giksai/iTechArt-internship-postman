const log4js = require('../loggerConfig/loggerConfigurator');
const BasePage = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    signInBtn: `//button[@type="submit"]`,
    errorBox: `//span[@id="notification-message"]`,
    createAccountBtn: `//a[@id="sign-up-link"]`,
};

class LoginPage extends BasePage {
    selectors = selectors

    authTypes = {
        login: `//input[@id="username"]`,
        password: `//input[@id="password"]`,
    }

};

module.exports = new LoginPage();