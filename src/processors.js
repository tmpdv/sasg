async function getAllUsers(req, res, db) {
    try {
        await db.connect();
        let users;
        await db.query("SELECT * FROM sas.user")
            .then(u => {
                users = u;
            })
            .catch(e => console.error(e));
        res.statusCode = 200;
        res.write(JSON.stringify(users.rows));
        res.end();
        await db.end();
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = {
    getAllUsers: getAllUsers
}