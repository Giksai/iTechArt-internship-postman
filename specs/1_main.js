const {errors} = require('./specData');
const dataProvider = require('../dataProvider');
const mainPage = require('../pages/mainPage');
const profilePage = require('../pages/profilePage');
const loginPage = require('../pages/loginPage');
const log4js = require('../loggerConfig/loggerConfigurator');
const messagesAPI = require('../google/messagesAPI');
const spreadsheetsAPI = require('../google/spreadsheetsAPI');

const logger = log4js.getLogger('default');

describe(`Postman authentication check.`,() => {
    
    it(` (1).`,
       () => {
            for(let account of dataProvider.getAllAccounts()) {
                logger.trace(
                    `Trying to log in with username: ${account.login}, password: ${account.password}`);
                mainPage.open();
                mainPage.clickOnElement(mainPage.selectors.login);
                loginPage.enterText(loginPage.authTypes.login, account.login);
                loginPage.enterText(loginPage.authTypes.password, account.password);
                loginPage.clickOnElement(loginPage.selectors.signInBtn);
                loginPage.waitForElement(loginPage.selectors.errorBox, 500);
                profilePage.waitForElement(profilePage.selectors.profileIcon, 500);
                let allErrors = loginPage.getAllErrors();

                if(profilePage.isAtProfilePage()) {
                    logger.trace(`Logged in successfully.`);
                }
                else {
                    if(allErrors.includes(errors.auth_wrongData)) {
                        logger.trace('User does not exist.');
                    }
                    else if(allErrors.includes(errors.auth_timeout)) {
                        logger.trace(`Exceeded maximum tries.`);
                    }
                    else {
                        logger.trace(`Unknown error.`);
                    }
                }
                
            }
    });
  });