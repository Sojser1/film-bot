const fs = require('fs');
const path = require('../const/path').path

const save = function save(type, name, username, date) {
    console.log(path)
    try {
        const d = new Date(date * 1000).toLocaleDateString();
        const time = new Date(date * 1000).toLocaleTimeString();
        fs.readFile(path.pathFilm, (e, data) => {
            let list;
            if (data) {
                list = JSON.parse(data);
            } else {
                list = {};

            }
            if (!list[type]) {
                list[type] = [];
            }
            const newVideoObject = {
                filmName: name,
                username,
                date: `${d} ${time}`
            };

            list[type].push(newVideoObject);
            fs.writeFile(path.pathFilm, JSON.stringify(list), (e, r) => {
            });
        })
    } catch (e) {
        console.log(e)
    }

}

module.exports.save = save;