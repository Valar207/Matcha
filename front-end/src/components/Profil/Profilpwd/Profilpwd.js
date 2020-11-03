import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "./Profilpwd";
import axios from "axios";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

export const ProfilPwd = (props) => {
  const [user, setUser] = useState({
    iduser: props.user.iduser,
    oldpwd: "",
    pwd: "",
    cpwd: "",
  });

  const [error, setError] = useState({
    oldpwd: "ok",
    pwd: "ok",
    cpwd: "ok",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/modifpwd", user).then((res) => {
      if (res.data.error.oldpwd === "empty") {
        setError({
          oldpwd: "empty",
          pwd: "ok",
          cpwd: "ok",
        });
      } else if (res.data.error.oldpwd === "err-input") {
        setError({
          oldpwd: "err-input",
          pwd: "ok",
          cpwd: "ok",
        });
      } else setError(res.data.error);

      if (res.data.status === "oldpwdempty") {
        NotificationManager.error("Please complet all field", "Error", 5000);
      } else if (res.data.status === "oldpwdnotmatch") {
        setError({
          ...error,
          oldpwd: "err-input",
          pwd: "ok",
          cpwd: "ok",
        });
        NotificationManager.error("Please enter correct password", "Error", 5000);
      } else if (res.data.status === "success") NotificationManager.success("Your password as been changed", "Success", 5000);
    });
  };

  return (
    <Container >
      <Container className="profilContainer">
        <NotificationContainer />
        <h4>Modify password :</h4>
        <br />
        <Form>
          <Form.Group>
            <Form.Label>Enter your old password</Form.Label>
            <Form.Control
              name="oldpwd"
              placeholder="Old password"
              type="password"
              value={user.oldpwd}
              onChange={handleChange}
              className={error.oldpwd !== "ok" ? "error-input" : ""}
            />
            {error.oldpwd === "empty" && <p className="error-text">Please enter your password</p>}
            {error.oldpwd === "err-input" && <p className="error-text">Wrong password</p>}
          </Form.Group>

          <Form.Group style={{ marginTop: "35px" }}>
            <Form.Label>Enter your new password</Form.Label>
            <Form.Control
              name="pwd"
              placeholder="Password"
              type="password"
              value={user.pwd}
              onChange={handleChange}
              className={error.pwd !== "ok" ? "error-input" : ""}
            />
            <Form.Text className="text-white">Must contain 8 characters, at least one letter, one number and one special character</Form.Text>
            {error.pwd === "empty" && <p className="error-text">Please enter a password</p>}
            {error.pwd === "err-input" && (
              <p className="error-text">Must contain 8 characters, at least one letter, one number and one special character</p>
            )}
          </Form.Group>

          <Form.Group style={{ marginTop: "30px" }}>
            <Form.Label>Confirm your new password</Form.Label>
            <Form.Control
              name="cpwd"
              placeholder="Confirm password"
              type="password"
              value={user.cpwd}
              onChange={handleChange}
              className={error.cpwd !== "ok" ? "error-input" : ""}
            />
            {error.cpwd === "empty" && <p className="error-text">Please confirm your password</p>}
            {error.cpwd === "err-input" && <p className="error-text">Password not match</p>}
          </Form.Group>
          <br />
          <Button
            className="setting-btn "
            onClick={handleSubmit}
          >
            Modifier
        </Button>
        </Form>
      </Container>
    </Container>
  );
};

export default ProfilPwd;
