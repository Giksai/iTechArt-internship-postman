const { errors, registerDetails, messageData } = require('./specData');
const dataProvider = require('../dataProvider');
const mainPage = require('../pages/mainPage');
const profilePage = require('../pages/profilePage');
const loginPage = require('../pages/loginPage');
const log4js = require('../loggerConfig/loggerConfigurator');
const messagesAPI = require('../google/messagesAPI');
const spreadsheetsAPI = require('../google/spreadsheetsAPI');
const registerPage = require('../pages/registerPage');
const welcomePage = require('../pages/welcomePage');
//const dataProvider = require('jasmine-data-provider');

const logger = log4js.getLogger('default');

//Used to wait for an async function to end
let cycleFlag = false;

describe(`Postman authentication check.`, () => {
    afterAll(() => {
        browser.pause(1000);
    });
    beforeAll(() => {
        //browser.maximizeWindow();
    });
    it(` i don't know what to write here, there is no checks (1).`,
        () => {
            //browser.pause(10000);
            mainPage.open();
            mainPage.clickOnElement(mainPage.selectors.login);
            for (let account of dataProvider.getAllAccounts()) {
                checkAccount(account);
                //Waits for an async function to end
                while (!cycleFlag) {
                    browser.pause(500);
                }
                cycleFlag = false;
            }
        });
});

//Main account checking function
function checkAccount(account) {
    logger.trace(
        `Trying to log in with username: ${account.login}, password: ${account.password}.`);
    loginPage.logIn(account.login, account.password);
    //Checks if account can log in by catching the page deloading
    if (profilePage.waitForElementToDisappear(loginPage.selectors.errorBox, 2000, 100)) {
        //Waits for a profile page to load
        profilePage.waitForElement(profilePage.selectors.profileIcon, 8000, 500);
        if (profilePage.isAtProfilePage()) {
            logger.trace(`Logged in successfully, appending to the spreadsheet.`);
            spreadsheetsAPI.appendAccount(account);
            profilePage.logOut();
            cycleFlag = true;
        }
    }
    else {
        let allErrors = loginPage.getAllErrors();
        if (allErrors.includes(errors.auth_wrongData)) {
            logger.trace('User does not exist.');
            loginPage.clickOnElement(loginPage.selectors.createAccountBtn);
            browser.pause(1000);
            registerPage.enterTextInBox(registerPage.boxTypes.email, registerDetails.email);
            registerPage.enterTextInBox(registerPage.boxTypes.login, account.login);
            registerPage.enterTextInBox(registerPage.boxTypes.password, account.password);
            registerPage.agreeToTermsOfUse();
            registerPage.submit();

            let allErrors = registerPage.getAllErrors('');
            if (allErrors.includes(errors.register_userAlreadyExists)
                || allErrors.includes(errors.register_emailAlreadyTaken)) {
                throw new Error(`User already exists or email is already taken!`);
            }
            else {
                logger.trace(`Registered successfully.`);
                waitForMessage(account); //asynchronously waits and checks new letters
                welcomePage.enterName(account.login);
                welcomePage.submit();
                welcomePage.maybeLater();
                profilePage.logOut();
            }
        }
        else if (allErrors.includes(errors.auth_timeout)) {
            logger.trace(`Exceeded maximum tries.`);
            browser.pause(40000);
            checkAccount(account);
            return;
        }
    }
}

async function waitForMessage(account) {
    let prevMsgAmount = await messagesAPI.getMessagesAmount()
    logger.trace(`Waiting for a new message.`);
    while (prevMsgAmount === await messagesAPI.getMessagesAmount()) {
        browser.pause(5000);
    }
    logger.trace(`Got message.`);
    for (let messageId of await messagesAPI.getAllMessages()) {
        let title = await messagesAPI.getMessageSubject(messageId.id)
        if (title === messageData.title) {
            logger.trace(`Got correct message, appending account.`);
            let link = getConfirmLink(await messagesAPI.getMessageBody(messageId.id));
            await spreadsheetsAPI.appendAccount(account, link);
            cycleFlag = true;
            break;
        }
    }
}

function getConfirmLink(messageBody) {
    let link = messageBody.match(/go.postman.co\/validate-email\?token=[0-9a-zA-Z]+/)[0];
    logger.trace(`Got confirmation link: ${link}.`);
    return link;
}