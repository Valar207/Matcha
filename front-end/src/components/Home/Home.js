import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Image } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Home.css";
import axios from "axios";

export const Home = (props) => {
  let params = new URLSearchParams(useLocation().search);
  const [photo, setPhoto] = useState([]);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status

    axios.post("/home").then((res) => {
      if (isMounted)
        setPhoto(res.data.photo);
    });
    if (params.get("status") === "activated")
      NotificationManager.success("You can now sign in !", "succes", 3000);
    else if (params.get("status") === "resetpwd")
      NotificationManager.success("Your password has been updated !", "succes", 3000);
    var id = window.setTimeout(function () { }, 0);
    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 2540 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 2540, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Container className="homepage" fluid>
      {props.logged ? <Image src="/img/homepageLogged.jpg" /> : <Image src="/img/homepage.jpg" />}
      <div className="carousel">
        <Carousel itemClass="carousel-item-padding" responsive={responsive} showDots={true}>
          {photo.map((photo, index) => (
            <Image key={index} src={photo.img1} />
          ))}
        </Carousel>
      </div>
      ;
    </Container>
  );
};
