import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";

export const Activation = () => {
  var url = useLocation();

  useEffect(() => {
    axios.get("/activation" + url.search).then((res) => {
      if (res.data.status === "activated") {
        window.location = "/home?status=activated";
      } else if (res.data.status === "errorActivation") {
        window.location = "/error?error=activation";
      } else if (res.data.status === "errorToken") {
        window.location = "error?error=token";
      } else if (res.data.status === "errorUser") {
        window.location = "error?error=user";
      } else if (res.data.status === "errorUpdate") {
        window.location = "error?error=update";
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Spinner variant="light" animation="border" role="status"></Spinner>
    </div>
  );
};
