const validateAuth = require("./components/ValidateAuth");
const signinUser = require("./components/SigninUser");
const activateUser = require("./components/ActivateUser.js");
const { getMatch } = require("./components/GetMatch");
const { getMatchChat } = require("./components/GetMatchChat");
const { insertMessage } = require("./components/Queries");
const {
  getSession,
  modifProfil,
  uploadImg,
  getPhoto,
  imgProfil,
  delImg,
  setInterest,
  getInterest,
  loadMessage,
  setLike,
  logOut,
  getNotif,
  notifLu,
  putVisitNotif,
  getFullDate,
  getMessage,
  personLiked,
  markAllNotifRead,
  blockUser,
  getVisitTrafic,
  getLikeTrafic,
  getViewProfileVisit,
  getViewProfileLike,
  getProfileBlocked,
  removeProfileBlocked,
} = require("./components/Tools.js");
const { resetPwd, newPwd, setNewpwd, modifPwd } = require("./components/Pwd.js");

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
const server = require("http").createServer(app);
io = require("socket.io")(server);

const port = process.env.port || 5050;
const fileUpload = require("express-fileupload");
app.use(cors());
app.use(bodyparser.json());
app.use(fileUpload());

server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on ${port}`);
});

var users = {};

io.on("connection", (socket) => {
  socket.on("user_connected", (idUser) => {
    users[idUser] = socket.id;
  });
  socket.on("send-chat-message", ({ message, usersend, user_receive }) => {
    var fullDate = getFullDate();

    io.emit("chat-message", { usersend, user_receive, message, fullDate });
    insertMessage(usersend, user_receive.iduser, message, fullDate);
  });
});

app.post("/signup", validateAuth);
app.post("/signin", signinUser);
app.post("/session", getSession);
app.post("/home", getPhoto);
app.post("/profilmodif", modifProfil);
app.post("/resetpwd", resetPwd);
app.post("/resetpwd/NewPwd", setNewpwd);
app.post("/modifpwd", modifPwd);
app.get("/resetpwd/NewPwd", newPwd);
app.get("/activation", activateUser);
app.post("/upload", uploadImg);
app.post("/imgprofil", imgProfil);
app.post("/delete", delImg);
app.post("/setinterest", setInterest);
app.post("/getinterest", getInterest);
app.post("/match", getMatch);
app.post("/like", setLike);
app.post("/logout", logOut);
app.post("/chat", getMatchChat);
app.post("/chatContact", getMatchChat);
app.post("/notif", getNotif);
app.post("/notiflu", notifLu);
app.post("/visit", putVisitNotif);
app.post("/message", getMessage);
app.post("/loadMessage", loadMessage);
app.post("/markAllNotifRead", markAllNotifRead);
app.post("/personLiked", personLiked);
app.post("/blockUser", blockUser);
app.post("/getVisitTrafic", getVisitTrafic);
app.post("/getLikeTrafic", getLikeTrafic);
app.post("/getViewProfileVisit", getViewProfileVisit);
app.post("/getViewProfileLike", getViewProfileLike);
app.post("/getProfileBlocked", getProfileBlocked);
app.post("/removeProfileBlocked", removeProfileBlocked);
