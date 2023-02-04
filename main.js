const http = require('http');
const { Pool } = require("pg");

const {db} = require('./src/vars.js');
const {findProcessor} = require("./src/urls.js");
const {parseBody} = require("./src/parser");

const pgClient = new Pool({
    host: db.PG_HOST,
    database: db.PG_DB,
    port: db.PG_PORT,
    user: db.PG_USER,
    password: db.PG_PASSWORD
})



// http.createServer((req, res) => {
//     const params = {pathVars: {}};
//     if (req.method === 'POST' || req.method === 'PUT') {
//         parseBody(req, req);
//     }
//     const proc = findProcessor(req.url, req.method, params);
//     proc(req, res, pgClient, params);
// }).listen(3000);


http.createServer((request, response) => {
    const chunks = [];
    request.on("data", (chunk) => {
        chunks.push(chunk);
    });
    request.on("end", () => {
        console.log("all parts/chunks have arrived");
        const data = Buffer.concat(chunks);
        const stringData = data.toString();
        console.log(stringData);
        request.body = stringData;
    });
}).listen(3000)