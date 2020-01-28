const fs = require('fs'),
    {google} = require('googleapis'),
    readline = require('readline'),
    log4js = require('./loggerConfig/loggerConfigurator'),
    base64url = require('base64url');

const logger = log4js.getLogger('default');
const tokenPath = 'token.json'

class MessagesAPI {

    authenticate() {
    const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf8'));
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const authentication = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    const token = fs.readFileSync(tokenPath, 'utf8');
      
    if(!token) throw new Error("Token file has not been found");
    authentication.setCredentials(JSON.parse(token));
  
    return authentication;
}

/**
 * Returns an array of ids of user's messages
 */
    getAllMessages() {
    logger.debug("getAllMessages: Preparing to get all messages");

    const auth = authenticate();
    const gmail = google.gmail({version: 'v1', auth});
    logger.debug("getAllMessages: Got gmail object");

    const res = await gmail.users.messages.list({
      userId: "me"
    });
    logger.debug("getAllMessages: Performed list request");

    if(!res) throw new Error("getAllMessages: The API has returned an error");
    logger.debug("getAllMessages: Done getting all messages");

    return res.data.messages;
}

    getMessagesAmount() {
    const amount = (await getAllMessages()).length;
    logger.debug(`getMessagesAmount: Got amount of all messages (${amount})`);

    return amount;
}

/**
 * Searches for the message with the given id in user's inbox folder
 * and returns full result
 * @param {Number} messageId Id of the message to search for
 */
    getMessage(messageId) {
    logger.debug(`getMessage: Preparing to get message ${messageId}`);
    const auth = authenticate();
    const gmail = google.gmail({version: 'v1', auth});
    logger.debug("getMessage: Got gmail object");

    const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId
    });
    logger.debug("getMessage: Performed get request");

    if(!res) throw new Error("getMessage: The API has returned an error");
    logger.debug("getMessage: Done getting message");

    return res;
}

/**
 * Gets body of the message with given id and returns it
 * @param {Number} messageId id of a message to get body from
 */
    getMessageBody(messageId) {
    logger.debug(`getMessageBody: Preparing to get body of message ${messageId}`);

    const res = await getMessage(messageId);
    let body;
    if(res.data.payload.body.size === 0)
        body = base64url.decode(res.data.payload.parts[0].body.data);
    else
        body = res.data.snippet;
    logger.debug(`getMessageBody: Done getting message body`);

    return body;
}

/**
 * Gets subject of the message with given id and returns it
 * @param {Number} messageId id of a message to get subject from
 */
    getMessageSubject(messageId) {
    logger.debug(`getMessageSubject: Preparing to get subject of message ${messageId}`);

    const res = await getMessage(messageId);
    logger.debug("getMessageSubject: Got message snippet");

    let foundSubject = getSubjectFromHeaders(res.data.payload.headers);
    logger.debug(`getMessageSubject: Done getting message's subject (${foundSubject})`);

    return foundSubject
}

/**
 * Gets deadline from the message with given id and returns it
 * @param {Number} messageId id of a message to get subject from
 */
    getMessageDeadline(messageId) {
    logger.debug(`getMessageDeadline: Preparing to get deadline of message ${messageId}`);

    //Getting message body without logging function's result
    const body = await getMessageBody(messageId);
    logger.debug("getMessageDeadline: Received message body");

    if(!body.includes(tokenPath.deadlineName)) {
        logger.error("Given message does not contain deadline info!");
        return "";
    }
    let deadline = body.substring(body.indexOf(tokenPath.deadlineName));
    deadline = deadline.substring(0, deadline.indexOf(tokenPath.deadlineEndName))
    .replace(tokenPath.deadlineName, "");
    logger.debug(`getMessageDeadline: Done getting deadline (${deadline})`)

    return deadline;
}

/**
 * Goes through all message's headers and finds subject info
 * @param {Array} headers array of headers
 */
    getSubjectFromHeaders(headers) {
    for(let obj of headers) {
        if(obj.name === "Subject")
        return obj.value;
    }
}
};

module.exports = new MessagesAPI();