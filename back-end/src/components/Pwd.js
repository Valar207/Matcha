const { sendMail, createToken } = require("./Tools");
const checkForm = require("./CheckForm");
const { updateTable, selectinTable } = require("./Queries");
const bcrypt = require("bcrypt");

const resetPwd = async (req, res) => {
    const email = req.body.email;
    const res_user = await selectinTable("*", "users", "email", email);

    if (res_user[0]) {
        const resetpwdToken = createToken(email, res_user[0].username);
        const html = `
    <body>
        To reset your password, please click on the link above<br><br>

        <a href="http://localhost:3000/resetPwd/NewPwd?email=${email}&&token=${resetpwdToken}">Reset your password</a><br><br>


        ---------------<br><br>
        This is an automatic email, please do not reply
    </body>`;

        if (updateTable("users", "tokenreset", "'" + resetpwdToken + "'", "email", email)) {
            sendMail(email, "resetpassword", html);
            res.send({ success: true });
        } else console.log(" cant update");
    } else res.send({ succes: false });
};

const newPwd = async (req, res) => {
    var token = req.query.token;
    var email = req.query.email;

    const res_token = await selectinTable("tokenreset", "users", "tokenreset", token);
    const res_email = await selectinTable("email", "users", "email", email);

    if (res_token[0] && res_email[0]) {
        res.send({
            status: "ok",
            email: email,
        });
    } else res.send({ error: "errorToken" });
};

const setNewpwd = async (req, res) => {
    const user = req.body;
    const error = checkForm(user);

    if (error.pwd === "empty" || error.cpwd === "empty") {
        res.send({
            status: "empty",
            error: error,
        });
    } else if (error.pwd === "err-input" || error.cpwd === "err-input") {
        res.send({
            status: "err-input",
            error: error,
        });
    } else {
        const saltRounds = 10;
        bcrypt.hash(user.pwd, saltRounds, (err, hash) => {
            updateTable("users", "pwd", "'" + hash + "'", "email", user.email);
            updateTable("users", "tokenreset", null, "email", user.email);
        });
        res.send({
            status: "success",
            error: error,
        });
    }
};

const modifPwd = async (req, res) => {
    const pwd = req.body;
    const error = checkForm(pwd);
    const hashedpwd = await selectinTable("pwd", "users", "iduser", pwd.iduser);
    const newpwd = await bcrypt.compare(pwd.oldpwd, hashedpwd[0].pwd);

    if (error.oldpwd !== "empty") {
        if (newpwd) {
            if (error.pwd !== "empty") {
                if (error.cpwd !== "empty") {
                    if (error.pwd === error.cpwd) {
                        const saltRounds = 10;
                        bcrypt.hash(pwd.pwd, saltRounds, (err, hash) => {
                            updateTable("users", "pwd", "'" + hash + "'", "iduser", pwd.iduser);
                        });
                        res.send({
                            status: "success",
                            error: error,
                        });
                    } else
                        res.send({
                            status: "pwdnotmatch",
                            error: error,
                        });
                } else
                    res.send({
                        status: "cpwdempty",
                        error: error,
                    });
            } else
                res.send({
                    status: "pwdempty",
                    error: error,
                });
        } else
            res.send({
                status: "oldpwdnotmatch",
                error: error,
            });
    } else
        res.send({
            status: "oldpwdempty",
            error: error,
        });
};

module.exports = { newPwd, setNewpwd, resetPwd, modifPwd };
