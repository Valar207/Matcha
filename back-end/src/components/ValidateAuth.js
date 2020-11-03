const checkForm = require("./CheckForm");
const { selectinTable, createUser } = require("./Queries")
const { sendMail, createToken } = require("./Tools");


const validateAuth = async (req, res) => {
    var users = req.body;

    const error = checkForm(users);
    if (error.gender == "empty" ||
        error.orientation == "empty" ||
        error.firstname == "empty" ||
        error.lastname == "empty" ||
        error.username == "empty" ||
        error.birthday == "empty" ||
        error.email == "empty" ||
        error.pwd == "empty" ||
        error.cpwd == "empty") {
        res.send({
            success: "empty",
            error: error,
        })
    }
    else if (error.gender == "err-input" ||
        error.orientation == "err-input" ||
        error.firstname == "err-input" ||
        error.lastname == "err-input" ||
        error.username == "err-input" ||
        error.birthday == "err-input" ||
        error.birthday == "you must be at least 18 years old" ||
        error.email == "err-input" ||
        error.pwd == "err-input" ||
        error.cpwd == "err-input") {
        res.send({
            success: "err-input",
            error: error
        })
    }
    else {
        const res_username = await selectinTable("*", 'users', 'username', users.username)
        const res_email = await selectinTable("*", 'users', 'email', users.email)

        if (res_username[0])
            error.username = "already exist";
        if (res_email[0])
            error.email = "already exist";
        if (res_username[0] || res_email[0]) {
            res.send({
                exist: "already exist",
                message: "Please choose an other one",
                error: error
            })
        }
        else {
            var activationToken = createToken(users.email, users.username)
            const message = `
            <body>
                Welcome to matcha,<br>
        
                for activate your account, please click on this link<br><br>
                
                <a href="http://localhost:3000/activation?email=${users.email}&token=${activationToken}">activate your account</a><br><br>
        
        
                ---------------<br><br>
                This is an automatic email, please do not reply
            </body>`;

            await createUser(users, activationToken)
            sendMail(users.email, "Activate your account", message)
            res.send({
                success: true,
                error: error
            })
        }
    }
    return error;
}
module.exports = validateAuth;

