const {getAllUsers} = require("./processors.js");

const URL_PROCESSOR_MAP = {
    "users": {
        GET: getAllUsers,
    }
}

function findProcessor(url, method) {
    const components = url.split('/').filter(u => u);
    let current;
    for (const c of components) {
        if (!current) {
            current = URL_PROCESSOR_MAP[c];
        } else {
            current = current[c];
        }
        if (!current) {
            throw Error('Incorrect URL');
        }
    }
    const proc = current[method];
    if (!proc) {
        throw Error('Method not allowed');
    }
    return proc;
}

module.exports = {
    findProcessor: findProcessor
}