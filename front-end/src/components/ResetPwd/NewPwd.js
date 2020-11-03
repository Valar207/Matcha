import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./ResetPwd.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Error from "../Error/Error";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

export const NewPwd = () => {
  const [reset, setReset] = useState(false);
  const [user, setUser] = useState({
    email: "",
    pwd: "",
    cpwd: "",
  });
  const [error, setError] = useState({
    email: "ok",
    pwd: "ok",
    cpwd: "ok",
  });
  var url = useLocation();

  axios.get("/resetpwd/NewPwd" + url.search).then((res) => {
    if (res.data.status === "ok") {
      setReset(true);
      user.email = res.data.email;
    }
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/resetPwd/NewPwd", user).then((res) => {
      setError(res.data.error);
      if (res.data.status === "success") {
        NotificationManager.success("Your password was changed", "Success", 5000);
        window.location = "/home?status=resetpwd";
      }
      if (res.data.status === "empty") NotificationManager.error("Please enter all field", "Error", 5000);
      if (res.data.status === "err-input") NotificationManager.error("Wrong input, please try again", "Error", 5000);
      if (res.data.status === "not-match") NotificationManager.error("password and confirm password not match", "Error", 5000);
    });
  };

  if (reset) {
    return (
      <div className="form-resetpwd">
        <NotificationContainer />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Please enter your new password</Form.Label>
            <Form.Control
              name="pwd"
              type="password"
              placeholder="Enter new password"
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
          <Form.Group style={{ marginTop: "35px" }}>
            <Form.Label>Please confirm your password</Form.Label>
            <Form.Control
              name="cpwd"
              type="password"
              placeholder="Confirm password"
              value={user.cpwd}
              onChange={handleChange}
              className={error.cpwd !== "ok" ? "error-input" : ""}
            />
            {error.cpwd === "empty" && <p className="error-text">Please confirm your password</p>}
            {error.cpwd === "err-input" && <p className="error-text">Password not match</p>}
          </Form.Group>
          <br />
          <Button type="submit">Reset my password</Button>
        </Form>
      </div>
    );
  } else return <Error />;
};

export default NewPwd;
