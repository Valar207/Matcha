import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./ResetPwd.css";
import axios from "axios";
import { NotificationContainer, NotificationManager } from "react-notifications";

export const ResetPwd = () => {
  const [email, setEmail] = useState({
    email: "",
  });
  const getValue = (e) => {
    e.preventDefault();
    setEmail({
      email: e.target.value,
    });
  };
  const handleSubmitresetPwd = (e) => {
    e.preventDefault();

    axios
      .post("/resetPwd", email)
      .then((res) => {
        if (res.data.success === true) NotificationManager.success(`An email was send to ${email.email}`, "Success", 5000);
        else NotificationManager.error(`This email doesn't exist`, "Error", 5000);
      })
      .catch((error) => {
        console.log(error);
      });
    // window.location = 'resetPwd/NewPwd'
  };
  return (
    <div className="form-resetpwd">
      <NotificationContainer />
      <Form>
        <Form.Group>
          <Form.Label>Please enter you email adress to reset your password</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={getValue} />
        </Form.Group>
        <Button onClick={handleSubmitresetPwd} type="submit">
          Reset my password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPwd;
