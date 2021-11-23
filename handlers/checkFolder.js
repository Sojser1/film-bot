const {path} = require('../const/path')
const fs = require('fs')

const checkFolder = function () {
    try {
        return fs.existsSync(path.path);
    } catch (e) {

    }
}

module.exports.checkFolder = checkFolder;