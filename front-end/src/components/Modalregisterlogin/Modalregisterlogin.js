import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Tab, Tabs } from "react-bootstrap";
import "./Modalregisterlogin.css";
import * as Icon from "react-bootstrap-icons";
import axios from "axios";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Cookies from "js-cookie";

axios.defaults.baseURL = "http://localhost:5050";

export default function Modalregisterlogin(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [user, setUser] = useState({
    lastname: "",
    firstname: "",
    birthday: "",
    email: "",
    username: "",
    gender: "",
    orientation: "",
    pwd: "",
    cpwd: "",
  });

  const [login, setLogin] = useState({
    username: "",
    pwd: "",
    latitude: 48.89671,
    longitude: 2.31842,
  });

  const [error, setError] = useState({
    lastname: "ok",
    firstname: "ok",
    birthday: "ok",
    email: "ok",
    username: "ok",
    gender: "ok",
    orientation: "ok",
    pwd: "ok",
    cpwd: "ok",
  });

  const [errorlogin, setErrorlogin] = useState({
    username: "ok",
    pwd: "ok",
  });

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    if (isMounted) {
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 27000,
        };
        navigator.geolocation.getCurrentPosition(
          //if location is allowed
          (pos) => {
            var { latitude, longitude } = pos.coords;
            if (isMounted) setLogin({ ...login, latitude, longitude });
          },
          //if location is not allowed
          () => {
            // NotificationManager.error("Wrong input", "Error", 5000)
            fetch("http://api.ipstack.com/62.210.32.149?access_key=4e404a610bf5e11ff836768c22b8e5d7")
              .then((r) => r.json())
              .then((data) => {
                var { latitude, longitude } = data;
                if (isMounted) setLogin({ ...login, latitude, longitude });
              });
          },
          options
        );
      }
    }
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeRegister = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeLogin = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRegister = (e) => {
    e.preventDefault();

    axios
      .post("/signup", user)
      .then((res) => {
        setError(res.data.error);
        if (res.data.success === true) {
          NotificationManager.success("An email has been sent to you", "Success", 5000);
          setShow(false);
        } else if (res.data.success === "err-input") {
          NotificationManager.error("Wrong input", "Error", 5000);
        } else if (res.data.exist === "already exist" && res.data.success === "err-input")
          NotificationManager.error(`${res.data.message} and check errors`, "Errors", 5000);
        else if (res.data.success === "empty") {
          NotificationManager.error("Complet all field", "Error", 5000);
        } else if (res.data.exist === "already exist") NotificationManager.error(`${res.data.message}`, "Already exist !", 5000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    axios.post("/signin", login).then((res) => {
      setErrorlogin(res.data.error);

      if (res.data.success === "notactivate") NotificationManager.error("This account is not activated", "Error", 5000);
      else if (res.data.success === true) {
        Cookies.set("login", res.data.token, { expires: 1 });
        Cookies.set("date", res.data.date, { expires: 1 });
        window.location = "/profil/user";
      } else if (res.data.success === "err-input") {
        NotificationManager.error("Wrong input", "Error", 5000);
      }
      if (res.data.success === "empty") {
        NotificationManager.error("Complet all field", "Error", 5000);
      }
    });
  };
  const forgotPwd = (e) => {
    e.preventDefault();
    window.location = "/resetPwd";
  };
  return (
    <>
      <NotificationContainer />
      <Button className="signup-in-btn" variant="primary" onClick={handleShow}>
        {props.page}
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Body className="modalregisterlogin">
          <Icon.X size={30} className="modalclose" onClick={handleClose} />
          <Tabs defaultActiveKey={props.tab} id="test">
            <Tab eventKey="register" title="INSCRIPTION">
              <Form onSubmit={handleSubmitRegister}>
                <Form.Group className="mb-4">
                  <Row>
                    <Col md="2">
                      <Form.Label>Gender:</Form.Label>
                    </Col>
                    <Col md="10">
                      <Form.Check
                        name="gender"
                        value="male"
                        inline
                        label="Male"
                        type="radio"
                        checked={user.gender === "male"}
                        onChange={handleChangeRegister}
                      />
                      <Form.Check
                        name="gender"
                        value="female"
                        inline
                        label="Female"
                        type="radio"
                        checked={user.gender === "female"}
                        onChange={handleChangeRegister}
                      />
                    </Col>
                  </Row>
                  {error.gender === "empty" && <p className="error-text">Please select your gender</p>}
                </Form.Group>
                <Form.Group className="margin0">
                  <Row>
                    <Col md="2">
                      <Form.Label> Orientation:</Form.Label>
                    </Col>
                    <Col md="10">
                      <Form.Check
                        className="test"
                        name="orientation"
                        value="hetero"
                        inline
                        label="Hétérosexual"
                        type="radio"
                        checked={user.orientation === "hetero"}
                        onChange={handleChangeRegister}
                      />
                      <Form.Check
                        name="orientation"
                        value="homo"
                        inline
                        label="Homosexual"
                        type="radio"
                        checked={user.orientation === "homo"}
                        onChange={handleChangeRegister}
                      />
                      <Form.Check
                        name="orientation"
                        value="bi"
                        inline
                        label="Bisexual"
                        type="radio"
                        checked={user.orientation === "bi"}
                        onChange={handleChangeRegister}
                      />
                    </Col>
                  </Row>
                  {error.orientation !== "ok" && <p className="error-text">Please select your orientation</p>}
                </Form.Group>
                <Form.Row>
                  <Col>
                    <Form.Control
                      name="lastname"
                      placeholder="Lastname"
                      type="text"
                      value={user.lastname}
                      onChange={handleChangeRegister}
                      className={error.lastname !== "ok" ? "error-input" : ""}
                    />
                    {error.lastname === "empty" && <p className="error-text">Please enter your lastname</p>}
                    {error.lastname === "err-input" && <p className="error-text">must contain 3 character</p>}
                  </Col>
                  <Col>
                    <Form.Control
                      name="firstname"
                      placeholder="Firstname"
                      type="text"
                      value={user.firstname}
                      onChange={handleChangeRegister}
                      className={error.firstname !== "ok" ? "error-input" : ""}
                    />
                    {error.firstname === "empty" && <p className="error-text">Please enter your firstname</p>}
                    {error.firstname === "err-input" && <p className="error-text">Must contain 3 character</p>}
                  </Col>
                </Form.Row>

                <Form.Group>
                  <Form.Control
                    name="username"
                    placeholder="Username"
                    type="text"
                    value={user.username}
                    onChange={handleChangeRegister}
                    className={error.username !== "ok" ? "error-input" : ""}
                  />
                  {error.username === "empty" && <p className="error-text">Please choose a username</p>}
                  {error.username === "err-input" && <p className="error-text">Must contain 3 character</p>}
                  {error.username === "already exist" && <p className="error-text">This username already exist</p>}

                  <Form.Control
                    name="birthday"
                    type="date"
                    value={user.birthday}
                    onChange={handleChangeRegister}
                    className={error.birthday !== "ok" ? "error-input" : ""}
                  />
                  {error.birthday === "empty" && <p className="error-text">Please select your birthday</p>}
                  {error.birthday === "err-input" && <p className="error-text">Wrong birthday</p>}
                  {error.birthday === "you must be at least 18 years old" && <p className="error-text">You must be at least 18 years old</p>}
                  {error.birthday === "you are too old" && <p className="error-text">You are too old sorry</p>}

                  <Form.Control
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={user.email}
                    onChange={handleChangeRegister}
                    className={error.email !== "ok" ? "error-input" : ""}
                  />
                  {error.email === "empty" && <p className="error-text">Please enter an email address</p>}
                  {error.email === "err-input" && <p className="error-text">Wrong email address</p>}
                  {error.email === "already exist" && <p className="error-text">This email address already exist</p>}

                  <Form.Control
                    name="pwd"
                    placeholder="Password"
                    type="password"
                    value={user.pwd}
                    onChange={handleChangeRegister}
                    className={error.pwd !== "ok" ? "error-input" : ""}
                  />
                  <Form.Text className="text-white">Must contain 8 characters, at least one letter, one number and one special character</Form.Text>
                  {error.pwd === "empty" && <p className="error-text">Please enter a password</p>}
                  {error.pwd === "err-input" && (
                    <p className="error-text">Must contain 8 characters, at least one letter, one number and one special character</p>
                  )}

                  <Form.Control
                    name="cpwd"
                    placeholder="Confirm password"
                    type="password"
                    value={user.cpwd}
                    onChange={handleChangeRegister}
                    className={error.cpwd !== "ok" ? "error-input" : ""}
                  />
                  {error.cpwd === "empty" && <p className="error-text">Please confirm your password</p>}
                  {error.cpwd === "err-input" && <p className="error-text">Password not match</p>}
                </Form.Group>
                <br />
                <Button className="button-submit" type="submit">
                  Sign up
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="login" title="CONNEXION">
              <Form onSubmit={handleSubmitLogin}>
                <Form.Control
                  name="username"
                  placeholder="Username"
                  type="text"
                  onChange={handleChangeLogin}
                  className={errorlogin.username !== "ok" ? "error-input" : ""}
                />
                {errorlogin.username === "empty" && <p className="error-text">Please enter your username</p>}
                {errorlogin.username === "err-input" && <p className="error-text">user doesn't exist</p>}

                <Form.Control
                  name="pwd"
                  placeholder="Password"
                  type="password"
                  onChange={handleChangeLogin}
                  className={errorlogin.pwd !== "ok" ? "error-input" : ""}
                />
                {errorlogin.pwd === "empty" && <p className="error-text">Please your password</p>}
                {errorlogin.pwd === "err-input" && <p className="error-text">wrong password</p>}
                <br />
                <Button className="forgot-btn" onClick={forgotPwd}>
                  Forgot password
                </Button>
                <br />
                <br />
                <Button className="button-submit" onClick={handleSubmitLogin} type="submit">
                  Sign in
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}