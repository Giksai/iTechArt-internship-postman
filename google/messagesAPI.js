const { google } = require('googleapis');
const log4js = require('../loggerConfig/loggerConfigurator');
const base64url = require('base64url');
const BaseApi = require('./baseAPI');
const spreadsheetsAPI = require('./spreadsheetsAPI');

const logger = log4js.getLogger('default');

class MessagesAPI extends BaseApi {

    /**
     * Returns an array of ids of user's messages
     */
    async getAllMessages() {
        logger.debug("getAllMessages: Preparing to get all messages");

        const auth = this.authenticate();
        const gmail = google.gmail({ version: 'v1', auth });

        const res = await gmail.users.messages.list({
            userId: "me"
        });

        if (!res) throw new Error("getAllMessages: The API has returned an error");
        logger.debug(`getAllMessages: Done getting all messages: ${res.data.messages}`);

        return res.data.messages;
    }

    async getMessagesAmount() {
        const amount = (await this.getAllMessages()).length;
        logger.debug(`getMessagesAmount: Got amount of all messages (${amount})`);

        return amount;
    }

    /**
     * Searches for the message with the given id in user's inbox folder
     * and returns full result
     * @param {Number} messageId Id of the message to search for
     */
    async getMessage(messageId) {
        logger.debug(`getMessage: Preparing to get message ${messageId}`);
        const auth = this.authenticate();
        const gmail = google.gmail({ version: 'v1', auth });

        const res = await gmail.users.messages.get({
            userId: "me",
            id: messageId
        });

        if (!res) throw new Error("getMessage: The API has returned an error");
        logger.debug(`getMessage: Done getting message: ${res}`);

        return res;
    }

    /**
     * Gets body of the message with given id and returns it
     * @param {Number} messageId id of a message to get body from
     */
    async getMessageBody(messageId) {
        logger.debug(`getMessageBody: Preparing to get body of message ${messageId}`);

        const res = await this.getMessage(messageId);
        let body;

        body = base64url.decode(res.data.payload.body.data);
        logger.debug(`getMessageBody: Done getting message body`);

        return body;
    }

    /**
     * Gets subject of the message with given id and returns it
     * @param {Number} messageId id of a message to get subject from
     */
    async getMessageSubject(messageId) {
        logger.debug(`getMessageSubject: Preparing to get subject of message ${messageId}`);

        const res = await this.getMessage(messageId);
        let foundSubject = this.getSubjectFromHeaders(res.data.payload.headers);
        logger.debug(`getMessageSubject: Done getting message's subject (${foundSubject})`);

        return foundSubject;
    }

    /**
     * Goes through all message's headers and finds subject info
     * @param {Array} headers array of headers
     */
    getSubjectFromHeaders(headers) {
        for (let obj of headers) {
            if (obj.name === "Subject")
                return obj.value;
        }
    }

    async waitForMessage(account, awaitToken, predicate) {
        logger.trace(`Waiting for the message with email: ${account.email}`);
        while (awaitToken.completed !== true) {
            for (let messageId of await this.getAllMessages()) {
                if (await predicate(messageId, account) === true) {
                    logger.trace(`Got correct message, appending account.`);
                    let link = this.getConfirmLink(await this.getMessageBody(messageId.id));
                    await spreadsheetsAPI.appendAccount(account, link);
                    awaitToken.completed = true;
                    break;
                }
                browser.pause(3000);
            }
            browser.pause(10000);
        }
    }

    getConfirmLink(messageBody) {
        let link = messageBody.match(/go.postman.co\/validate-email\?token=[0-9a-zA-Z]+/)[0];
        logger.trace(`Got confirmation link: ${link}.`);
        return link;
    }

    getRegisteredEmail(mail) {
        for (let header of mail.data.payload.headers) {
            if (header.name == 'Delivered-To') {
                logger.debug(`Got email: ${header.value}.`);
                return header.value;
            }
        }
    }
};

module.exports = new MessagesAPI();