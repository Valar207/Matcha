import React, { useEffect } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useLocation } from "react-router-dom";
import { Container, Image } from 'react-bootstrap'
import './Error.css'

export const Error = () => {
  let params = new URLSearchParams(useLocation().search);

  useEffect(() => {
    if (params.get("error") === "activation") NotificationManager.error("This account is already activated !", "Error", 3000);
    else if (params.get("error") === "token" || params.get("error") === "update")
      NotificationManager.error("An error has occured! Please try again", "Error", 3000);
    else if (params.get("error") === "user") NotificationManager.error("This account doesn't exist !", "Error", 3000);
  }, [params]);

  return (
    <>
      <NotificationContainer />
      <Container fluid style={{ textAlign: "center", marginTop: "100px" }}>
        <Image src="/img/404.png" />
        <br />
        <h1 style={{ color: "#656565", fontSize: "52px" }}>Oops, Error 404</h1>
        <p style={{ fontSize: "18px" }}>No page found ! back to <a href="/home" className="homepage-link">home page </a></p>
      </Container>

    </>
  );
};

export default Error;
