const log4js = require('../loggerConfig/loggerConfigurator'),
    {BasePage} = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    profileIcon: `//div[@class="pm-user-icon pm-user-icon-color-0 pm-user-icon-sm pm-icon-circle"]`,
};

class ProfilePage extends BasePage {
    selectors = selectors

    isAtProfilePage() {
        return $(selectors.profileIcon).isExisting();
    }
};

module.exports = new ProfilePage();