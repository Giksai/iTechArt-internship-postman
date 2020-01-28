const fs = require('fs');

/**
 * Makes log directory if it does not exist
 */
try {
  fs.mkdirSync('./logs');
} catch (e) {
  if (e.code !== 'EEXIST') {
    console.error("Could not set up log directory, error was: ", e);
    process.exit(1);
  }
}

const log4js = require('log4js');
log4js.configure('./loggerConfig/log4js.json');

module.exports = log4js;