const createTitleCaseName = function createTitleCaseName(name) {
    try {
        const nameArray = name.trim().split('');
        nameArray[0] = nameArray[0].toUpperCase();
        return nameArray.join('');
    } catch (e) {
        console.log(e)
    }
}

module.exports.createTitleCaseName = createTitleCaseName;