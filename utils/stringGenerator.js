const crypto = require("crypto");

class StringGenerator {
    
    getRandomString(length = 10) {
        return crypto.randomBytes(length).toString('hex');
    }
};

module.exports = new StringGenerator();