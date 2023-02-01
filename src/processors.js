async function getAllUsers(req, res, db, params) {
    try {
        await db.connect();
        let users;
        await db.query("SELECT * FROM sas.user")
            .then(u => {
                users = u.rows;
            })
            .catch(e => console.error(e));
        res.statusCode = 200;
        res.write(JSON.stringify(users));
        res.end();
        await db.end();
    } catch (e) {
        console.error(e.message);
    }
}

async function getUserById(req, res, db, params) {
    const userId = params.pathVars["userId"];
    try {
        await db.connect();
        let user;
        await db.query("SELECT * FROM sas.user u where u.id = $1", [userId.value])
            .then(u => {
                user = u.rows[0];
            })
            .catch(e => {
                console.error(e.message);
            });
        if (user) {
            res.statusCode = 200;
            res.write(JSON.stringify(user));
        } else {
            res.statusCode = 404;
            res.write("User not found");
        }
    } catch (e) {
        res.statusCode(500);
        res.write(e.message);
    } finally {
        res.end();
        // await db.end();
    }
}

module.exports = {
    getAllUsers: getAllUsers,
    getUserById: getUserById
}