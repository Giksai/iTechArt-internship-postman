const {errors, registerDetails, messageData} = require('./specData');
const dataProvider = require('../dataProvider');
const mainPage = require('../pages/mainPage');
const profilePage = require('../pages/profilePage');
const loginPage = require('../pages/loginPage');
const log4js = require('../loggerConfig/loggerConfigurator');
const messagesAPI = require('../google/messagesAPI');
const spreadsheetsAPI = require('../google/spreadsheetsAPI');
const registerPage = require('../pages/registerPage');

const logger = log4js.getLogger('default');

describe(`Postman authentication check.`,() => {
    afterAll(() => {
        browser.pause(1000);
    });
    beforeAll(() => {
        //browser.maximizeWindow();
    });
    it(` (1).`,
       () => {
           //browser.pause(10000);
           mainPage.open();
           mainPage.clickOnElement(mainPage.selectors.login);
            for(let account of dataProvider.getAllAccounts()) {
                logger.trace(
                    `Trying to log in with username: ${account.login}, password: ${account.password}.`);
                loginPage.enterText(loginPage.authTypes.login, account.login);
                loginPage.enterText(loginPage.authTypes.password, account.password);
                loginPage.clickOnElement(loginPage.selectors.signInBtn);

                if(profilePage.waitForElementToDisappear(loginPage.selectors.errorBox, 2000, 100)) {
                    checkAccount(account);
                }
                else {
                    checkErrors(account);
                }
            }
    });
  });

function checkErrors(account) {
    let allErrors = loginPage.getAllErrors();
    if(allErrors.includes(errors.auth_wrongData)) {
        logger.trace('User does not exist.');
        userDoesNotExist(account);
    }
    else if(allErrors.includes(errors.auth_timeout)) {
        logger.trace(`Exceeded maximum tries.`);
    }
  }

  async function userDoesNotExist(account) {
      loginPage.clickOnElement(loginPage.selectors.createAccountBtn);
     browser.pause(1000);
    registerPage.enterTextInBox(registerPage.boxTypes.email, registerDetails.email);
    registerPage.enterTextInBox(registerPage.boxTypes.login, account.login);
    registerPage.enterTextInBox(registerPage.boxTypes.password, account.password);
    registerPage.agreeToTermsOfUse();
    registerPage.submit();
    let allErrors = registerPage.getAllErrors('');
    if(allErrors.includes(errors.register_userAlreadyExists)
        || allErrors.includes(errors.register_emailAlreadyTaken)) {
        logger.error(`User already exists or email is already taken!`);
        return;
    }
    else {
        waitForMessage(account, await messagesAPI.getMessagesAmount());
    }
  }

    async function waitForMessage(account, prevMsgAmount) {
        logger.trace(`Waiting for message.`);
        while(prevMsgAmount === await messagesAPI.getMessagesAmount()) {
            await browser.pause(20000);
        }
        logger.trace(`Got message.`);
        for(let messageId of await messagesAPI.getAllMessages()) {
            let title = await messagesAPI.getMessageSubject(messageId.id)
            if(title === messageData.title) {
                logger.trace(`Message title: ${title}.`);
                let link = getConfirmLink(await messagesAPI.getMessageBody(messageId.id));
                await spreadsheetsAPI.appendAccount(account, link);
                browser.back();
                browser.back();
            }
        }
    }

  function checkAccount(account) {
      profilePage.waitForElement(profilePage.selectors.profileIcon, 4000, 500);
    if(profilePage.isAtProfilePage()) {
        logger.trace(`Logged in successfully, appending to the spreadsheet.`);
        spreadsheetsAPI.appendAccount(account);
        //Log out
        profilePage.logOut();
     }
  }

  /**
   * 
   * @param {String} messageBody 
   */
  function getConfirmLink(messageBody) {
        let link = messageBody.match(/go.postman.co\/validate-email\?token=[0-9a-zA-Z]+/)[0];
        logger.trace(`Got confirmation link: ${link}.`);
        return link;
  }