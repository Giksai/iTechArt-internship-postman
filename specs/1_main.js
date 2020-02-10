const { errors } = require('./specData');
const mainPage = require('../pages/mainPage');
const profilePage = require('../pages/profilePage');
const loginPage = require('../pages/loginPage');
const log4js = require('../loggerConfig/loggerConfigurator');
const messagesAPI = require('../google/messagesAPI');
const spreadsheetsAPI = require('../google/spreadsheetsAPI');
const registerPage = require('../pages/registerPage');
const welcomePage = require('../pages/welcomePage');
const strGenerator = require('../utils/stringGenerator');
const dataReader = require('../utils/dataReader');
const using = require('jasmine-data-provider');

const logger = log4js.getLogger('default');
const messageData = {
    title: `Please validate your account`
};

describe(`Postman authentication check.`, () => {
    beforeAll(() => {
        mainPage.open();
        mainPage.clickOnElement(mainPage.selectors.login);
    });
    afterAll(() => {
        logger.trace(`Sheet link: https://docs.google.com/spreadsheets/d/1n0VKittiGKJg1wpggBoI_L1zetqp8asfXmWmK530oDY/edit?usp=sharing`);
    });

    using(dataReader.getAllAccounts(), function (account) {
        it(` checking account: email: ${account.email}, password: ${account.password} (1).`,
            () => {
                checkAccount(account);
            });
    });
});

//Main account checking function
function checkAccount(account) {
    logger.trace(
        `Trying to log in with email: ${account.email}, password: ${account.password}.`);
    loginPage.logIn(account.email, account.password);
    //Checks if account can log in by catching the page deloading
    if (profilePage.waitForElementToDisappear(loginPage.selectors.errorBox, 2000, 100)) {
        loggedIn(account);
    }
    else {
        errorOccured(account);
    }
}

function loggedIn(account) {
    //Waits for a profile page to load
    profilePage.waitForElement(profilePage.selectors.profileIcon, 8000, 500);
    if (profilePage.isAtProfilePage()) {
        logger.trace(`Logged in successfully, appending to the spreadsheet.`);
        spreadsheetsAPI.appendAccount(account);
        profilePage.logOut();
    }
}

function errorOccured(account) {
    let allErrors = loginPage.getAllErrors();
    if (allErrors.includes(errors.auth_wrongData)) {
        userDoesNotExists(account);
    }
    else if (allErrors.includes(errors.auth_timeout)) {
        timeout(account);
    }
}

function userDoesNotExists(account) {
    logger.trace('User does not exist.');
    loginPage.clickOnElement(loginPage.selectors.createAccountBtn);
    browser.pause(1000);
    registerPage.enterTextInBox(registerPage.boxTypes.email, account.email);
    registerPage.enterTextInBox(registerPage.boxTypes.login, strGenerator.getRandomString());
    registerPage.enterTextInBox(registerPage.boxTypes.password, account.password);
    registerPage.agreeToTermsOfUse();
    let prevErrors = registerPage.getAllErrors();
    registerPage.submit();

    let allErrors = registerPage.getAllErrors(prevErrors, 1000);
    if (allErrors.includes(errors.register_userAlreadyExists)
        || allErrors.includes(errors.register_emailAlreadyTaken)) {
        logger.debug(`Username or password already exists. Countinue to the next account.`);
        return;
    }
    else {
        registered(account);
    }
}

function timeout(account) {
    logger.trace(`Exceeded maximum tries.`);
    browser.pause(40000);
    checkAccount(account);
    return;
}

function registered(account) {
    logger.trace(`Registered successfully.`);
    //Used to wait for an async function to end
    let awaitToken = { completed: false };
    messagesAPI.waitForMessage(account, awaitToken, correctEmailCheck); //asynchronously waits and checks new letters
    welcomePage.enterName(account.email);
    welcomePage.submit();
    welcomePage.maybeLater();
    profilePage.logOut();
    while (awaitToken.completed !== true) {
        browser.pause(500);
    }
}

async function correctEmailCheck(messageId, account) {
    if (await messagesAPI.getMessageSubject(messageId.id) === messageData.title) {
        if (messagesAPI.getRegisteredEmail((await messagesAPI.getMessage(messageId.id)))
            === account.email.toLowerCase()) {
            return true;
        }
    }
    return false;
}