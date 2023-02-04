const {parseJson, validateUser} = require("./validator");

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
    } catch (e) {
        console.error(e.message);
    } finally {
        res.end();
        // await db.end();
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

async function createUser(req, res, db, params) {
    try {
        const user = new UserCreateDto(req.body);
        const val = validateUser(user);
        if (val.isValid()) {
            await db.connect();
            await db.query("INSERT INTO sas.user(login, role, is_active) VALUES ($1, $2, $3)",
                [user.login, user.role, user.isActive])
                .catch(e => console.error(e));
            res.statusCode = 200;
            res.write(JSON.stringify(user));
        } else {
            res.statusCode = 400;
            res.write(JSON.stringify(val.errors));
        }
    } catch (e) {
        res.statusCode = 500;
        res.write("Something went wrong");
    } finally {
        res.end();
        // await db.end();
    }
}

module.exports = {
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    createUser: createUser
}