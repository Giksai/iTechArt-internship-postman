const log4js = require('../loggerConfig/loggerConfigurator');
const BasePage = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    login: `//a[@class="v5_btn v5_btn__primary header-sign-in-btn v5_btn__small hide-if-signedin pingdom-transactional-check__sign-in-button mb-0 mr-1 button--sign-in"]`,
};
const adress = 'getpostman.com';

class MainPage extends BasePage {
    selectors = selectors

    open() {
        logger.debug(`open: opening ${adress}.`);
        super.open(adress);
    }
};

module.exports = new MainPage();