const { selectinTableOr, selectinTable, updateTable } = require("./Queries")
const bcrypt = require("bcrypt");
const { createToken, decryptetoken } = require("./Tools");


const signinUser = async (req, res) => {
    var user = req.body;
    var error = {};
    const activated = await selectinTable("activation", "users", "username", user.username)

    for (var name in user) {
        switch (name) {
            case 'username':
                error.username = user.username.length === 0 ? 'empty' : 'ok';
            case 'pwd':
                error.pwd = user.pwd.length === 0 ? 'empty' : 'ok'
        }
    }
    if (error.username === 'empty' || error.pwd === 'empty')
        res.send({
            success: "empty",
            error: error,
        })
    else {
        const res_user = await selectinTableOr('*', 'users', 'username', user.username, 'email', user.username)

        if (res_user[0]) {
            const cmp_pwd = await bcrypt.compare(user.pwd, res_user[0].pwd)

            if (cmp_pwd === false) {
                error.pwd = 'err-input'
                res.send({
                    success: "err-input",
                    error: error,
                })
            }
            else if (activated[0].activation === 1) {
                const newdate = JSON.stringify(Date.now())
                const logintoken = createToken(res_user[0].iduser, newdate)

                await updateTable("users", "latitude", user.latitude, "username", user.username);
                await updateTable("users", "longitude", user.longitude, "username", user.username);
                await updateTable("users", "online", "1", "username", user.username);

                res.send({
                    success: true,
                    error: error,
                    token: logintoken,
                    date: newdate
                })

            } else
                res.send({
                    success: 'notactivate',
                    error: error
                })
        }
        else {
            error.username = 'err-input';
            error.pwd = 'err-input';
            res.send({
                success: "err-input",
                error: error,
            })
        }
    }
}


module.exports = signinUser;