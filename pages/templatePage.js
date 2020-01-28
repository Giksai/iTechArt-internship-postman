const log4js = require('../loggerConfig/loggerConfigurator'),
    {BasePage} = require('./basePage');

const logger = log4js.getLogger('default');

const selectors = {

};

class TemplatePage extends BasePage {

};

module.exports = new TemplatePage();