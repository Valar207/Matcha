const { getAge } = require("./Tools");
const CheckForm = (users) => {
  var error = {};

  emailRegex = RegExp(
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
  );
  pwdRegex = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

  for (var name in users) {
    switch (name) {
      case "gender":
        error.gender = users.gender.length === 0 ? "empty" : "ok";
        break;
      case "orientation":
        error.orientation = users.orientation.length === 0 ? "empty" : "ok";
        break;
      case "lastname":
        if (users.lastname.length < 3 && users.lastname.length > 0) error.lastname = "err-input";
        else if (users.lastname === "") error.lastname = "empty";
        else error.lastname = "ok";
        break;
      case "firstname":
        if (users.firstname.length < 3 && users.firstname.length > 0) error.firstname = "err-input";
        else if (users.firstname === "") error.firstname = "empty";
        else error.firstname = "ok";
        break;
      case "username":
        if (users.username.length < 3 && users.username.length > 0) error.username = "err-input";
        else if (users.username === "") error.username = "empty";
        else error.username = "ok";
        break;
      case "birthday":
        if (getAge(users.birthday) < 18 && getAge(users.birthday) >= 0) error.birthday = "you must be at least 18 years old";
        else if (getAge(users.birthday) > 100) error.birthday = "you are too old";
        else if (getAge(users.birthday) < 0) error.birthday = "err-input";
        else if (!users.birthday) error.birthday = "empty";
        else error.birthday = "ok";
        break;
      case "email":
        if (users.email === "") error.email = "empty";
        else if (emailRegex.test(users.email)) error.email = "ok";
        else error.email = "err-input";
        break;
      case "pwd":
        if (users.pwd === "") error.pwd = "empty";
        else if (!pwdRegex.test(users.pwd)) error.pwd = "err-input";
        else error.pwd = "ok";
        break;
      case "oldpwd":
        if (users.oldpwd === "") error.oldpwd = "empty";
        else if (!pwdRegex.test(users.oldpwd)) error.oldpwd = "err-input";
        else error.oldpwd = "ok";
        break;
      case "cpwd":
        if (users.cpwd !== users.pwd && users.cpwd.length > 0) error.cpwd = "err-input";
        else if (users.cpwd === "") error.cpwd = "empty";
        else error.cpwd = "ok";
        break;
    }
  }
  return error;
};

module.exports = CheckForm;
