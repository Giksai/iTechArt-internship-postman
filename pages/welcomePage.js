const BasePage = require('./basePage');

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