const log4js = require('../loggerConfig/loggerConfigurator'),
    BasePage = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    profileIcon: `//div/div/button[@class="user-dropdown__button"]`,
    signOutBtn: `//button[text()="Sign Out"]`,
    confirmSignOutBtn: `//button[@id="sign-out-btn"]`,
};

class ProfilePage extends BasePage {
    selectors = selectors

    isAtProfilePage() {
        let result = $(selectors.profileIcon).isExisting();
        logger.debug(`isAtProfilePage: ${result}.`);
        return result;
    }

    logOut() {
        logger.debug(`logOut: logging out.`);
        super.clickOnElement(selectors.profileIcon);
        super.clickOnElement(selectors.signOutBtn);
        super.clickOnElement(selectors.confirmSignOutBtn);
    }
};

module.exports = new ProfilePage();