const fs = require('fs/promises');
const path = require('path');

const readFile = async () => {
    const data = await fs.readFile(path.resolve(__dirname, './talker.json'));
    return JSON.parse(data);
};

module.exports = { readFile };