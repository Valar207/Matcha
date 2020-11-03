var nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");
var moment = require("moment");
const {
  selectMatch,
  selectinTable,
  updateC1toC2,
  selectinTableWherenotAnd,
  updateTableModifprofil,
  updateTable,
  insertInterests,
  insertLikes,
  removeLikes,
  removeInterests,
  selectinTableAnd,
  removePopularity,
  addPopularity,
  insertVisit,
  selectinTableAndOrAnd,
  insertBlock,
  getTraficId,
  selectRand,
  removeBlock,
} = require("./Queries");
const checkForm = require("./CheckForm");

const getFullDate = () => {
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var hours = addZero(dateObj.getHours());
  var minutes = addZero(dateObj.getUTCMinutes());
  var seconds = addZero(dateObj.getUTCSeconds());
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
};

const getAge = (birthday) => {
  var today = new Date();
  var birthDate = new Date(birthday);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age = age - 1;
  return age;
};

const logOut = async (req, res) => {
  const iduser = req.body;
  const date = getFullDate()

  await updateTable("users", "online", "0", "iduser", iduser.iduser);
  await updateTable("users", "date_unlog", "'" + date + "'", "iduser", iduser.iduser);
  res.send({
    status: "logout",
  });
};

const sendMail = (to, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "matchanoreply207@gmail.com",
      pass: "Matcha207",
    },
  });
  var mailOptions = {
    from: "matchanoreply207@gmail.com",
    to,
    subject,
    html,
  };
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + to);
    }
  });
};

const createToken = (val1, val2) => {
  var token = jwt.sign({ value: val1 }, val2);

  return token;
};

const decryptetoken = (val1, val2) => {
  try {
    var decoded = jwt.verify(val1, val2);
    return decoded;
  } catch (err) {
    return false;
  }
};

const compareToken = (token1, token2) => {
  if (token1 === token2) return true;
  else return false;
};
const getSession = async (req, res) => {
  var logintoken = req.body.logintoken;
  var date = req.body.date;
  var iduser = decryptetoken(logintoken, date);
  const user = await selectinTable("*", "users", "iduser", iduser.value);
  if (user[0]) {
    user[0].birthday = getAge(user[0].birthday);
    res.send({ user: user[0] });
  } else res.send({ error: "error-cookie" });
};

const modifProfil = async (req, res) => {
  const checkForm = require("./CheckForm");

  var user = req.body;
  const error = checkForm(user);

  const checkusername = await selectinTableWherenotAnd("iduser", "users", "iduser", user.iduser, "username", user.username);
  const checkemail = await selectinTableWherenotAnd("iduser", "users", "iduser", user.iduser, "email", user.email);

  if (checkusername[0]) {
    error.username = "exist";
    res.send({
      status: "usernameexist",
      error: error,
    });
    console.log(error);
  } else if (checkemail[0]) {
    error.email = "exist";
    res.send({
      status: "emailexist",
      error: error,
    });
  } else if (error.firstname == "err-input" || error.lastname == "err-input" || error.username == "err-input" || error.email == "err-input") {
    res.send({
      status: "err-input",
      error: error,
    });
  } else if (error.firstname == "empty" || error.lastname == "empty" || error.username == "empty" || error.email == "empty") {
    res.send({
      status: "empty",
      error: error,
    });
  } else {
    updateTableModifprofil(user, user.iduser);
    res.send({
      status: "success",
      error: error,
    });
  }
};

// ---------------------  IMAGE ----------------------

const uploadImg = (req, res) => {
  const fs = require("fs");
  var extpath = require("path");
  const img = req.files.img;
  const name = req.files.img.name;
  const idimg = req.body.idimg;
  const iduser = req.body.iduser;
  var type = extpath.extname(`${name}`);
  const path = `/img/photos/${iduser}/${idimg}`;
  const jpg = `../front-end/public${path}` + ".jpg";
  const jpeg = `../front-end/public${path}` + ".jpeg";
  const png = `../front-end/public${path}` + ".png";

  if (fs.existsSync(jpg)) fs.unlinkSync(jpg);
  else if (fs.existsSync(jpeg)) fs.unlinkSync(jpeg);
  else if (fs.existsSync(png)) fs.unlinkSync(png);

  if (type === ".png" || type === ".jpg" || type === ".jpeg") {
    updateTable("users", idimg, "'" + path + type + "'", "iduser", iduser);
    img.mv(`../front-end/public/img/photos/${iduser}/${idimg}${type}`, (err) => {
      if (err) {
        console.log(err);
      } else
        res.send({
          status: "success",
        });
    });
  } else
    res.send({
      status: "wrongformat",
    });
};

const imgProfil = (req, res) => {
  updateTable("users", "imgprofil", "'" + req.body.img + "'", "iduser", req.body.id);
  res.send({ status: "success" });
};

const delImg = (req, res) => {
  if (updateTable("users", req.body.img, "'" + "/img/default.jpg" + "'", "iduser", req.body.iduser)) res.send({ status: "success" });
  else res.send({ status: "error" });
};

// ---------------------  INTEREST ----------------------

const setInterest = (req, res) => {
  const { value_interest, value_actif } = req.body;
  const iduser = req.body.user.iduser;

  if (value_actif === 0) {
    insertInterests(iduser, value_interest);
    res.send({
      status: "inserted",
    });
  } else if (value_actif === 1) {
    removeInterests(iduser, value_interest);
    res.send({
      status: "removed",
    });
  }
};

const getInterest = async (req, res) => {
  const iduser = req.body.iduser;
  const interests = await selectinTable("interest", "user_interests", "iduser", iduser);
  res.send(interests);
};

// ---------------------  LIKES ----------------------

const setLike = async (req, res) => {
  const { user, match } = req.body;

  const like = await selectinTableAnd("*", "likes", "iduser", user.iduser, "user_liked", match.iduser);

  if (like[0]) {
    removeLikes(user.iduser, match.iduser);
    removePopularity(match.iduser, 10);
    res.send({
      status: "removed",
    });
  } else {
    insertLikes(user.iduser, match.iduser);
    addPopularity(match.iduser, 10);
    res.send({
      status: "inserted",
    });
  }
};

const personLiked = async (req, res) => {
  const { user, match } = req.body;
  const isLike = await selectinTableAnd("*", "likes", "iduser", user.iduser, "user_liked", match.iduser);
  if (isLike[0]) {
    res.send({ liked: 1 });
  } else {
    res.send({ liked: 0 });
  }
};

// ---------------------  DISTANCE ----------------------

function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// ---------------------  NOTIF ----------------------

const getNotif = async (req, res) => {
  const iduser = req.body.user.iduser;
  const tagsSort = req.body.tagsSort;
  const eachNotif = await selectinTableAnd("*", "user_notifications", "id_user_receive", iduser, "lu", 0);

  var allNotifs = [];
  const nb_notifs = eachNotif.length;

  if (eachNotif) {
    for (var i = 0; i < eachNotif.length; i++) {
      const userSendNotif = await selectinTable("*", "users", "iduser", eachNotif[i].id_user_send);
      const tagsPerson = await selectinTable("*", "user_interests", "iduser", userSendNotif[0].iduser);
      const tags = tagsSort.map((tag) => {
        const person = tagsPerson.find(({ interest }) => interest === tag.value);
        return person ? { ...tag, actif: 1 } : tag;
      });

      switch (eachNotif[i].id_notif) {
        case 1: {
          const data = { text: userSendNotif[0].username + " vous a liké !", id: eachNotif[i].id, tag: tags, match: userSendNotif[0] };
          allNotifs.push(data);
          break;
        }
        case 2: {
          const data = { text: userSendNotif[0].username + " a visité votre profil !", id: eachNotif[i].id, tag: tags, match: userSendNotif[0] };
          allNotifs.push(data);
          break;
        }
        case 3: {
          const data = { text: userSendNotif[0].username + " vous a envoyé un message", id: eachNotif[i].id, tag: tags, match: userSendNotif[0] };
          allNotifs.push(data);
          break;
        }
        case 4: {
          const data = { text: "Vous avez matché avec " + userSendNotif[0].username + " !", id: eachNotif[i].id, tag: tags, match: userSendNotif[0] };
          allNotifs.push(data);
          break;
        }
        case 5: {
          const data = { text: userSendNotif[0].username + " vous a unmatché...", id: eachNotif[i].id, tag: tags, match: userSendNotif[0] };
          allNotifs.push(data);
          break;
        }
      }
    }
  }
  res.send({ allNotifs, nb_notifs });
};

const putVisitNotif = async (req, res) => {
  const { user, person } = req.body;
  insertVisit(person.iduser, user.iduser);
  res.send(user);
};

const notifLu = async (req, res) => {
  const { idnotif } = req.body;
  updateTable("user_notifications", "lu", 1, "id", idnotif);
  res.send();
};

const markAllNotifRead = async (req, res) => {
  const { iduser } = req.body;
  updateTable("user_notifications", "lu", 1, "id_user_receive", iduser);
  res.send();
};

// --------------------- CHAT ----------------------

const getMessage = async (req, res) => {
  const userReceive = req.body.userReceive;
  const userSend = req.body.userSend;

  const allMessage = await selectinTableAndOrAnd(
    "user_send, user_receive, message, date",
    "messages",
    "user_send",
    userSend,
    "user_receive",
    userReceive,
    "user_send",
    userReceive,
    "user_receive",
    userSend
  );
  const ProfilUserMatched = await selectinTable("*", "users", "iduser", userReceive);
  res.send({
    allMessage: allMessage,
    ProfilUserMatched: ProfilUserMatched[0],
  });
};

const loadMessage = async (req, res) => {
  userReceive = req.body[0].iduser;
  userSend = req.body[1].iduser;

  const allMessage = await selectinTableAndOrAnd(
    "user_send, user_receive, message, date",
    "messages",
    "user_send",
    userSend,
    "user_receive",
    userReceive,
    "user_send",
    userReceive,
    "user_receive",
    userSend
  );
  const ProfilUserMatched = await selectinTable("*", "users", "iduser", userReceive);
  res.send({
    allMessage: allMessage,
    ProfilUserMatched: ProfilUserMatched[0],
  });
};

// --------------------- BLOCK ----------------------

const blockUser = async (req, res) => {
  const iduserSendBlock = req.body.user.iduser;
  const iduserReceiveBlock = req.body.match.iduser;

  insertBlock(iduserSendBlock, iduserReceiveBlock);
};

const getProfileBlocked = async (req, res) => {
  const { user } = req.body;
  const idBlocked = await selectinTable("idReceiverBlock", "user_blocked", "idSenderBlock", user.iduser);
  const personBlocked = [];
  for (var i = 0; i < idBlocked.length; i++) {
    const pb = await selectinTable("*", "users", "iduser", idBlocked[i].idReceiverBlock);
    personBlocked.push(pb[0]);
  }
  res.send(personBlocked);
};

const removeProfileBlocked = async (req, res) => {
  const { iduser } = req.body;
  removeBlock(iduser);
  res.send();
};

// --------------------- TRAFIC ----------------------

const getVisitTrafic = async (req, res) => {
  const { user } = req.body;
  const traficId = await getTraficId(2, user.iduser);

  for (var i = 0; i < traficId.length; i++) {
    const pb = await selectinTable("*", "user_blocked", "idReceiverBlock", traficId[i].id_user_send);
    if (pb[0]) {
      if (pb[0].idReceiverBlock === traficId[i].id_user_send) traficId.splice(i, 1);
    }
  }
  res.send(traficId);
};

const getLikeTrafic = async (req, res) => {
  const { user } = req.body;
  const traficId = await getTraficId(1, user.iduser);

  for (var i = 0; i < traficId.length; i++) {
    const pb = await selectinTable("*", "user_blocked", "idReceiverBlock", traficId[i].id_user_send);
    if (pb[0]) {
      if (pb[0].idReceiverBlock === traficId[i].id_user_send) traficId.splice(i, 1);
    }
  }
  res.send(traficId);
};

// --------------------- HOME ----------------------

const getPhoto = async (req, res) => {
  const photo = await selectRand("img1", "users");
  res.send({
    photo: photo,
  });
};

const getViewProfileVisit = async (req, res) => {
  const iduser = req.body.user.iduser;
  const tagsSort = req.body.tagsSort;
  const eachPerson = await getTraficId(2, iduser);

  var allPersons = [];

  if (eachPerson) {
    for (var i = 0; i < eachPerson.length; i++) {
      const tagsPerson = await selectinTable("*", "user_interests", "iduser", eachPerson[i].id_user_send);

      const tags = tagsSort.map((tag) => {
        const person = tagsPerson.find(({ interest }) => interest === tag.value);
        return person ? { ...tag, actif: 1 } : tag;
      });
      const age = getAge(eachPerson[i].birthday);
      eachPerson[i].age = age;
      const data = { tag: tags, match: eachPerson[i] };
      allPersons.push(data);
    }
  }
  res.send({ allPersons });
};

const getViewProfileLike = async (req, res) => {
  const iduser = req.body.user.iduser;
  const tagsSort = req.body.tagsSort;
  const eachPerson = await getTraficId(1, iduser);

  var allPersons = [];

  if (eachPerson) {
    for (var i = 0; i < eachPerson.length; i++) {
      const tagsPerson = await selectinTable("*", "user_interests", "iduser", eachPerson[i].id_user_send);

      const tags = tagsSort.map((tag) => {
        const person = tagsPerson.find(({ interest }) => interest === tag.value);
        return person ? { ...tag, actif: 1 } : tag;
      });

      const age = getAge(eachPerson[i].birthday);
      eachPerson[i].age = age;
      const data = { tag: tags, match: eachPerson[i] };
      allPersons.push(data);
    }
  }

  res.send({ allPersons });
};

module.exports = {
  getPhoto,
  getInterest,
  getSession,
  getDistance,
  decryptetoken,
  getAge,
  sendMail,
  compareToken,
  createToken,
  modifProfil,
  uploadImg,
  imgProfil,
  delImg,
  setInterest,
  setLike,
  logOut,
  getNotif,
  notifLu,
  putVisitNotif,
  getMessage,
  markAllNotifRead,
  getFullDate,
  personLiked,
  blockUser,
  loadMessage,
  getVisitTrafic,
  getLikeTrafic,
  getViewProfileVisit,
  getViewProfileLike,
  getProfileBlocked,
  removeProfileBlocked,
};
