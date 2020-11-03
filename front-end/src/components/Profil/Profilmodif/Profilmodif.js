import React, { useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import "./Profilmodif.css";
import axios from "axios";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

export const ProfilModif = (props) => {
  const data = props.user;
  const [user, setUser] = useState(data);
  const [error, setError] = useState({
    lastname: "ok",
    firstname: "ok",
    birthday: "ok",
    email: "ok",
    username: "ok",
    gender: "ok",
    orientation: "ok",
  });

  var disable = false;
  if (JSON.stringify(user) === JSON.stringify(data)) disable = true;

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("/profilmodif", user).then((res) => {
      setError(res.data.error);
      if (res.data.status === "success") NotificationManager.success("Your profil has been changed", "Success", 5000);
      else if (res.data.status === "usernameexist") NotificationManager.error("This username already exist", "Error", 5000);
      else if (res.data.status === "emailexist") NotificationManager.error("this email already exist", "Error", 5000);
      else if (res.data.status === "err-input") NotificationManager.error("Wrong input", "Error", 5000);
      else if (res.data.status === "empty") NotificationManager.error("Please complet all filed", "Error", 5000);
    });
  };

  return (
    <Container>
      <Container className={props.screen.desktop === true ? "profilContainer" : "profilContainer-mobile"}>
        <NotificationContainer />
        <h4>Modify profil :</h4>
        <br />
        <Form.Group className="mb-4">
          <Row>
            <Col md="2">
              <Form.Label>Gender:</Form.Label>
            </Col>
            <Col md="10">
              <Form.Check name="gender" value="male" inline label="Male" type="radio" onChange={handleChange} checked={user.gender === "male"} />
              <Form.Check name="gender" value="female" inline label="Female" type="radio" checked={user.gender === "female"} onChange={handleChange} />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-4">
          <Row>
            <Col md="2">
              <Form.Label>Orientation:</Form.Label>
            </Col>
            <Col md="10">
              <Form.Check
                name="orientation"
                value="hetero"
                inline
                label="Hétérosexual"
                type="radio"
                checked={user.orientation === "hetero"}
                onChange={handleChange}
              />
              <Form.Check
                name="orientation"
                value="homo"
                inline
                label="Homosexual"
                type="radio"
                checked={user.orientation === "homo"}
                onChange={handleChange}
              />
              <Form.Check
                name="orientation"
                value="bi"
                inline
                label="Bisexual"
                type="radio"
                checked={user.orientation === "bi"}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Form.Group>
        <Row>
          <Col md="6">
            <Form.Group className="mb-4">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                name="lastname"
                placeholder={user.lastname}
                type="text"
                onChange={handleChange}
                className={error.lastname !== "ok" ? "error-input" : ""}
              />
              {error.lastname === "empty" && <p className="error-text">Please enter your lastname</p>}
              {error.lastname === "err-input" && <p className="error-text">must contain 3 character</p>}
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="mb-4">
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                name="firstname"
                placeholder={user.firstname}
                type="text"
                onChange={handleChange}
                className={error.firstname !== "ok" ? "error-input" : ""}
              />
              {error.firstname === "empty" && <p className="error-text">Please enter your firstname</p>}
              {error.firstname === "err-input" && <p className="error-text">Must contain 3 character</p>}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Form.Group className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                placeholder={user.username}
                type="text"
                onChange={handleChange}
                className={error.username !== "ok" ? "error-input" : ""}
              />
              {error.username === "empty" && <p className="error-text">Please enter a username</p>}
              {error.username === "err-input" && <p className="error-text">Must contain 3 character</p>}
              {error.username === "exist" && <p className="error-text">This username already exist</p>}
            </Form.Group>
          </Col>
          <Col md="6">
            <Form.Group className="mb-4">
              <Form.Label>Email adress</Form.Label>
              <Form.Control
                name="email"
                placeholder={user.email}
                type="email"
                onChange={handleChange}
                className={error.email !== "ok" ? "error-input" : ""}
              />
              {error.email === "empty" && <p className="error-text">Please enter a email</p>}
              {error.email === "err-input" && <p className="error-text">Wrong email</p>}
              {error.email === "exist" && <p className="error-text">This email already exist</p>}
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control name="bio" placeholder={user.bio} className="bio" as="textarea" onChange={handleChange} />
        </Form.Group>
        <Button
          className="setting-btn"
          disabled={disable}
          onClick={handleSubmit}
        >
          Modify
      </Button>
      </Container>
    </Container>

  );
};
export default ProfilModif;
