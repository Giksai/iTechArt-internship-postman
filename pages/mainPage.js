const BasePage = require('./basePage');

const selectors = {
    login: `//a[text()="Sign In "]`,
};
const adress = '/';

class MainPage extends BasePage {
    selectors = selectors

    open() {
        super.open(adress);
    }
};

module.exports = new MainPage();