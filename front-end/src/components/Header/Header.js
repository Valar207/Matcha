import React, { useEffect, useState } from "react";
import * as b from "react-bootstrap";
import Modalregister from "../Modalregisterlogin/Modalregisterlogin";
import Cookies from "js-cookie";
import { ButtonGroup, Dropdown, DropdownButton, Badge } from "react-bootstrap";
import "./Header.css";
import { BoxArrowRight, ChatQuote, Bell, List, Person } from "react-bootstrap-icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

export const Header = (props) => {
  const user = props.user;
  const chatIcon = props.chatIcon;
  const [tagsSort] = useState([
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
  const logout = () => {
    Cookies.remove("login");
    Cookies.remove("date");
    axios.post("/logout", user);
    window.location = "/home";
  };

  const [notifs, setNotifs] = useState([]);
  const [nb_notifs, setNbNotifs] = useState();
  var [setTime, setSetTime] = useState(0);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    if (isMounted) {
      axios.post("/notif", { user, tagsSort }).then((res) => {
        setNotifs(res.data.allNotifs);
        setNbNotifs(res.data.nb_notifs);
      });
    }
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, [user, setTime]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTimeout(() => {
      setSetTime((setTime += 1)); // eslint-disable-line react-hooks/exhaustive-deps
    }, 1000);
  });

  const notifLu = (notif) => {
    const idnotif = notif.id;
    axios.post("/notiflu", { idnotif }).then((res) => {
      axios.post("/notif", { user, tagsSort }).then((res) => {
        setNotifs(res.data.allNotifs);
        setNbNotifs(res.data.nb_notifs);
      });
    });
  };

  const markAllNotifRead = (user) => {
    const iduser = user.iduser;
    axios.post("/markAllNotifRead", { iduser }).then((res) => { });
  };
  return (
    <>
      {/* laptop & desktop */}

      {props.screen.desktop && (
        <b.Navbar>
          <b.Navbar.Brand href="/home">
            <img alt="" src="/img/logo.png" width="120" className="d-inline-block align-top" />
          </b.Navbar.Brand>
          <b.Navbar.Collapse className="justify-content-end">
            {props.logged
              ? [
                <b.Nav.Link key={2} href="/Match" className="match-btn">
                  Find your love
                </b.Nav.Link>,
                <b.Nav.Link key={1} href="/profil/user">
                  <Person className="header-btn" />
                </b.Nav.Link>,
                <b.Nav.Link key={3} href="/chat" disabled={chatIcon} user={user}>
                  <ChatQuote className="header-btn" href="/chat" user={user} />
                </b.Nav.Link>,
                nb_notifs === 0 ? (
                  <DropdownButton key={4} alignRight as={ButtonGroup} title={<Bell className="header-btn" />} className="notif-btn">
                    <Dropdown.Item eventKey="1" disabled>
                      Aucune notification
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                    <DropdownButton key={5} alignRight as={ButtonGroup} title={<Bell className="header-btn" />} className="notif-btn">
                      <Dropdown.Item onClick={() => markAllNotifRead(user)}>Mark all as read</Dropdown.Item>
                      <Dropdown.Divider />
                      <div className="notif-overflow">
                        {notifs.map((notif, i) => {
                          return (
                            <Link
                              key={i}
                              className="link-notif"
                              onClick={() => notifLu(notif)}
                              to={{
                                pathname: `/profiluserpage/${notif.match.username}`,
                                state: { match: notif.match, tag: notif.tag, user: user },
                              }}
                            >
                              {notif.text}
                            </Link>
                          );
                        })}
                      </div>
                    </DropdownButton>
                  ),
                nb_notifs !== 0 ? (
                  <Badge key={7} className="notif-badge" variant="danger">
                    {nb_notifs}
                  </Badge>
                ) : null,
                <BoxArrowRight key={8} className="logout-btn" onClick={logout} />,
              ]
              : [<Modalregister key={2} page="SIGN IN" tab="login" />, <Modalregister key={1} page="SIGN UP" tab="register" />]}
          </b.Navbar.Collapse>
        </b.Navbar>
      )}

      {/* tablet & mobile */}

      {props.screen.mobile && (
        <b.Navbar>
          <b.Navbar.Brand href="/home">
            <img alt="" src="/img/logo-mobile.png" width="48" className="d-inline-block align-top logo-mobile" />
          </b.Navbar.Brand>
          <b.Navbar.Collapse className="justify-content-end">
            {props.logged
              ? [
                <b.Nav.Link key={2} href="/Match" className="match-btn-mobile">
                  <img alt="" src="/img/search-love.png" width="45" />
                </b.Nav.Link>,
                nb_notifs === 0 ? (
                  <DropdownButton key={4} alignRight as={ButtonGroup} title={<Bell className="header-btn" />} className="notif-btn">
                    <Dropdown.Item eventKey="1" disabled>
                      Aucune notification
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                    <DropdownButton key={5} alignRight as={ButtonGroup} title={<Bell className="header-btn" />} className="notif-btn">
                      <Dropdown.Item onClick={() => markAllNotifRead(user)}>Mark all as read</Dropdown.Item>
                      <Dropdown.Divider />
                      <div className="notif-overflow">
                        {notifs.map((notif, i) => {
                          return (
                            <Link
                              key={i}
                              className="link-notif"
                              onClick={() => notifLu(notif)}
                              to={{
                                pathname: `/profiluserpage/${notif.match.username}`,
                                state: { match: notif.match, tag: notif.tag, user: user },
                              }}
                            >
                              {notif.text}
                            </Link>
                          );
                        })}
                      </div>
                    </DropdownButton>
                  ),
                nb_notifs !== 0 ? (
                  <Badge key={7} className="notif-badge" variant="danger">
                    {nb_notifs}
                  </Badge>
                ) : null,
                <NavDropdown key={1} alignRight className="menu-mobile-btn" title={<List className="header-btn" />}>
                  <NavDropdown.Item href="/profil/user">
                    <Person className="header-btn" />
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/chat" disabled={chatIcon} user={user}>
                    <ChatQuote className="header-btn" />
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <BoxArrowRight className="logout-btn" onClick={logout} />
                  </NavDropdown.Item>
                </NavDropdown>,
              ]
              : [<Modalregister key={2} page="SIGN IN" tab="login" />, <Modalregister key={1} page="SIGN UP" tab="register" />]}
          </b.Navbar.Collapse>
        </b.Navbar>
      )}
    </>
  );
};
