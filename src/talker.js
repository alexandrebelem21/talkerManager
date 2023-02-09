const fs = require('fs/promises');
const path = require('path');

const readFile = async () => {
    const data = await fs.readFile(path.resolve(__dirname, './talker.json'));
    return JSON.parse(data);
};

const writeFile = async () => {
    const read = await readFile();

    return fs.writeFile(path.resolve(__dirname, './talker.json'), JSON.stringify(read));
};

module.exports = { readFile, writeFile };