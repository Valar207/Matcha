const { selectinTable, updateTable } = require("./Queries");
const { compareToken, createToken } = require("./Tools");
const fs = require("fs");

const activateUser = async (req, res) => {
  var token = req.query.token;
  var email = req.query.email;
  const res_email = await selectinTable("*", "users", "email", email);
  var iduser = res_email[0].iduser;

  if (res_email[0]) {
    if (res_email[0].activation === 0) {
      if (compareToken(token, res_email[0].tokenactivation)) {
        if (updateTable("users", "activation", 1, "email", email)) {
          var user = await selectinTable("*", "users", "email", email);
          updateTable("users", "tokenactivation", null, "email", email);
          fs.mkdir(`../front-end/public/img/photos/${iduser}`, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("New directory successfully created.");
            }
          });

          res.send({ status: "activated" });
        } else res.send({ status: "errorUpdate" });
      } else res.send({ status: "errorToken" });
    } else res.send({ status: "errorActivation" });
  } else res.send({ status: "errorEmail" });
};

module.exports = activateUser;
