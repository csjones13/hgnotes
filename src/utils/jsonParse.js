const jParse = (json) => {
    if (typeof json === 'string') {
        try {
            return JSON.parse(json);
        } catch (error) {
            throw new Error(`JSON parse error: ${error.message}`);
        }
    } else if (typeof json === 'object' && json !== null) {
        return json; // Already a valid object
    } else {
        throw new Error('Input is not a valid JSON string or object');
    }
}

const jEncode = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            throw new Error(`JSON stringify error: ${error.message}`);
        }
    } else {
        throw new Error('Input is not a valid object');
    }
}

module.exports = { jParse, jEncode };