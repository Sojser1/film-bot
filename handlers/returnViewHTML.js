const {type} = require("../enums/video-type.js");
const {createTitleCaseName} = require('./createTitleCaseName')

const returnViewHTML = function returnViewHTML(data) {
    try {
        let res = ``;
        Object.keys(data).forEach(janr => {
            res = res.concat(`\n${type[janr].title}ы:\n`)
            data[janr].forEach(videoInfo => {
                res = res.concat(`${createTitleCaseName(videoInfo.filmName)} - ${videoInfo.username} ${videoInfo.date}\n`)
            })
        })
        return res;
    } catch (e) {
        console.log(e)
    }
}

module.exports.returnViewHTML = returnViewHTML;