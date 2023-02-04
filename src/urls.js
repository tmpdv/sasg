const {getAllUsers, getUserById, createUser} = require("./user/processors.js");

const URL_PROCESSOR_MAP = {
    "users": {
        GET: getAllUsers,
        POST: createUser,
        var: {
            name: "userId",
            type: 'Number',
            GET: getUserById
        }
    }
}


function findProcessor(url, method, params) {
    const components = url.split('/').filter(u => u);
    let current = false;
    for (const c of components) {
        let next = nextComponent(current, c);
        if (!next) {
            next = nextComponent(current, "var");
            if (!next) {
                throw Error('Incorrect URL');
            }
            params.pathVars[next.name] = {type: next.type, value: c};
        }
        current = next;
    }
    const proc = current[method];
    if (!proc) {
        throw Error('Method not allowed');
    }
    return proc;
}

function nextComponent(current, part) {
    if (!current) {
        return URL_PROCESSOR_MAP[part];
    } else {
        return current[part];
    }
}

module.exports = {
    findProcessor: findProcessor
}