import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./components/Home/Home";

import axios from "axios";
import Cookies from "js-cookie";
import Profil from "./components/Profil/ProfilPage/ProfilPage";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Error } from "./components/Error/Error";
import { Activation } from "./components/Activation/Activation";
import { ResetPwd } from "./components/ResetPwd/ResetPwd";
import { NewPwd } from "./components/ResetPwd/NewPwd";
import { Match } from "./components/Match/Match";
import { ProfilUserPage } from "./components/Profiluserpage/Profiluserpage";
import { Chat } from "./components/Chat/Chat";
import socketIOClient from "socket.io-client";
import { useMediaQuery } from "react-responsive";


export const App = () => {
  // const [logged, setLogged] = useState(false);
  const desktop = useMediaQuery({ minWidth: 705 });
  const mobile = useMediaQuery({ maxWidth: 704 });

  const screen = {
    desktop: desktop,
    mobile: mobile
  }
  const socket = socketIOClient("http://localhost:5050");
  const [chatIcon, setChatIcon] = useState();
  const [userState, setuserState] = useState({
    logged: false,
    user: {},
    activeTag: [
      { name: "Music", value: 1, actif: 0 },
      { name: "Sport", value: 2, actif: 0 },
      { name: "Games", value: 3, actif: 0 },
      { name: "Animals", value: 4, actif: 0 },
      { name: "Party", value: 5, actif: 0 },
      { name: "Arts", value: 6, actif: 0 },
      { name: "Movies", value: 7, actif: 0 },
      { name: "Travels", value: 8, actif: 0 },
      { name: "Cooking", value: 9, actif: 0 },
      { name: "Dance", value: 10, actif: 0 },
    ],
  });

  const [usersTag] = useState([
    { name: "Music", value: 1, actif: 0 },
    { name: "Sport", value: 2, actif: 0 },
    { name: "Games", value: 3, actif: 0 },
    { name: "Animals", value: 4, actif: 0 },
    { name: "Party", value: 5, actif: 0 },
    { name: "Arts", value: 6, actif: 0 },
    { name: "Movies", value: 7, actif: 0 },
    { name: "Travels", value: 8, actif: 0 },
    { name: "Cooking", value: 9, actif: 0 },
    { name: "Dance", value: 10, actif: 0 },
  ]);

  const cookie = {
    logintoken: Cookies.get("login"),
    date: Cookies.get("date"),
  };

  useEffect(() => {
    axios.post("/session", cookie).then((res) => {
      if (res.data.user) {
        const user = res.data.user;
        axios.post("/getinterest", user).then((res) => {
          var nb_interest = 0;
          var newArr = [...userState.activeTag];

          while (res.data[nb_interest]) nb_interest++;

          userState.activeTag.map((tag) => {
            for (var i = 0; i < nb_interest; i++) {
              if (tag.value === res.data[i].interest) {
                newArr[tag.value - 1] = {
                  name: tag.name,
                  value: tag.value,
                  actif: 1,
                };
              }
            }
            return 1;
          });
          setuserState({
            logged: true,
            user: user,
            activeTag: newArr,
          });
          socket.emit("user_connected", user.iduser);
        });
      } else if (res.data.error === "error-cookie") {
        setuserState({
          logged: false,
          user: {},
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (userState.user) {
    axios.post("/chatContact", userState.user).then((res) => {
      if (res.data.contact === 0) setChatIcon(true);
      else setChatIcon(false);
    });
  }

  return (
    <React.Fragment>
      <Router>
        <Header logged={userState.logged} screen={screen} chatIcon={chatIcon} user={userState.user} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={() => <Home screen={screen} logged={userState.logged} />} />
          <Route path="/profil" component={() => <Profil user={userState.user} activeTag={userState.activeTag} screen={screen} logged={userState.logged} path="/profil" />} />
          <Route path="/profilUserPage" component={() => <ProfilUserPage user={userState.user} screen={screen} />} />
          <Route exact path="/activation" component={Activation} />
          <Route exact path="/resetPwd" component={ResetPwd} />
          <Route exact path="/resetPwd/NewPwd" component={NewPwd} />
          <Route exact path="/match" component={() => <Match user={userState.user} screen={screen} usersTag={usersTag} path="/Match" />} />
          <Route exact path="/chat" component={() => <Chat user={userState.user} screen={screen} socket={socket} />} />
          <Route component={Error} />
        </Switch>
        <Footer />
      </Router>
    </React.Fragment>
  );
};
export default App;
