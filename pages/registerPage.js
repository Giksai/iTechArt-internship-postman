const log4js = require('../loggerConfig/loggerConfigurator'),
    BasePage = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {
    box: (type) => `//form[@id="sign-up-form"]/div/input[@id="${type}"]`,
    submit: `//button[@id="sign-up-btn"]`,
    termsOfUseCheckbox: `//div[@class="pm-form-group"]/label[@for="tnc-checkbox"]`,
};

class RegisterPage extends BasePage {
    boxTypes = {
        email: 'email',
        login: 'username',
        password: 'password',
    }
    selectors = selectors

    enterTextInBox(type, text) {
        super.enterText(selectors.box(type), text);
    }
    
    agreeToTermsOfUse() {
        super.clickOnElement(selectors.termsOfUseCheckbox);
    }
    
    submit() {
        super.clickOnElement(selectors.submit);
    }

};

module.exports = new RegisterPage();