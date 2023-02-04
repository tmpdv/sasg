function parseBody(req, res) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        try {
            req.body = JSON.parse(body);
        } catch (e) {
            res.statusCode = 400;
            res.write("Request body is not a valid JSON");
            res.end();
        }
    });
}

module.exports = {
    parseBody: parseBody
}