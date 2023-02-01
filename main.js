const http = require('http');
const { Pool } = require("pg");

const {db} = require('./src/vars.js');
const {findProcessor} = require("./src/urls.js");

const pgClient = new Pool({
    host: db.PG_HOST,
    database: db.PG_DB,
    port: db.PG_PORT,
    user: db.PG_USER,
    password: db.PG_PASSWORD
})



http.createServer((req, res) => {
    const proc = findProcessor(req.url, req.method);
    proc(req, res, pgClient);
}).listen(3000);