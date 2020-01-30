const log4js = require('../loggerConfig/loggerConfigurator');
const BasePage = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    signInBtn: `//button[@type="submit"]`,
    errorBox: `//span[@id="notification-message"]`,
    createAccountBtn: `//a[@id="sign-up-link"]`,
    authBox: (type) => `//input[@id="${type}"]`,
};
const authTypes = {
    login: `username`,
    password: `password`,
};

class LoginPage extends BasePage {
    selectors = selectors

    logIn(username, password) {
        logger.debug(`logIn: logging in with username ${username} and password ${password}.`);
        super.enterText(selectors.authBox(authTypes.login), username);
        super.enterText(selectors.authBox(authTypes.password), password);
        super.clickOnElement(this.selectors.signInBtn);
    }
};

module.exports = new LoginPage();