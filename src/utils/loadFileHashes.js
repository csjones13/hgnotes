const fs = require('fs');
const { jParse }  = require('./jsonParse');

const fileHashLoader = (path) => {
    //get json file
    const pathToFile = path || './fileHashes.json';
    if (!fs.existsSync(pathToFile)) {
        throw new Error(`File not found: ${pathToFile}`);
    }

    let fileData;
    //read file
    try {
        fileData = fs.readFileSync(pathToFile, 'utf8'); 
    } catch (err) {
        console.error('Error reading file:', err);
    }

    let fileHashes = jParse(fileData);

    return fileHashes;
}


module.exports = { fileHashLoader };