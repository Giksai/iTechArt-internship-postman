const log4js = require('../loggerConfig/loggerConfigurator'),
    BasePage = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    enterNameBox: `//input[@placeholder="Enter your name"]`,
    submit: `//button[@class="pm-btn pm-btn-primary pm-btn-md pm-btn-content user-prefs-continue-btn"]`,
    maybeLaterBtn: `//button[text()="Maybe Later"]`,
};

class WelcomePage extends BasePage {

    enterName(name) {
        super.enterText(selectors.enterNameBox, name);
    }

    maybeLater() {
        super.clickOnElement(selectors.maybeLaterBtn);
    }

    submit() {
        super.clickOnElement(selectors.submit);
    }
};

module.exports = new WelcomePage();