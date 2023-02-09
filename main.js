const http = require('http');
const {Pool} = require("pg");

const {server, db} = require('./src/config.js');
const {findProcessor} = require("./src/urls.js");
const {parseBody} = require("./src/parser");

const pgClient = new Pool({
    host: db.PG_HOST,
    database: db.PG_DB,
    port: db.PG_PORT,
    user: db.PG_USER,
    password: db.PG_PASSWORD
});

// test data
const users = [
    {
        id: 1,
        login: "vasya",
        role: "ADMIN",
        isActive: true
    },
    {
        id: 2,
        login: "senia",
        role: "USER",
        isActive: true
    },
]

const routing = {
    "/users": users,
    "/users/*": (client, params) => JSON.stringify(users.filter(u=> u.id + "" === params[0])[0]),
}

const types = {
    object: (o) => JSON.stringify(o),
    string: (s) => s,
    number: (n) => n + '',
    undefined: () => 'not found',
    function: (fn, params, client) => fn(client, params),
};

const matching = [];
for (const key in routing) {
    if (key.includes('*')) {
        const rx = new RegExp(key.replace('*', '(.*)'));
        const route = routing[key];
        matching.push([rx, route]);
        delete routing[key];
    }
}

const router = (client) => {
    const { req: { url } } = client;
    let route = routing[url];
    let params = [];
    if (!route) {
        for (const rx of matching) {
            params = url.match(rx[0]);
            if (params) {
                params.shift();
                route = rx[1];
                break;
            }
        }
    }
    const type = typeof route;
    const renderer = types[type];
    return renderer(route, params, client);
};

http.createServer((req, res) => {
    res.end(`${router({ req, res })}`);
}).listen(server.PORT);

console.log(`Running server on port ${server.PORT}`);

// http.createServer((req, res) => {
//     const params = {pathVars: {}};
//     if (req.method === 'POST' || req.method === 'PUT') {
//         parseBody(req, req);
//     }
//     const proc = findProcessor(req.url, req.method, params);
//     proc(req, res, pgClient, params);
// }).listen(3000);


// http.createServer((req, response) => {
//     if (req.method === 'POST' || req.method === 'PUT') {
//         const chunks = [];
//         req.on("data", (chunk) => {
//             chunks.push(chunk);
//         });
//         req.on("end", () => {
//             console.log("all parts/chunks have arrived");
//             const data = Buffer.concat(chunks);
//             const stringData = data.toString();
//             console.log(stringData);
//             req.body = stringData;
//         });
//     }
// }).listen(3000)